from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.profile_repository import ProfileRepository
from app.schemas.profile import (
    ProfileCreate,
    ProfileResponse,
    ProfileUpdate,
)
from app.security.jwt import get_current_user
from app.services.profile_service import ProfileService

router = APIRouter(
    prefix="/profile",
    tags=["Profile"],
)


@router.get("/me", response_model=ProfileResponse)
def get_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repository = ProfileRepository(db)
    service = ProfileService(repository)

    profile = service.get_profile(
        user_id=current_user.id,
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found.",
        )

    return profile


@router.post("/create", response_model=ProfileResponse)
def create_profile(
    profile: ProfileCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        repository = ProfileRepository(db)
        service = ProfileService(repository)

        return service.create_profile(
            user_id=current_user.id,
            profile=profile,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.put("/update", response_model=ProfileResponse)
def update_profile(
    profile: ProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        repository = ProfileRepository(db)
        service = ProfileService(repository)

        return service.update_profile(
            user_id=current_user.id,
            profile=profile,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )