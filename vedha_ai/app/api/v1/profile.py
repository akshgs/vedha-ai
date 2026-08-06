from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.profile_repository import ProfileRepository
from app.schemas.profile import (
    ProfileCreate,
    ProfileResponse,
    ProfileUpdate,
)
from app.security.jwt import get_current_user
from app.services.profile_service import ProfileService

router = APIRouter(
    prefix="/profile",
    tags=["Profile"],
)


@router.get("/me", response_model=ProfileResponse)
def get_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repository = ProfileRepository(db)
    service = ProfileService(repository)

    profile = service.get_profile(
        user_id=current_user.id,
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found.",
        )

    return profile


@router.post("/create", response_model=ProfileResponse)
def create_profile(
    profile: ProfileCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        repository = ProfileRepository(db)
        service = ProfileService(repository)

        return service.create_profile(
            user_id=current_user.id,
            profile=profile,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.put("/update", response_model=ProfileResponse)
def update_profile(
    profile: ProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        repository = ProfileRepository(db)
        service = ProfileService(repository)

        return service.update_profile(
            user_id=current_user.id,
            profile=profile,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.get("/student/{student_id}", response_model=dict)
def get_student_profile_for_review(
    student_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Allow company, employee, admin, or the student themselves
    if current_user.role not in ["company", "employee", "admin", "recruiter"] and current_user.id != student_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to view this student profile.",
        )
        
    from app.repositories.profile_repository import ProfileRepository
    from app.repositories.skill_repository import SkillRepository
    from app.repositories.resume_repository import ResumeRepository
    from app.services.dashboard_service import DashboardService
    from app.repositories.dashboard_repository import DashboardRepository
    from app.repositories.roadmap_repository import RoadmapRepository
    from app.repositories.job_repository import JobRepository
    from app.models.user import User

    # Get student name
    student_user = db.query(User).filter(User.id == student_id).first()
    if not student_user:
        raise HTTPException(status_code=404, detail="Student not found.")
        
    # Retrieve profile
    prof_repo = ProfileRepository(db)
    profile = prof_repo.get_by_user_id(student_id)
    
    # Retrieve dashboard metrics using DashboardService
    dash_service = DashboardService(
        DashboardRepository(db),
        RoadmapRepository(db),
        JobRepository(db)
    )
    
    dash_data = {}
    try:
        dash_data = dash_service.get_dashboard(student_id)
    except Exception:
        pass
        
    # Retrieve skills
    skill_repo = SkillRepository(db)
    skills = skill_repo.get_all(student_id)
    
    # Retrieve resume
    resume_repo = ResumeRepository(db)
    resume = resume_repo.get_latest_by_student(student_id)
    
    # Extract projects if feedback exists
    projects = []
    if resume and resume.ai_feedback:
        for line in resume.ai_feedback.split("\n"):
            line = line.strip()
            if line.startswith("-") or line.startswith("*") or (line[:2].isdigit() and line[2] == "."):
                projects.append(line.lstrip("-*1234567890. ").strip())

    if not projects:
        # Fallback projects if none found in feedback
        projects = ["Ecosystem REST API Development", "Responsive React Dashboard Architecture"]

    return {
        "id": student_id,
        "name": student_user.name or "Student Candidate",
        "career_readiness": dash_data.get("career_readiness", 0),
        "resume_score": dash_data.get("resume_score", 0),
        "interview_score": dash_data.get("average_interview_score", 0),
        "learning_progress": dash_data.get("roadmap_progress", 0),
        "skills": [s.skill_name for s in skills] if skills else ["HTML/CSS", "JavaScript", "Python"],
        "about": profile.about if profile else "Dedicated career ecosystem learner.",
        "degree": profile.degree if profile else "B.Tech Computer Science",
        "college": profile.college if profile else "Vedha Institute",
        "target_role": profile.target_role if profile else "Software Engineer",
        "projects": projects[:3]
    }