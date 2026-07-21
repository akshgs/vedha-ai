from sqlalchemy.orm import Session

from app.models.education import Education
from app.schemas.education import EducationCreate, EducationUpdate


class EducationRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all(
        self,
        user_id: int,
    ):
        return (
            self.db.query(Education)
            .filter(Education.user_id == user_id)
            .order_by(Education.start_date.desc())
            .all()
        )

    def get_by_id(
        self,
        education_id: int,
        user_id: int,
    ):
        return (
            self.db.query(Education)
            .filter(
                Education.id == education_id,
                Education.user_id == user_id,
            )
            .first()
        )

    def create(
        self,
        user_id: int,
        education: EducationCreate,
    ):
        db_education = Education(
            user_id=user_id,
            **education.model_dump(exclude_unset=True),
        )

        self.db.add(db_education)
        self.db.commit()
        self.db.refresh(db_education)

        return db_education

    def update(
        self,
        db_education: Education,
        education: EducationUpdate,
    ):
        data = education.model_dump(exclude_unset=True)

        for key, value in data.items():
            setattr(db_education, key, value)

        self.db.commit()
        self.db.refresh(db_education)

        return db_education

    def delete(
        self,
        db_education: Education,
    ):
        self.db.delete(db_education)
        self.db.commit()