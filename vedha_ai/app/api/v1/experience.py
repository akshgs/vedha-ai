from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.experience_repository import ExperienceRepository
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)
from app.security.jwt import get_current_user
from app.services.experience_service import ExperienceService

router = APIRouter(
    prefix="/experience",
    tags=["Experience"],
)


def get_service(db: Session):
    repository = ExperienceRepository(db)
    return ExperienceService(repository)


@router.get(
    "/",
    response_model=list[ExperienceResponse],
)
def get_experiences(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)
    return service.get_all_experiences(current_user.id)


@router.post(
    "/create",
    response_model=ExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_experience(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)
    return service.create_experience(
        current_user.id,
        experience,
    )


@router.put(
    "/{experience_id}",
    response_model=ExperienceResponse,
)
def update_experience(
    experience_id: int,
    experience: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    db_experience = service.get_experience(
        experience_id,
        current_user.id,
    )

    if not db_experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )

    return service.update_experience(
        db_experience,
        experience,
    )


@router.delete(
    "/{experience_id}",
)
def delete_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    db_experience = service.get_experience(
        experience_id,
        current_user.id,
    )

    if not db_experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )

    service.delete_experience(db_experience)

    return {
        "message": "Experience deleted successfully"
    }