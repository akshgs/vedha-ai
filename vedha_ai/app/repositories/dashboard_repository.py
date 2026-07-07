from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.resume import ResumeAnalysis
from app.models.job import Job
from app.models.interview import InterviewSession


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
                ResumeAnalysis.created_at.desc()
            )
            .first()
        )

    def get_total_jobs(self):
        return (
            self.db.query(Job)
            .count()
        )

    def get_total_interviews(
        self,
        student_id: int,
    ):
        return (
            self.db.query(InterviewSession)
            .filter(
                InterviewSession.student_id == student_id
            )
            .count()
        )

    def get_completed_interviews(
        self,
        student_id: int,
    ):
        return (
            self.db.query(InterviewSession)
            .filter(
                InterviewSession.student_id == student_id,
                InterviewSession.status == "completed",
            )
            .count()
        )

    def get_average_interview_score(
        self,
        student_id: int,
    ):
        return (
            self.db.query(
                func.avg(
                    InterviewSession.overall_score
                )
            )
            .filter(
                InterviewSession.student_id == student_id,
                InterviewSession.status == "completed",
            )
            .scalar()
        )

    def get_best_interview_score(
        self,
        student_id: int,
    ):
        return (
            self.db.query(
                func.max(
                    InterviewSession.overall_score
                )
            )
            .filter(
                InterviewSession.student_id == student_id,
                InterviewSession.status == "completed",
            )
            .scalar()
        )

    def get_recent_interviews(
        self,
        student_id: int,
        limit: int = 5,
    ):
        return (
            self.db.query(InterviewSession)
            .filter(
                InterviewSession.student_id == student_id
            )
            .order_by(
                InterviewSession.created_at.desc()
            )
            .limit(limit)
            .all()
        )