from sqlalchemy.orm import Session

from app.models.experience import Experience
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceUpdate,
)


class ExperienceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, user_id: int):
        return (
            self.db.query(Experience)
            .filter(Experience.user_id == user_id)
            .order_by(Experience.start_date.desc())
            .all()
        )

    def get_by_id(self, experience_id: int, user_id: int):
        return (
            self.db.query(Experience)
            .filter(
                Experience.id == experience_id,
                Experience.user_id == user_id,
            )
            .first()
        )

    def create(
        self,
        user_id: int,
        experience: ExperienceCreate,
    ):
        db_experience = Experience(
            user_id=user_id,
            **experience.model_dump(),
        )

        self.db.add(db_experience)
        self.db.commit()
        self.db.refresh(db_experience)

        return db_experience

    def update(
        self,
        db_experience: Experience,
        experience: ExperienceUpdate,
    ):
        update_data = experience.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(db_experience, key, value)

        self.db.commit()
        self.db.refresh(db_experience)

        return db_experience

    def delete(self, db_experience: Experience):
        self.db.delete(db_experience)
        self.db.commit()