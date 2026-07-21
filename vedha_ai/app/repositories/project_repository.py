from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
)


class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, user_id: int):
        return (
            self.db.query(Project)
            .filter(Project.user_id == user_id)
            .order_by(Project.start_date.desc())
            .all()
        )

    def get_by_id(self, project_id: int, user_id: int):
        return (
            self.db.query(Project)
            .filter(
                Project.id == project_id,
                Project.user_id == user_id,
            )
            .first()
        )

    def create(
        self,
        user_id: int,
        project: ProjectCreate,
    ):
        data = project.model_dump()

        if data.get("github_url") is not None:
            data["github_url"] = str(data["github_url"])

        if data.get("live_url") is not None:
            data["live_url"] = str(data["live_url"])

        db_project = Project(
            user_id=user_id,
            **data,
        )

        self.db.add(db_project)
        self.db.commit()
        self.db.refresh(db_project)

        return db_project

    def update(
        self,
        db_project: Project,
        project: ProjectUpdate,
    ):
        update_data = project.model_dump(
            exclude_unset=True
        )

        if update_data.get("github_url") is not None:
            update_data["github_url"] = str(
                update_data["github_url"]
            )

        if update_data.get("live_url") is not None:
            update_data["live_url"] = str(
                update_data["live_url"]
            )

        for key, value in update_data.items():
            setattr(db_project, key, value)

        self.db.commit()
        self.db.refresh(db_project)

        return db_project

    def delete(self, db_project: Project):
        self.db.delete(db_project)
        self.db.commit()