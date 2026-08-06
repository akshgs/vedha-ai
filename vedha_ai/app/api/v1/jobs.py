from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.job_repository import JobRepository
from app.security.jwt import get_current_user
from app.services.job_service import JobService

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.get("/recommend")
def recommend_jobs(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        repository = JobRepository(db)
        service = JobService(repository)

        return service.recommend_jobs(
            current_user.id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

from app.models.company_job import CompanyJob
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.resume import ResumeAnalysis
from app.ai.job_matcher import calculate_job_match
from app.ai.semantic_matcher import semantic_similarity
from app.ai.role_matcher import role_match_score, is_role_relevant
import json

@router.get("/match-score/{job_id}")
def get_job_match_score(
    job_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1. Query the job
    job = db.query(CompanyJob).filter(CompanyJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job listing not found.")
        
    # 2. Extract job skills
    job_skills = []
    if job.skills:
        job_skills = [s.strip() for s in job.skills.split(",") if s.strip()]

    # 3. Retrieve student skills (prioritize resume, fallback to skill profile table)
    resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.student_id == current_user.id).order_by(ResumeAnalysis.created_at.desc()).first()
    
    student_skills = []
    target_role = "Software Engineer"
    resume_ats_score = 0.0
    
    if resume:
        target_role = resume.target_role or "Software Engineer"
        resume_ats_score = float(resume.match_percent or 0)
        try:
            student_skills = json.loads(resume.matched_skills)
        except Exception:
            pass

    # If no resume skills, check profiles table and user skills registry
    if not student_skills:
        db_skills = db.query(Skill).filter(Skill.user_id == current_user.id).all()
        student_skills = [s.skill_name for s in db_skills]
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
        if profile and profile.target_role:
            target_role = profile.target_role

    # 4. Perform calculation
    result = calculate_job_match(student_skills, job_skills)
    semantic_score = semantic_similarity(student_skills, job_skills)
    role_score = role_match_score(
        target_role=target_role,
        job_title=job.title,
        job_skills=job_skills,
        description=job.description
    )

    final_score = round(
        (role_score * 0.3)
        + (result["match_percent"] * 0.3)
        + (semantic_score * 0.2)
        + (resume_ats_score * 0.2),
        1
    )

    # Fallback score logic for beginners
    if not student_skills:
        final_score = 75.0 if is_role_relevant(target_role, job.title) else 65.0

    missing = [s for s in job_skills if s.lower() not in [x.lower() for x in result["matched_skills"]]]

    return {
        "job_id": job_id,
        "match_percent": max(final_score, 10.0), # ensure minimum score for visuals
        "matched_skills": result["matched_skills"],
        "missing_skills": missing,
        "suitability": "High Fit" if final_score >= 80 else "Medium Fit" if final_score >= 50 else "Requires Upskilling",
        "action_recommendation": f"Acquire {', '.join(missing[:2])} to align with this role requirements." if missing else "You are fully qualified for this job listing!"
    }