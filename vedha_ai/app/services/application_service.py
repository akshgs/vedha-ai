from fastapi import HTTPException, status

from app.models.user import User
from app.repositories.application_repository import ApplicationRepository
from app.repositories.company_job_repository import CompanyJobRepository
from app.schemas.application import (
    ApplicationCreate,
    ApplicationStatusUpdate,
)


VALID_STATUSES = {
    "Applied",
    "Shortlisted",
    "Interview",
    "Rejected",
    "Hired",
}


class ApplicationService:
    def __init__(
        self,
        application_repository: ApplicationRepository,
        company_job_repository: CompanyJobRepository,
    ):
        self.application_repository = application_repository
        self.company_job_repository = company_job_repository

    def apply_job(
        self,
        current_user: User,
        job_id: int,
        data: ApplicationCreate,
    ):
        if current_user.role != "student":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only students can apply for jobs.",
            )

        job = self.company_job_repository.get_by_id(job_id)

        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found.",
            )

        existing = self.application_repository.already_applied(
            current_user.id,
            job_id,
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied for this job.",
            )

        return self.application_repository.create(
            student_id=current_user.id,
            company_job_id=job_id,
            data=data,
        )

    def get_my_applications(
        self,
        current_user: User,
    ):
        if current_user.role != "student":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only students can access their applications.",
            )

        return self.application_repository.get_student_applications(
            current_user.id
        )

    def get_job_applications(
        self,
        current_user: User,
        job_id: int,
    ):
        if current_user.role != "company":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only companies can view job applications.",
            )

        job = self.company_job_repository.get_by_id(job_id)

        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found.",
            )

        return self.application_repository.get_job_applications(job_id)

    def update_status(
        self,
        current_user: User,
        application_id: int,
        data: ApplicationStatusUpdate,
    ):
        if current_user.role != "company":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only companies can update application status.",
            )

        if data.status not in VALID_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status must be one of: {', '.join(VALID_STATUSES)}",
            )

        application = self.application_repository.get_by_id(
            application_id
        )

        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found.",
            )

        application.status = data.status

        return self.application_repository.update(application)