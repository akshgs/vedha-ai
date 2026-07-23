from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.repositories.company_repository import CompanyRepository
from app.repositories.company_job_repository import CompanyJobRepository
from app.schemas.company_job import (
    CompanyJobCreate,
    CompanyJobUpdate,
    CompanyJobResponse,
)

from app.services.company_job_service import CompanyJobService

router = APIRouter(
    prefix="/company/jobs",
    tags=["Company Jobs"],
)


def require_company(user):
    if user.role != "company":
        raise HTTPException(
            status_code=403,
            detail="Only company accounts can access this resource.",
        )
    return user


@router.post("", response_model=CompanyJobResponse)
def create_job(
    data: CompanyJobCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user = require_company(current_user)

    job_repository = CompanyJobRepository(db)
    company_repository = CompanyRepository(db)

    service = CompanyJobService(
        job_repository,
        company_repository,
    )

    try:
        return service.create_job(
            current_user,
            data,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get("", response_model=list[CompanyJobResponse])
def get_jobs(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user = require_company(current_user)

    job_repository = CompanyJobRepository(db)
    company_repository = CompanyRepository(db)

    service = CompanyJobService(
        job_repository,
        company_repository,
    )

    try:
        return service.get_jobs(current_user)
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.get("/{job_id}", response_model=CompanyJobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user = require_company(current_user)

    job_repository = CompanyJobRepository(db)
    company_repository = CompanyRepository(db)

    service = CompanyJobService(
        job_repository,
        company_repository,
    )

    try:
        return service.get_job(
            current_user,
            job_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put("/{job_id}", response_model=CompanyJobResponse)
def update_job(
    job_id: int,
    data: CompanyJobUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user = require_company(current_user)

    job_repository = CompanyJobRepository(db)
    company_repository = CompanyRepository(db)

    service = CompanyJobService(
        job_repository,
        company_repository,
    )

    try:
        return service.update_job(
            current_user,
            job_id,
            data,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    current_user = require_company(current_user)

    job_repository = CompanyJobRepository(db)
    company_repository = CompanyRepository(db)

    service = CompanyJobService(
        job_repository,
        company_repository,
    )

    try:
        return service.delete_job(
            current_user,
            job_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )