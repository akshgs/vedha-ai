import json

from sqlalchemy.orm import Session

from app.models.resume import ResumeAnalysis


class ResumeRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        student_id: int,
        target_role: str,
        match_percent: float,
        matched_skills: list,
        missing_skills: list,
        ai_feedback: str,
    ):

        analysis = ResumeAnalysis(
            student_id=student_id,
            target_role=target_role,
            match_percent=match_percent,
            matched_skills=json.dumps(matched_skills),
            missing_skills=json.dumps(missing_skills),
            ai_feedback=ai_feedback,
        )

        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)

        return analysis

    def get_latest_by_student(self, student_id: int):

        return (
            self.db.query(ResumeAnalysis)
            .filter(ResumeAnalysis.student_id == student_id)
            .order_by(ResumeAnalysis.created_at.desc())
            .first()
        )