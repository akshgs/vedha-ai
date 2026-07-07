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
            raise ValueError(
                "Student not found."
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
        )

        best_score = (
            self.dashboard_repository.get_best_interview_score(
                student_id
            )
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

        roadmap_progress = 0.0

        if (
            roadmap is not None
            and roadmap.progress is not None
        ):
            roadmap_progress = float(
                roadmap.progress
            )

        resume_score = 0.0

        if resume is not None:
            resume_score = float(
                resume.match_percent
            )

        average_score = float(
            average_score or 0
        )

        best_score = float(
            best_score or 0
        )

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
            "resume_score": resume_score,
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
            "roadmap_progress": roadmap_progress,
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