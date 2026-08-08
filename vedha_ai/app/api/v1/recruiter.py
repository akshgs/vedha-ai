from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.models.user import User
from app.models.company_job import CompanyJob
from app.models.application import Application
from app.models.recruitment_interview import RecruitmentInterviewSlot
from app.models.interview import InterviewSession
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.resume import ResumeAnalysis
from app.models.experience import Experience
from app.models.submission import Submission

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter Portal"],
)

def require_recruiter(user: User = Depends(get_current_user)):
    if user.role not in ["recruiter", "company", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiter, company, or admin accounts can access recruiter portal resources.",
        )
    return user

# =========================
# Schemas
# =========================

class RecruiterStats(BaseModel):
    openPostings: int
    totalApplicants: int
    shortlistedCount: int
    interviewsHeld: int

class CandidateResponse(BaseModel):
    id: int
    name: str
    targetRole: str
    skills: List[str]
    resumeScore: int
    codingSolved: int
    experienceYears: int
    matchScore: Optional[float] = None
    notes: Optional[str] = None

class ShortlistRequest(BaseModel):
    candidateId: int
    jobId: int

class ShortlistRemoveRequest(BaseModel):
    candidateId: int

class ShortlistNoteRequest(BaseModel):
    candidateId: int
    note: str

class PipelineCandidate(BaseModel):
    id: int
    name: str
    targetRole: str
    notes: Optional[str] = None

class PipelineStage(BaseModel):
    id: str
    title: str
    candidates: List[PipelineCandidate]

class MoveCandidateRequest(BaseModel):
    candidateId: int
    fromStage: str
    toStage: str

class ScheduleInterviewRequest(BaseModel):
    candidateId: int
    dateTime: str
    notes: str

# =========================
# Endpoints
# =========================

@router.get("/stats", response_model=RecruiterStats)
def get_recruiter_stats(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    open_postings = db.query(CompanyJob).filter(CompanyJob.is_active == True).count()
    total_applicants = db.query(Application).count()
    shortlisted = db.query(Application).filter(
        Application.status.in_(["Shortlisted", "Interviewing", "Resume Review", "Offered", "Hired"])
    ).count()
    interviews = db.query(RecruitmentInterviewSlot).filter(
        RecruitmentInterviewSlot.status == "booked"
    ).count()

    return {
        "openPostings": open_postings,
        "totalApplicants": total_applicants,
        "shortlistedCount": shortlisted,
        "interviewsHeld": interviews,
    }

@router.get("/candidates", response_model=List[CandidateResponse])
def get_candidates(
    query: Optional[str] = Query(None),
    minScore: int = Query(0),
    skillFilter: Optional[str] = Query(None),
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    students = db.query(User).filter(User.role == "student").all()
    candidates = []

    for s in students:
        profile = db.query(Profile).filter(Profile.user_id == s.id).first()
        resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.student_id == s.id).order_by(ResumeAnalysis.created_at.desc()).first()
        skills = db.query(Skill).filter(Skill.user_id == s.id).all()
        exps = db.query(Experience).filter(Experience.user_id == s.id).all()
        solves = db.query(Submission).filter(Submission.user_id == s.id, Submission.verdict == "accepted").count()

        # Parse target role
        target_role = "Software Engineer"
        if profile and profile.target_role:
            target_role = profile.target_role
        elif resume and resume.target_role:
            target_role = resume.target_role

        # Parse skills
        skill_names = [sk.skill_name for sk in skills]

        # Resume score
        resume_score = 75
        if resume and resume.match_percent:
            resume_score = int(resume.match_percent)
        elif profile and profile.career_readiness:
            resume_score = int(profile.career_readiness)

        # Experience years
        exp_years = 0
        for exp in exps:
            try:
                if exp.start_date:
                    start = datetime.strptime(exp.start_date, "%Y-%m-%d")
                    end = datetime.utcnow()
                    if exp.end_date:
                        end = datetime.strptime(exp.end_date, "%Y-%m-%d")
                    duration_years = (end - start).days / 365.25
                    exp_years += round(duration_years)
            except Exception:
                pass
        if not exp_years and exps:
            exp_years = len(exps) # fallback 1 year per exp listing

        cand = {
            "id": s.id,
            "name": s.name,
            "targetRole": target_role,
            "skills": skill_names,
            "resumeScore": max(resume_score, 0),
            "codingSolved": solves,
            "experienceYears": max(exp_years, 0),
        }

        # Apply filters
        if query:
            q_lower = query.lower()
            if q_lower not in cand["name"].lower() and q_lower not in cand["targetRole"].lower():
                continue
        if skillFilter:
            sf_lower = skillFilter.lower()
            if not any(sf_lower in sk.lower() for sk in cand["skills"]):
                continue
        if cand["resumeScore"] < minScore:
            continue

        candidates.append(cand)

    return candidates

@router.get("/jobs/{job_id}/rankings", response_model=List[CandidateResponse])
def get_rankings(
    job_id: int,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    job = db.query(CompanyJob).filter(CompanyJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found.")

    job_skills = []
    if job.skills:
        job_skills = [sk.strip().lower() for sk in job.skills.split(",") if sk.strip()]

    # Query all students
    students = db.query(User).filter(User.role == "student").all()
    rankings = []

    for s in students:
        profile = db.query(Profile).filter(Profile.user_id == s.id).first()
        resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.student_id == s.id).order_by(ResumeAnalysis.created_at.desc()).first()
        skills = db.query(Skill).filter(Skill.user_id == s.id).all()
        exps = db.query(Experience).filter(Experience.user_id == s.id).all()
        solves = db.query(Submission).filter(Submission.user_id == s.id, Submission.verdict == "accepted").count()

        target_role = profile.target_role if profile and profile.target_role else "Software Engineer"
        skill_names = [sk.skill_name for sk in skills]

        resume_score = 75
        if resume and resume.match_percent:
            resume_score = int(resume.match_percent)

        exp_years = len(exps)

        # Calculate matching score overlap
        match_score = 60.0
        if job_skills and skill_names:
            overlap = set(sk.lower() for sk in skill_names).intersection(set(job_skills))
            match_score = round((len(overlap) / len(job_skills)) * 100, 1)
            # Default minimum score for visual alignment
            match_score = max(match_score, 50.0)

        rankings.append({
            "id": s.id,
            "name": s.name,
            "targetRole": target_role,
            "skills": skill_names,
            "resumeScore": resume_score,
            "codingSolved": solves,
            "experienceYears": exp_years,
            "matchScore": match_score,
        })

    # Sort rankings by matchScore descending
    rankings.sort(key=lambda x: x["matchScore"], reverse=True)
    return rankings

@router.get("/pipeline", response_model=List[PipelineStage])
def get_pipeline(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    apps = db.query(Application).all()
    
    stages = {
        "screening": [],
        "technical": [],
        "hr": [],
        "offer": []
    }

    # Map status to stage
    status_stage_map = {
        "Applied": "screening",
        "Resume Review": "screening",
        "Interviewing": "technical",
        "Shortlisted": "hr",
        "Offered": "offer",
        "Hired": "offer",
        "Rejected": "screening"
    }

    for a in apps:
        student = db.query(User).filter(User.id == a.student_id).first()
        if student:
            profile = db.query(Profile).filter(Profile.user_id == student.id).first()
            target_role = profile.target_role if profile and profile.target_role else "Software Engineer"
            
            stage_id = status_stage_map.get(a.status, "screening")
            notes = a.cover_letter or f"Application status set to {a.status}."

            stages[stage_id].append({
                "id": student.id,
                "name": student.name,
                "targetRole": target_role,
                "notes": notes
            })

    return [
        PipelineStage(id="screening", title="Screening", candidates=stages["screening"]),
        PipelineStage(id="technical", title="Technical Round", candidates=stages["technical"]),
        PipelineStage(id="hr", title="HR Round", candidates=stages["hr"]),
        PipelineStage(id="offer", title="Offer Stage", candidates=stages["offer"]),
    ]

@router.post("/pipeline/move")
def move_candidate(
    data: MoveCandidateRequest,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    # Find application for this candidate
    app = db.query(Application).filter(Application.student_id == data.candidateId).first()
    if not app:
        raise HTTPException(status_code=404, detail="Candidate application record not found.")

    stage_status_map = {
        "screening": "Resume Review",
        "technical": "Interviewing",
        "hr": "Shortlisted",
        "offer": "Offered"
    }

    new_status = stage_status_map.get(data.toStage, "Resume Review")
    app.status = new_status
    db.commit()

    return {"message": f"Candidate stage updated to {data.toStage}."}

@router.post("/interviews/schedule")
def schedule_interview(
    data: ScheduleInterviewRequest,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    # Get any application or first company job to link
    app = db.query(Application).filter(Application.student_id == data.candidateId).first()
    job_id = app.company_job_id if app else None

    if not job_id:
        first_job = db.query(CompanyJob).first()
        if first_job:
            job_id = first_job.id
        else:
            raise HTTPException(status_code=400, detail="No active company jobs exist to associate with this interview.")

    # Parse date and time from dateTime (e.g. "2026-08-08 10:30 AM" or ISO string)
    date_str = "2026-08-08"
    time_str = "10:00 AM"
    try:
        parts = data.dateTime.split(" ")
        if len(parts) >= 2:
            date_str = parts[0]
            time_str = " ".join(parts[1:])
    except Exception:
        pass

    # Create new slot
    slot = RecruitmentInterviewSlot(
        company_job_id=job_id,
        candidate_id=data.candidateId,
        date=date_str,
        time=time_str,
        interviewer_name=current_user.name or "Corporate Partner",
        status="booked",
        details=data.notes,
    )
    db.add(slot)

    # Set application status to Interviewing
    if app:
        app.status = "Interviewing"

    db.commit()
    return {"message": "Interview invitation dispatched successfully."}

@router.get("/jobs", response_model=List[dict])
def get_recruiter_jobs(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    jobs = db.query(CompanyJob).filter(CompanyJob.is_active == True).all()
    return [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company.company_name if j.company else "Corporate Partner",
            "skills": j.skills,
        }
        for j in jobs
    ]

@router.get("/shortlist", response_model=List[CandidateResponse])
def get_shortlisted_candidates(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    # Query all applications with status == "Shortlisted"
    apps = db.query(Application).filter(Application.status == "Shortlisted").all()
    candidates = []

    for a in apps:
        student = db.query(User).filter(User.id == a.student_id).first()
        if not student:
            continue
        profile = db.query(Profile).filter(Profile.user_id == student.id).first()
        resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.student_id == student.id).order_by(ResumeAnalysis.created_at.desc()).first()
        skills = db.query(Skill).filter(Skill.user_id == student.id).all()
        exps = db.query(Experience).filter(Experience.user_id == student.id).all()
        solves = db.query(Submission).filter(Submission.user_id == student.id, Submission.verdict == "accepted").count()

        target_role = profile.target_role if profile and profile.target_role else "Software Engineer"
        skill_names = [sk.skill_name for sk in skills]

        resume_score = 75
        if resume and resume.match_percent:
            resume_score = int(resume.match_percent)

        exp_years = len(exps)

        candidates.append({
            "id": student.id,
            "name": student.name,
            "targetRole": target_role,
            "skills": skill_names,
            "resumeScore": resume_score,
            "codingSolved": solves,
            "experienceYears": exp_years,
            "matchScore": 85.0,
            "notes": a.cover_letter,
        })

    return candidates

@router.post("/shortlist")
def shortlist_candidate(
    data: ShortlistRequest,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    # Check if application already exists
    app = db.query(Application).filter(
        Application.student_id == data.candidateId,
        Application.company_job_id == data.jobId
    ).first()

    if app:
        app.status = "Shortlisted"
    else:
        app = Application(
            student_id=data.candidateId,
            company_job_id=data.jobId,
            status="Shortlisted",
            cover_letter="Shortlisted via AI Ranking Matrix."
        )
        db.add(app)

    db.commit()
    return {"message": "Candidate added to shortlist."}

@router.post("/shortlist/remove")
def remove_shortlist_candidate(
    data: ShortlistRemoveRequest,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    app = db.query(Application).filter(Application.student_id == data.candidateId).first()
    if app:
        if app.cover_letter == "Shortlisted via AI Ranking Matrix.":
            db.delete(app)
        else:
            app.status = "Resume Review"
        db.commit()

    return {"message": "Candidate removed from shortlist."}

@router.post("/shortlist/note")
def save_shortlist_note(
    data: ShortlistNoteRequest,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    app = db.query(Application).filter(Application.student_id == data.candidateId).first()
    if not app:
        raise HTTPException(status_code=404, detail="Shortlisted candidate application not found.")

    app.cover_letter = data.note
    db.commit()
    return {"message": "Evaluation notes updated."}
