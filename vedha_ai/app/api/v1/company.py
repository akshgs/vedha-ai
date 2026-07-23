from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.company_repository import CompanyRepository
from app.schemas.company import (
    CompanyProfileCreate,
    CompanyProfileUpdate,
)
from app.security.jwt import get_current_user
from app.services.company_service import CompanyService

router = APIRouter(prefix="/company", tags=["Company"])


def require_company(user):
    if user.role != "company":
        raise HTTPException(
            status_code=403,
            detail="Only company accounts can access this resource.",
        )
    return user


@router.post("/profile")
def create_company_profile(
    data: CompanyProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user = require_company(current_user)

    try:
        repository = CompanyRepository(db)
        service = CompanyService(repository)

        return service.create_profile(
            current_user,
            data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get("/profile")
def get_company_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user = require_company(current_user)

    try:
        repository = CompanyRepository(db)
        service = CompanyService(repository)

        return service.get_profile(current_user)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put("/profile")
def update_company_profile(
    data: CompanyProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user = require_company(current_user)

    try:
        repository = CompanyRepository(db)
        service = CompanyService(repository)

        return service.update_profile(
            current_user,
            data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete("/profile")
def delete_company_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user = require_company(current_user)

    try:
        repository = CompanyRepository(db)
        service = CompanyService(repository)

        return service.delete_profile(current_user)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )