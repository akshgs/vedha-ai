from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import get_current_user

from app.models.user import User
from app.repositories.application_repository import ApplicationRepository
from app.repositories.company_job_repository import CompanyJobRepository

from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
)

from app.services.application_service import ApplicationService

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


def get_application_service(
    db: Session = Depends(get_db),
):
    application_repository = ApplicationRepository(db)
    company_job_repository = CompanyJobRepository(db)

    return ApplicationService(
        application_repository=application_repository,
        company_job_repository=company_job_repository,
    )


@router.post(
    "/jobs/{job_id}/apply",
    response_model=ApplicationResponse,
)
def apply_job(
    job_id: int,
    data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    service: ApplicationService = Depends(get_application_service),
):
    return service.apply_job(
        current_user=current_user,
        job_id=job_id,
        data=data,
    )


@router.get(
    "/student",
    response_model=list[ApplicationResponse],
)
def my_applications(
    current_user: User = Depends(get_current_user),
    service: ApplicationService = Depends(get_application_service),
):
    return service.get_my_applications(
        current_user=current_user,
    )


@router.get(
    "/company/jobs/{job_id}",
    response_model=list[ApplicationResponse],
)
def job_applications(
    job_id: int,
    current_user: User = Depends(get_current_user),
    service: ApplicationService = Depends(get_application_service),
):
    return service.get_job_applications(
        current_user=current_user,
        job_id=job_id,
    )


@router.put(
    "/{application_id}/status",
    response_model=ApplicationResponse,
)
def update_status(
    application_id: int,
    data: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    service: ApplicationService = Depends(get_application_service),
):
    return service.update_status(
        current_user=current_user,
        application_id=application_id,
        data=data,
    )