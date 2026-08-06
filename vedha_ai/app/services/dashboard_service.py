import json
from fastapi import HTTPException

from app.repositories.dashboard_repository import DashboardRepository
from app.repositories.job_repository import JobRepository
from app.repositories.roadmap_repository import RoadmapRepository
from app.models.profile import Profile
from app.models.ecosystem import EcosystemStage


class DashboardService:

    def __init__(
        self,
        dashboard_repository: DashboardRepository,
        roadmap_repository: RoadmapRepository,
        job_repository: JobRepository,
    ):
        self.dashboard_repository = dashboard_repository
        self.roadmap_repository = roadmap_repository
        self.job_repository = job_repository

    def get_dashboard(
        self,
        student_id: int,
    ):
        db = self.roadmap_repository.db
        student = self.dashboard_repository.get_student(
            student_id
        )

        if student is None:
            raise HTTPException(
                status_code=404,
                detail="Student not found.",
            )

        resume = (
            self.dashboard_repository.get_latest_resume(
                student_id
            )
        )

        total_jobs = (
            self.dashboard_repository.get_total_jobs()
        )

        total_interviews = (
            self.dashboard_repository.get_total_interviews(
                student_id
            )
        )

        completed_interviews = (
            self.dashboard_repository.get_completed_interviews(
                student_id
            )
        )

        average_score = (
            self.dashboard_repository.get_average_interview_score(
                student_id
            )
            or 0
        )

        best_score = (
            self.dashboard_repository.get_best_interview_score(
                student_id
            )
            or 0
        )

        recent_interviews = (
            self.dashboard_repository.get_recent_interviews(
                student_id
            )
        )

        # Profile fields
        profile = db.query(Profile).filter(Profile.user_id == student_id).first()
        target_role = profile.target_role if profile else "Full Stack Developer"
        dream_company = profile.dream_company if profile else None

        # EcosystemStage
        eco_stage_rec = db.query(EcosystemStage).filter(EcosystemStage.student_id == student_id).first()
        ecosystem_stage = eco_stage_rec.current_stage if eco_stage_rec else "onboarding"

        # Roadmap progress
        roadmap = (
            self.roadmap_repository.get_latest_roadmap(
                student_id
            )
        )

        roadmap_progress = 0.0
        today_mission = "Complete onboarding to generate your personal learning roadmap."
        next_skill = "Ecosystem Onboarding"

        if roadmap:
            roadmap_progress = float(roadmap.progress) if roadmap.progress is not None else 0.0
            try:
                data = json.loads(roadmap.roadmap_json)
                missing = data.get("missing_skills", [])
                
                if missing:
                    next_skill = missing[0].capitalize()
                    today_mission = f"Master the next skill on your roadmap: '{next_skill}' in Learning Academy."
                else:
                    nodes = data.get("nodes", [])
                    active_node = next((n for n in nodes if n["status"] == "in_progress"), None)
                    if active_node:
                        today_mission = f"Unlock and master the '{active_node['name']}' module in Learning Academy."
                        next_skill = active_node["name"]
                    else:
                        locked_node = next((n for n in nodes if n["status"] == "locked"), None)
                        if locked_node:
                            today_mission = f"Prerequisite pending. Unlock the '{locked_node['name']}' module."
                            next_skill = locked_node["name"]
                        else:
                            today_mission = "All learning roadmap milestones completed! Start mock interviews or search for jobs."
                            next_skill = "Mock Interview Preparation"
            except Exception:
                pass

        resume_score = (
            float(resume.match_percent)
            if resume is not None
            else 0.0
        )

        average_score = float(average_score)
        best_score = float(best_score)

        career_readiness = round(
            (
                resume_score * 0.4
                + average_score * 0.4
                + roadmap_progress * 0.2
            ),
            2,
        )

        return {
            "student_name": student.name,
            "resume_score": round(resume_score, 2),
            "total_jobs": total_jobs,
            "total_interviews": total_interviews,
            "completed_interviews": completed_interviews,
            "average_interview_score": round(
                average_score,
                2,
            ),
            "best_interview_score": round(
                best_score,
                2,
            ),
            "roadmap_progress": round(
                roadmap_progress,
                2,
            ),
            "career_readiness": career_readiness,
            "recent_interviews": [
                {
                    "interview_id": interview.id,
                    "target_role": interview.target_role,
                    "status": interview.status,
                    "overall_score": interview.overall_score,
                    "created_at": interview.created_at,
                }
                for interview in recent_interviews
            ],
            # New Ecosystem fields
            "target_role": target_role,
            "dream_company": dream_company,
            "today_mission": today_mission,
            "next_skill": next_skill,
            "ecosystem_stage": ecosystem_stage,
        }