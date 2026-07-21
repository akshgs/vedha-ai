from app.repositories.project_repository import ProjectRepository
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
)


class ProjectService:
    def __init__(self, repository: ProjectRepository):
        self.repository = repository

    def get_all_projects(self, user_id: int):
        return self.repository.get_all(user_id)

    def get_project(
        self,
        project_id: int,
        user_id: int,
    ):
        return self.repository.get_by_id(
            project_id,
            user_id,
        )

    def create_project(
        self,
        user_id: int,
        project: ProjectCreate,
    ):
        return self.repository.create(
            user_id,
            project,
        )

    def update_project(
        self,
        db_project,
        project: ProjectUpdate,
    ):
        return self.repository.update(
            db_project,
            project,
        )

    def delete_project(self, db_project):
        self.repository.delete(db_project)