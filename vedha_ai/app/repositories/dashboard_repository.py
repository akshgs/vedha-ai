from sqlalchemy.orm import Session

from app.models.user import User
from app.models.resume import ResumeAnalysis
from app.models.job import Job


class DashboardRepository:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def get_student(
        self,
        student_id: int,
    ):
        return (
            self.db.query(User)
            .filter(
                User.id == student_id
            )
            .first()
        )

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

    def get_total_jobs(self):
        return (
            self.db.query(Job)
            .count()
        )