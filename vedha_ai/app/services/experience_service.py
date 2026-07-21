from app.repositories.experience_repository import ExperienceRepository
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceUpdate,
)


class ExperienceService:
    def __init__(self, repository: ExperienceRepository):
        self.repository = repository

    def get_all_experiences(self, user_id: int):
        return self.repository.get_all(user_id)

    def get_experience(self, experience_id: int, user_id: int):
        return self.repository.get_by_id(
            experience_id,
            user_id,
        )

    def create_experience(
        self,
        user_id: int,
        experience: ExperienceCreate,
    ):
        return self.repository.create(
            user_id,
            experience,
        )

    def update_experience(
        self,
        db_experience,
        experience: ExperienceUpdate,
    ):
        return self.repository.update(
            db_experience,
            experience,
        )

    def delete_experience(self, db_experience):
        self.repository.delete(db_experience)