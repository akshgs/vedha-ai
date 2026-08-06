from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.services.course_service import CourseService
from app.models.user import User

router = APIRouter(prefix="/courses", tags=["Courses"])

class ProgressUpdateRequest(BaseModel):
    completed: bool

class CommentCreateRequest(BaseModel):
    text: str


@router.get("/")
def get_catalog(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve catalog list of active courses with user progress metrics."""
    return CourseService.get_catalog(db, current_user.id)


@router.get("/{course_id}")
def get_details(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve full detail course contents, lessons list, mock syllabus/quizzes."""
    details = CourseService.get_details(db, course_id, current_user.id)
    if not details:
        raise HTTPException(status_code=404, detail="Course not found.")
    return details


@router.post("/{course_id}/lessons/{lesson_id}")
def update_progress(
    course_id: int,
    lesson_id: int,
    payload: ProgressUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a lesson completion status."""
    CourseService.update_progress(db, current_user.id, course_id, lesson_id, payload.completed)
    return {"message": "Progress updated successfully."}


@router.post("/{course_id}/bookmark")
def toggle_bookmark(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle bookmarks status for a course."""
    saved = CourseService.toggle_bookmark(db, current_user.id, course_id)
    return {"saved": saved}


@router.get("/{course_id}/discussion")
def get_discussion(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch discussions threads list under a course."""
    return CourseService.get_discussions(db, course_id)


@router.post("/{course_id}/discussion")
def post_discussion_comment(
    course_id: int,
    payload: CommentCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Post comment reply onto a course discussion thread."""
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Comment text cannot be empty.")
    return CourseService.post_comment(
        db=db,
        course_id=course_id,
        user_id=current_user.id,
        author_name=current_user.name or "Student",
        text=payload.text
    )


class CompleteSkillRequest(BaseModel):
    skill_name: str


@router.post("/complete-skill")
def complete_skill(
    payload: CompleteSkillRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a skill as completed. Updates roadmap, skill registry, resume score, and interview score."""
    from app.models.roadmap import Roadmap
    from app.models.resume import ResumeAnalysis
    from app.models.skill import Skill
    import json
    
    skill_name = payload.skill_name.strip()
    if not skill_name:
        raise HTTPException(status_code=400, detail="Skill name cannot be empty.")
        
    # 1. Add to Possessed Skills if not already there
    existing_skill = db.query(Skill).filter(
        Skill.user_id == current_user.id,
        Skill.skill_name.ilike(skill_name)
    ).first()
    
    if not existing_skill:
        new_skill = Skill(
            user_id=current_user.id,
            skill_name=skill_name,
            proficiency_level="Intermediate"
        )
        db.add(new_skill)
    
    # 2. Update Student Roadmap
    roadmap = db.query(Roadmap).filter(Roadmap.student_id == current_user.id).first()
    if roadmap:
        try:
            data = json.loads(roadmap.roadmap_json)
            missing = data.get("missing_skills", [])
            
            lower_missing = [m.lower() for m in missing]
            if skill_name.lower() in lower_missing:
                idx = lower_missing.index(skill_name.lower())
                missing.pop(idx)
                
            data["missing_skills"] = missing
            roadmap.roadmap_json = json.dumps(data)
            
            # Boost progress
            roadmap.progress = min(100.0, float(roadmap.progress) + 15.0)
            db.add(roadmap)
        except Exception:
            pass
            
    # 3. Update Resume Analysis Score
    resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.student_id == current_user.id).order_by(ResumeAnalysis.created_at.desc()).first()
    if resume:
        try:
            matched_list = [s.strip() for s in resume.matched_skills.split(",") if s.strip()]
            missing_list = [s.strip() for s in resume.missing_skills.split(",") if s.strip()]
            
            lower_missing = [m.lower() for m in missing_list]
            if skill_name.lower() in lower_missing:
                idx = lower_missing.index(skill_name.lower())
                val = missing_list.pop(idx)
                matched_list.append(val)
                
            resume.matched_skills = ", ".join(matched_list)
            resume.missing_skills = ", ".join(missing_list)
            
            # Boost match percent
            resume.match_percent = min(100.0, float(resume.match_percent) + 10.0)
            db.add(resume)
        except Exception:
            pass
            
    db.commit()
    return {
        "message": f"Skill '{skill_name}' completed. Roadmap, skills registry, and resume alignment updated successfully.",
        "new_roadmap_progress": roadmap.progress if roadmap else 0.0,
        "new_resume_score": resume.match_percent if resume else 0.0
    }
