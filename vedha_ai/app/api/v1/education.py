from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.education_repository import EducationRepository
from app.schemas.education import (
    EducationCreate,
    EducationResponse,
    EducationUpdate,
)
from app.security.jwt import get_current_user
from app.services.education_service import EducationService

router = APIRouter(
    prefix="/education",
    tags=["Education"],
)


@router.get("/", response_model=list[EducationResponse])
def get_educations(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repository = EducationRepository(db)
    service = EducationService(repository)

    return service.get_educations(
        user_id=current_user.id,
    )


@router.post("/create", response_model=EducationResponse)
def create_education(
    education: EducationCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        repository = EducationRepository(db)
        service = EducationService(repository)

        return service.create_education(
            user_id=current_user.id,
            education=education,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.put("/{education_id}", response_model=EducationResponse)
def update_education(
    education_id: int,
    education: EducationUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        repository = EducationRepository(db)
        service = EducationService(repository)

        return service.update_education(
            education_id=education_id,
            user_id=current_user.id,
            education_data=education,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.delete("/{education_id}")
def delete_education(
    education_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repository = EducationRepository(db)
    service = EducationService(repository)

    return service.delete_education(
        education_id=education_id,
        user_id=current_user.id,
    )