from fastapi import HTTPException

from app.repositories.dashboard_repository import DashboardRepository
from app.repositories.job_repository import JobRepository
from app.repositories.roadmap_repository import RoadmapRepository


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

        roadmap = (
            self.roadmap_repository.get_latest_roadmap(
                student_id
            )
        )

        roadmap_progress = (
            float(roadmap.progress)
            if roadmap and roadmap.progress is not None
            else 0.0
        )

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
        }