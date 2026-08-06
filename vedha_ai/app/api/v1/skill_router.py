from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import get_current_user

from app.repositories.skill_repository import SkillRepository
from app.schemas.skill_schema import (
    SkillCreate,
    SkillUpdate,
    SkillResponse,
)
from app.services.skill_service import SkillService

router = APIRouter(
    prefix="/skill",
    tags=["Skill"],
)


def get_service(db: Session):
    repository = SkillRepository(db)
    return SkillService(repository)


@router.post(
    "/create",
    response_model=SkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    try:
        return service.create(
            skill,
            current_user.id,
        )
    except ValueError as e:
        if "already exists" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(e),
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[SkillResponse],
)
def get_skills(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    return service.get_all(current_user.id)


@router.put(
    "/{skill_id}",
    response_model=SkillResponse,
)
def update_skill(
    skill_id: int,
    skill: SkillUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    try:
        return service.update(
            skill_id,
            skill,
            current_user.id,
        )

    except ValueError as e:
        if "not found" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e),
            )
        if "already exists" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(e),
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = get_service(db)

    try:
        service.delete(
            skill_id,
            current_user.id,
        )

        return {
            "message": "Skill deleted successfully"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )