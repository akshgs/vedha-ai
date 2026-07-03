import json

from sqlalchemy.orm import Session

from app.models.job import Job
from app.models.resume import ResumeAnalysis


class JobRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_latest_resume(
        self,
        student_id: int,
    ):
        return (
            self.db.query(ResumeAnalysis)
            .filter(
                ResumeAnalysis.student_id == student_id
            )
            .order_by(
                ResumeAnalysis.id.desc()
            )
            .first()
        )

    def get_all_jobs(self):
        return (
            self.db.query(Job)
            .all()
        )

    def get_resume_skills(
        self,
        student_id: int,
    ):

        resume = self.get_latest_resume(
            student_id
        )

        if not resume:
            return None

        return json.loads(
            resume.matched_skills
        )

    def save_jobs(
        self,
        jobs: list[dict],
    ):

        for job_data in jobs:

            exists = (
                self.db.query(Job)
                .filter(
                    Job.title == job_data["title"],
                    Job.company == job_data["company"],
                )
                .first()
            )

            if exists:
                continue

            job = Job(
                title=job_data["title"],
                company=job_data["company"],
                location=job_data["location"],
                description=job_data["description"],
                skills=job_data["skills"],
                salary=job_data["salary"],
                job_type=job_data["job_type"],
                source=job_data["source"],
                url=job_data["url"],
            )

            self.db.add(job)

        self.db.commit()