import json

from sqlalchemy.orm import Session

from app.models.interview import InterviewSession


class InterviewRepository:

    def __init__(self, db: Session):
        self.db = db

    def create_session(
        self,
        student_id: int,
        target_role: str,
        base_questions: dict,
        ai_questions: dict,
    ) -> InterviewSession:

        session = InterviewSession(
            student_id=student_id,
            target_role=target_role,
            base_questions=json.dumps(base_questions),
            ai_questions=json.dumps(ai_questions),
            status="in_progress",
        )

        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)

        return session

    def get_session_by_id(
        self,
        interview_id: int,
    ) -> InterviewSession | None:

        return (
            self.db.query(InterviewSession)
            .filter(InterviewSession.id == interview_id)
            .first()
        )

    def get_sessions_by_student(
        self,
        student_id: int,
    ) -> list[InterviewSession]:

        return (
            self.db.query(InterviewSession)
            .filter(InterviewSession.student_id == student_id)
            .order_by(InterviewSession.created_at.desc())
            .all()
        )