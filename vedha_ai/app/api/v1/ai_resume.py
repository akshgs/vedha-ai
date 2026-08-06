"""
app/api/v1/ai_resume.py
Resume AI API routes:
- Resume Builder (AI-generated sections)
- Skill Gap Analysis (prioritized learning plan)
- Detailed ATS Analysis (section-by-section)

Architecture:
  Route → ResumeAIService → RAG + LLM
  Reuses existing: upload_resume → ResumeService (unchanged)
  These are NEW endpoints that EXTEND, not replace, the existing /resume/upload.
"""
import time

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile, Form
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.repositories.ai_history_repository import AIHistoryRepository
from app.repositories.resume_repository import ResumeRepository
from app.ai.services.resume_ai_service import (
    build_resume,
    analyze_skill_gap,
    detailed_ats_analysis,
)
from app.ai.ats_score import calculate_ats_score
from app.ai.skill_matcher import calculate_role_match
from app.nlp.skill_extractor import extract_skills, ROLE_SKILLS
from app.utils.file_parser import extract_text
from app.schemas.ai import (
    ResumeBuilderRequest,
    ResumeBuilderResponse,
    SkillGapRequest,
    SkillGapResponse,
    ATSAnalysisRequest,
    ATSAnalysisResponse,
)

router = APIRouter(prefix="/ai/resume", tags=["AI Resume"])


def _log(db, user_id, feature, input_text, output_text, duration_ms, status):
    try:
        AIHistoryRepository(db).log(
            user_id=user_id,
            feature=feature,
            input_summary=input_text[:300],
            output_summary=output_text[:300],
            duration_ms=duration_ms,
            status=status,
            model_used="llama-3.3-70b-versatile",
        )
    except Exception:
        pass


@router.post("/build", response_model=ResumeBuilderResponse)
async def build_ai_resume(
    request: ResumeBuilderRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    AI Resume Builder — generates ATS-optimized resume content
    from the candidate's raw profile data.
    """
    start = time.time()

    result = await build_resume(
        target_role=request.target_role,
        experience=request.experience,
        education=request.education,
        skills=request.skills,
        projects=request.projects,
    )

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log,
        db, current_user.id, "resume_builder",
        request.target_role,
        str(result.get("estimated_ats_score", "")),
        duration_ms,
        result.get("status", "success"),
    )

    return result


@router.post("/skill-gap", response_model=SkillGapResponse)
async def skill_gap_analysis(
    request: SkillGapRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Detailed skill gap analysis with a prioritized learning roadmap.
    Can receive skills directly, or auto-populate from latest resume scan.
    """
    # Auto-populate from latest resume if not provided
    matched = request.matched_skills
    missing = request.missing_skills
    current = request.current_skills

    if not matched and not missing:
        resume_repo = ResumeRepository(db)
        latest = resume_repo.get_latest_by_student(current_user.id)
        if latest:
            import json as _json
            try:
                matched = _json.loads(latest.matched_skills)
                missing = _json.loads(latest.missing_skills)
                current = matched
            except Exception:
                pass

    if not missing:
        raise HTTPException(
            status_code=400,
            detail="Provide missing_skills or upload a resume first via /resume/upload.",
        )

    start = time.time()

    result = await analyze_skill_gap(
        target_role=request.target_role,
        current_skills=current,
        matched_skills=matched,
        missing_skills=missing,
    )

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log,
        db, current_user.id, "skill_gap",
        request.target_role,
        str(result.get("total_weeks_to_ready", "")),
        duration_ms,
        result.get("status", "success"),
    )

    return result


@router.post("/ats-detail", response_model=ATSAnalysisResponse)
async def ats_detailed_analysis(
    request: ATSAnalysisRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Full ATS analysis — section-by-section breakdown with
    improvement actions for any resume text.
    """
    start = time.time()

    result = await detailed_ats_analysis(
        resume_text=request.resume_text,
        target_role=request.target_role,
        ats_score=request.ats_score,
        matched_skills=request.matched_skills,
        missing_skills=request.missing_skills,
    )

    duration_ms = int((time.time() - start) * 1000)

    background_tasks.add_task(
        _log,
        db, current_user.id, "ats_analysis",
        request.target_role,
        str(result.get("overall_grade", "")),
        duration_ms,
        result.get("status", "success"),
    )

    return result


@router.post("/ats-from-file")
async def ats_from_file(
    file: UploadFile = File(...),
    target_role: str = Form("Machine Learning Engineer"),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a resume file → get full ATS + skill analysis in one call.
    Combines existing resume scanning with new detailed ATS analysis.
    """
    try:
        file_bytes = await file.read()

        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 5 MB).")

        resume_text = extract_text(file_bytes, file.filename)

        if len(resume_text) < 100:
            raise HTTPException(status_code=400, detail="Resume text too short to analyze.")

        if target_role not in ROLE_SKILLS:
            target_role = "Machine Learning Engineer"

        skills = extract_skills(resume_text)
        match = calculate_role_match(skills, target_role)
        ats_score = calculate_ats_score(
            resume_text=resume_text,
            match_percent=match["match_percent"],
        )

        start = time.time()

        ats_detail = await detailed_ats_analysis(
            resume_text=resume_text,
            target_role=target_role,
            ats_score=ats_score,
            matched_skills=match["matched_skills"],
            missing_skills=match["missing_skills"],
        )

        duration_ms = int((time.time() - start) * 1000)

        background_tasks.add_task(
            _log,
            db, current_user.id, "ats_from_file",
            target_role,
            str(ats_score),
            duration_ms,
            "success",
        )

        return {
            "target_role": target_role,
            "extracted_skills": skills,
            "match_percent": match["match_percent"],
            "matched_skills": match["matched_skills"],
            "missing_skills": match["missing_skills"],
            "ats_score": ats_score,
            "ats_detail": ats_detail,
        }

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


from pydantic import BaseModel

class JobMatchRequest(BaseModel):
    student_skills: list[str]
    job_description: str

@router.post("/job-match")
def match_job(
    request: JobMatchRequest,
    current_user=Depends(get_current_user),
):
    from app.ai.job_matcher import calculate_job_match
    
    # Extract skills from job description using existing NLP pipeline
    job_skills = extract_skills(request.job_description)
    
    # Calculate match overlap
    match_result = calculate_job_match(request.student_skills, job_skills)
    
    # Generate some automated feedback reasoning
    matched_count = len(match_result["matched_skills"])
    total_count = len(job_skills)
    
    alignment = "High Compatibility" if match_result["match_percent"] >= 80 else "Medium Compatibility" if match_result["match_percent"] >= 50 else "Requires Upskilling"
    
    missing = [s for s in job_skills if s not in match_result["matched_skills"]]
    
    return {
        "suitabilityScore": match_result["match_percent"],
        "alignmentReasoning": f"Your skill profile overlaps with {matched_count} out of {total_count} required skills for this role ({alignment}).",
        "suggestedAction": f"Focus on building proficiency in: {', '.join(missing[:3])} to maximize your fit." if missing else "You are fully qualified for this job description!"
    }

