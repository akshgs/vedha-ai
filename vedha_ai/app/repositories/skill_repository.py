from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.skill import Skill
from app.schemas.skill_schema import SkillCreate, SkillUpdate


class SkillRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_name(
        self,
        user_id: int,
        skill_name: str,
    ) -> Skill | None:
        return (
            self.db.query(Skill)
            .filter(
                Skill.user_id == user_id,
                func.lower(Skill.skill_name) == func.lower(skill_name),
            )
            .first()
        )

    def create(
        self,
        skill: SkillCreate,
        user_id: int,
    ):
        db_skill = Skill(
            **skill.model_dump(),
            user_id=user_id,
        )

        self.db.add(db_skill)
        self.db.commit()
        self.db.refresh(db_skill)

        return db_skill

    def get_all(
        self,
        user_id: int,
    ):
        return (
            self.db.query(Skill)
            .filter(Skill.user_id == user_id)
            .order_by(
                Skill.is_primary.desc(),
                Skill.skill_name.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        skill_id: int,
        user_id: int,
    ):
        return (
            self.db.query(Skill)
            .filter(
                Skill.id == skill_id,
                Skill.user_id == user_id,
            )
            .first()
        )

    def update(
        self,
        db_skill: Skill,
        skill: SkillUpdate,
    ):
        update_data = skill.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(db_skill, key, value)

        self.db.commit()
        self.db.refresh(db_skill)

        return db_skill

    def delete(
        self,
        db_skill: Skill,
    ):
        self.db.delete(db_skill)
        self.db.commit()