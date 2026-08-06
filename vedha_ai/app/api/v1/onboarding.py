import json
from typing import List
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.models.user import User
from app.models.profile import Profile
from app.models.skill import Skill
from app.repositories.resume_repository import ResumeRepository
from app.repositories.roadmap_repository import RoadmapRepository
from app.services.roadmap_service import RoadmapService
from app.ai.services.career_ai_service import analyze_industry_trends, predict_salary

router = APIRouter(prefix="/onboarding", tags=["Student Onboarding"])


class AssessedSkill(BaseModel):
    skill_name: str
    proficiency_level: str


class OnboardingCompletePayload(BaseModel):
    target_role: str = Field(..., min_length=2, max_length=150)
    skills: List[AssessedSkill] = Field(default=[])
    college: str | None = None
    degree: str | None = None
    experience: str | None = None
    interests: str | None = None


@router.post("/complete", status_code=status.HTTP_200_OK)
def complete_onboarding(
    payload: OnboardingCompletePayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Idempotent onboarding endpoint.
    Safe to call multiple times — will upsert Profile and Skills, never duplicate.
    """
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can perform onboarding.",
        )

    try:
        # ── 1. Mark onboarding complete on the User row ──────────────────────
        current_user.onboarding_complete = True
        db.flush()  # write to transaction without committing yet

        # ── 2. Upsert Profile (one-to-one with user) ─────────────────────────
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
        if profile:
            # Update existing profile — never insert a second row
            profile.target_role = payload.target_role
            if payload.college is not None:
                profile.college = payload.college
            if payload.degree is not None:
                profile.degree = payload.degree
            if payload.experience is not None:
                profile.experience = payload.experience
            if payload.interests is not None:
                profile.about = payload.interests
        else:
            # First time: create the profile
            profile = Profile(
                user_id=current_user.id,
                target_role=payload.target_role,
                college=payload.college,
                degree=payload.degree,
                experience=payload.experience,
                about=payload.interests,
            )
            db.add(profile)

        db.flush()  # materialize profile in transaction without committing

        # ── 3. Upsert Skills ─────────────────────────────────────────────────
        # Avoid calling SkillRepository.create() — it calls db.commit() internally,
        # which would break our single-transaction boundary.
        # Instead we do direct ORM upsert here.
        for s in payload.skills:
            skill_name_clean = s.skill_name.strip()
            if not skill_name_clean:
                continue

            existing_skill = (
                db.query(Skill)
                .filter(
                    Skill.user_id == current_user.id,
                    Skill.skill_name.ilike(skill_name_clean),
                )
                .first()
            )

            if existing_skill:
                # Update proficiency level on re-submission
                existing_skill.proficiency_level = s.proficiency_level
            else:
                new_skill = Skill(
                    user_id=current_user.id,
                    skill_name=skill_name_clean,
                    category="Technical",
                    proficiency_level=s.proficiency_level,
                    is_primary=True,
                )
                db.add(new_skill)

        # ── 4. Commit the single atomic transaction ───────────────────────────
        db.commit()

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Data conflict during onboarding — please try again. ({str(e.orig)})",
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Onboarding failed: {str(e)}",
        )

    # ── 5. Non-critical: auto-generate roadmap after commit ───────────────────
    # Done outside the main transaction so a roadmap failure never blocks onboarding.
    try:
        roadmap_repo = RoadmapRepository(db)
        resume_repo = ResumeRepository(db)
        roadmap_service = RoadmapService(roadmap_repo, resume_repo)
        roadmap_service.generate_roadmap(current_user.id)
    except Exception as e:
        print(f"[ONBOARDING] Non-critical: failed to auto-generate roadmap: {e}")

    return {
        "message": "Onboarding complete. Your personalized journey has been set up.",
        "target_role": payload.target_role,
        "skills_saved": len(payload.skills),
    }


@router.get("/trends")
async def get_onboarding_trends(
    role: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch live industry trends and salary data for a chosen career role."""
    try:
        trends = await analyze_industry_trends(domain=role, skills=[])
        salary = await predict_salary(role=role, skills=[], experience_years=0, location="India")

        return {
            "trending_skills": trends.get("trending_skills", ["FastAPI", "React", "Python"]),
            "companies_hiring": trends.get("top_companies_hiring", ["Google", "Meta", "Amazon"]),
            "outlook": trends.get("outlook", "High growth and strong hiring market."),
            "average_salary": salary.get("predicted_lpa", 12.0),
            "demand_index": trends.get("demand_index", 85),
        }
    except Exception:
        # Graceful fallback when AI service is unavailable
        return {
            "trending_skills": ["Python", "FastAPI", "React", "Docker", "AWS"],
            "companies_hiring": ["Google DeepMind", "Meta", "Spotify", "Razorpay"],
            "outlook": "Strong market demand for modern full-stack integrations.",
            "average_salary": 14.0 if ("Backend" in role or "AI" in role) else 11.5,
            "demand_index": 92 if "AI" in role else 80,
        }


@router.get("/roadmap")
def get_onboarding_roadmap(
    role: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return a learning roadmap template for the selected career role."""
    from app.utils.roadmap_loader import get_roadmap_template

    try:
        template = get_roadmap_template(role)
        skills = template.get("required_skills", [])
        
        # Segment skills dynamically into 3 stages
        n = len(skills)
        if n == 0:
            skills = ["React", "FastAPI", "SQL", "Docker", "AWS"]
            n = len(skills)
            
        s1 = skills[:max(1, n // 3)]
        s2 = skills[max(1, n // 3):max(2, 2 * n // 3)]
        s3 = skills[max(2, 2 * n // 3):]
        
        stages = [
            {"title": "Foundations", "duration": "4 weeks", "topics": [s.capitalize() for s in s1]},
            {"title": "Core Development", "duration": "6 weeks", "topics": [s.capitalize() for s in s2]},
            {"title": "DevOps & Cloud", "duration": "4 weeks", "topics": [s.capitalize() for s in s3]},
        ]
        
        return {
            "target_role": role,
            "required_skills": skills,
            "stages": stages,
        }
    except Exception:
        # Graceful fallback template
        return {
            "target_role": role,
            "required_skills": ["React", "FastAPI", "SQL", "Docker", "AWS"],
            "stages": [
                {"title": "Foundations", "duration": "4 weeks", "topics": ["Programming basics", "Version Control"]},
                {"title": "Core Development", "duration": "6 weeks", "topics": ["API architectures", "Databases"]},
                {"title": "DevOps & Cloud", "duration": "4 weeks", "topics": ["Containers", "Cloud Deployment"]},
            ],
        }


@router.get("/skill-dna")
def get_skill_dna(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return the student's Skill DNA as radar chart scores (0-100) per category.
    Computed from the skills they rated during onboarding.
    Always returns safe fallback defaults — never crashes the dashboard.
    """
    _PROFICIENCY_SCORE = {"Beginner": 30, "Intermediate": 60, "Expert": 90}
    _CATEGORY_MAP = {
        "programming": ["Python", "Java", "C++", "JavaScript", "TypeScript", "Golang"],
        "logic": ["Data Structures", "Algorithms", "SQL", "MongoDB", "FastAPI"],
        "math": ["PyTorch", "TensorFlow", "Statistics", "Linear Algebra", "Pandas"],
        "communication": ["Communication", "Leadership", "Git", "Agile", "Documentation"],
        "devops": ["Docker", "AWS Cloud", "Kubernetes", "CI/CD", "Linux", "Terraform"],
    }

    skills = db.query(Skill).filter(Skill.user_id == current_user.id).all()
    skill_lookup = {s.skill_name.lower(): s.proficiency_level for s in skills}

    scores = {}
    for category, keywords in _CATEGORY_MAP.items():
        matched = [
            _PROFICIENCY_SCORE.get(skill_lookup.get(k.lower(), ""), 0)
            for k in keywords
            if skill_lookup.get(k.lower())
        ]
        scores[category] = round(sum(matched) / len(matched)) if matched else 25

    return scores
