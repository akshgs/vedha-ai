import json

from app.repositories.dashboard_repository import (
    DashboardRepository,
)
from app.repositories.roadmap_repository import (
    RoadmapRepository,
)
from app.services.roadmap_service import (
    RoadmapService,
)
from app.repositories.job_repository import (
    JobRepository,
)
from app.services.job_service import (
    JobService,
)


class DashboardService:

    def __init__(
        self,
        repository: DashboardRepository,
        roadmap_repository: RoadmapRepository,
        job_repository: JobRepository,
    ):
        self.repository = repository
        self.roadmap_service = RoadmapService(
            roadmap_repository
        )
        self.job_service = JobService(
            job_repository
        )

    def get_dashboard(
        self,
        student_id: int,
    ):

        student = self.repository.get_student(
            student_id
        )

        if not student:
            raise ValueError(
                "Student not found."
            )

        resume = self.repository.get_latest_resume(
            student_id
        )

        if not resume:
            raise ValueError(
                "Resume not found."
            )

        roadmap = self.roadmap_service.generate_roadmap(
            student_id
        )

        jobs = self.job_service.recommend_jobs(
            student_id
        )

        resume_skills = json.loads(
            resume.matched_skills
        )

        return {
            "student": {
                "id": student.id,
                "name": student.name,
                "email": student.email,
            },

            "resume": {
                "target_role": resume.target_role,
                "matched_skills": len(
                    resume_skills
                ),
            },

            "roadmap": {
                "completion": roadmap["completion"],
                "completed_skills": len(
                    roadmap["completed_skills"]
                ),
                "missing_skills": len(
                    roadmap["missing_skills"]
                ),
            },

            "jobs": {
                "recommended_jobs": len(
                    jobs["recommended_jobs"]
                ),
                "best_match": (
                    jobs["recommended_jobs"][0]["match_percent"]
                    if jobs["recommended_jobs"]
                    else 0
                ),
            },
        }