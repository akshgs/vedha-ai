from sqlalchemy.orm import Session

from app.models.resume import ResumeAnalysis


class RoadmapRepository:

    def __init__(
        self,
        db: Session,
    ):
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