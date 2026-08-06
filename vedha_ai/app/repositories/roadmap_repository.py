from sqlalchemy.orm import Session

from app.models.roadmap import Roadmap


class RoadmapRepository:

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create_roadmap(
        self,
        student_id: int,
        target_role: str,
        roadmap_json: str,
        progress: float = 0.0,
    ) -> Roadmap:

        roadmap = Roadmap(
            student_id=student_id,
            target_role=target_role,
            roadmap_json=roadmap_json,
            progress=progress,
        )

        self.db.add(roadmap)
        self.db.commit()
        self.db.refresh(roadmap)

        return roadmap

    def get_latest_roadmap(
        self,
        student_id: int,
    ) -> Roadmap | None:

        return (
            self.db.query(Roadmap)
            .filter(
                Roadmap.student_id == student_id
            )
            .order_by(
                Roadmap.created_at.desc()
            )
            .first()
        )

    def update_progress(
        self,
        roadmap_id: int,
        progress: float,
    ) -> Roadmap | None:

        roadmap = (
            self.db.query(Roadmap)
            .filter(
                Roadmap.id == roadmap_id
            )
            .first()
        )

        if roadmap is None:
            return None

        roadmap.progress = progress

        self.db.commit()
        self.db.refresh(roadmap)

        return roadmap