from app.repositories.certification_repository import (
    CertificationRepository,
)
from app.schemas.certification import (
    CertificationCreate,
    CertificationUpdate,
)


class CertificationService:
    def __init__(
        self,
        repository: CertificationRepository,
    ):
        self.repository = repository

    def create(
        self,
        certification: CertificationCreate,
        user_id: int,
    ):
        return self.repository.create(
            certification,
            user_id,
        )

    def get_all(self, user_id: int):
        return self.repository.get_all(user_id)

    def update(
        self,
        certification_id: int,
        certification: CertificationUpdate,
        user_id: int,
    ):
        db_certification = self.repository.get_by_id(
            certification_id,
            user_id,
        )

        if not db_certification:
            raise ValueError("Certification not found")

        return self.repository.update(
            db_certification,
            certification,
        )

    def delete(
        self,
        certification_id: int,
        user_id: int,
    ):
        db_certification = self.repository.get_by_id(
            certification_id,
            user_id,
        )

        if not db_certification:
            raise ValueError("Certification not found")

        self.repository.delete(db_certification)