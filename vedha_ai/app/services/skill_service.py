from app.repositories.skill_repository import SkillRepository
from app.schemas.skill_schema import SkillCreate, SkillUpdate


class SkillService:
    def __init__(
        self,
        repository: SkillRepository,
    ):
        self.repository = repository

    def create(
        self,
        skill: SkillCreate,
        user_id: int,
    ):
        return self.repository.create(
            skill,
            user_id,
        )

    def get_all(
        self,
        user_id: int,
    ):
        return self.repository.get_all(user_id)

    def update(
        self,
        skill_id: int,
        skill: SkillUpdate,
        user_id: int,
    ):
        db_skill = self.repository.get_by_id(
            skill_id,
            user_id,
        )

        if not db_skill:
            raise ValueError("Skill not found")

        return self.repository.update(
            db_skill,
            skill,
        )

    def delete(
        self,
        skill_id: int,
        user_id: int,
    ):
        db_skill = self.repository.get_by_id(
            skill_id,
            user_id,
        )

        if not db_skill:
            raise ValueError("Skill not found")

        self.repository.delete(db_skill)