from sqlalchemy.orm import Session

from app.models.certification import Certification
from app.schemas.certification import (
    CertificationCreate,
    CertificationUpdate,
)


class CertificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        certification: CertificationCreate,
        user_id: int,
    ):
        data = certification.model_dump()

        # Convert HttpUrl -> str
        if data.get("credential_url") is not None:
            data["credential_url"] = str(
                data["credential_url"]
            )

        db_certification = Certification(
            **data,
            user_id=user_id,
        )

        self.db.add(db_certification)
        self.db.commit()
        self.db.refresh(db_certification)

        return db_certification

    def get_all(self, user_id: int):
        return (
            self.db.query(Certification)
            .filter(Certification.user_id == user_id)
            .order_by(Certification.created_at.desc())
            .all()
        )

    def get_by_id(
        self,
        certification_id: int,
        user_id: int,
    ):
        return (
            self.db.query(Certification)
            .filter(
                Certification.id == certification_id,
                Certification.user_id == user_id,
            )
            .first()
        )

    def update(
        self,
        certification: Certification,
        update_data: CertificationUpdate,
    ):
        data = update_data.model_dump(exclude_unset=True)

        # Convert HttpUrl -> str
        if data.get("credential_url") is not None:
            data["credential_url"] = str(
                data["credential_url"]
            )

        for key, value in data.items():
            setattr(certification, key, value)

        self.db.commit()
        self.db.refresh(certification)

        return certification

    def delete(
        self,
        certification: Certification,
    ):
        self.db.delete(certification)
        self.db.commit()