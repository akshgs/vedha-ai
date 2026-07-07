from datetime import datetime
import json

from sqlalchemy.orm import Session

from app.models.interview import (
    InterviewAnswer,
    InterviewSession,
)


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
            .filter(
                InterviewSession.id == interview_id
            )
            .first()
        )

    def get_sessions_by_student(
        self,
        student_id: int,
    ) -> list[InterviewSession]:

        return (
            self.db.query(InterviewSession)
            .filter(
                InterviewSession.student_id == student_id
            )
            .order_by(
                InterviewSession.created_at.desc()
            )
            .all()
        )

    def save_answer(
        self,
        interview_id: int,
        question: str,
        answer: str,
        evaluation: dict,
    ) -> InterviewAnswer:

        interview_answer = InterviewAnswer(
            interview_id=interview_id,
            question=question,
            answer=answer,
            technical_score=evaluation["technical_score"],
            communication_score=evaluation["communication_score"],
            overall_score=evaluation["overall_score"],
            strengths=json.dumps(
                evaluation["strengths"]
            ),
            weaknesses=json.dumps(
                evaluation["weaknesses"]
            ),
            suggestions=json.dumps(
                evaluation["suggestions"]
            ),
        )

        self.db.add(interview_answer)
        self.db.commit()
        self.db.refresh(interview_answer)

        return interview_answer

    def complete_session(
        self,
        interview_id: int,
        overall_score: float,
    ) -> InterviewSession | None:

        session = self.get_session_by_id(
            interview_id
        )

        if session is None:
            return None

        session.status = "completed"
        session.overall_score = overall_score
        session.completed_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(session)

        return session

    def get_answers(
        self,
        interview_id: int,
    ) -> list[InterviewAnswer]:

        return (
            self.db.query(InterviewAnswer)
            .filter(
                InterviewAnswer.interview_id == interview_id
            )
            .order_by(
                InterviewAnswer.created_at.asc()
            )
            .all()
        )

    def get_history(
        self,
        student_id: int,
    ) -> list[InterviewSession]:

        return (
            self.db.query(InterviewSession)
            .filter(
                InterviewSession.student_id == student_id
            )
            .order_by(
                InterviewSession.created_at.desc()
            )
            .all()
        )

    def get_interview_details(
        self,
        interview_id: int,
    ) -> tuple[InterviewSession, list[InterviewAnswer]] | None:

        session = self.get_session_by_id(
            interview_id
        )

        if session is None:
            return None

        answers = self.get_answers(
            interview_id
        )

        return (
            session,
            answers,
        )