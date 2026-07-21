from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from app.security.jwt import get_current_user
from app.services.project_service import ProjectService

router = APIRouter(
    prefix="/project",
    tags=["Project"],
)


def get_service(db: Session):
    repository = ProjectRepository(db)
    return ProjectService(repository)


@router.get(
    "/",
    response_model=list[ProjectResponse],
)
def get_projects(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)
    return service.get_all_projects(current_user.id)


@router.post(
    "/create",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)
    return service.create_project(
        current_user.id,
        project,
    )


@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    db_project = service.get_project(
        project_id,
        current_user.id,
    )

    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return service.update_project(
        db_project,
        project,
    )


@router.delete(
    "/{project_id}",
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    db_project = service.get_project(
        project_id,
        current_user.id,
    )

    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    service.delete_project(db_project)

    return {
        "message": "Project deleted successfully"
    }