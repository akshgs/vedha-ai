from app.models.company_job import CompanyJob
from app.models.user import User
from app.repositories.company_job_repository import CompanyJobRepository
from app.repositories.company_repository import CompanyRepository
from app.schemas.company_job import CompanyJobCreate, CompanyJobUpdate


class CompanyJobService:
    def __init__(
        self,
        job_repository: CompanyJobRepository,
        company_repository: CompanyRepository,
    ):
        self.job_repository = job_repository
        self.company_repository = company_repository

    def create_job(
        self,
        current_user: User,
        data: CompanyJobCreate,
    ) -> CompanyJob:

        company = self.company_repository.get_by_user_id(current_user.id)

        if not company:
            raise ValueError("Company profile not found.")

        return self.job_repository.create(company.id, data)

    def get_jobs(
        self,
        current_user: User,
    ) -> list[CompanyJob]:

        company = self.company_repository.get_by_user_id(current_user.id)

        if not company:
            raise ValueError("Company profile not found.")

        return self.job_repository.get_all(company.id)

    def get_job(
        self,
        current_user: User,
        job_id: int,
    ) -> CompanyJob:

        company = self.company_repository.get_by_user_id(current_user.id)

        if not company:
            raise ValueError("Company profile not found.")

        job = self.job_repository.get_by_id(job_id)

        if not job or job.company_id != company.id:
            raise ValueError("Job not found.")

        return job

    def update_job(
        self,
        current_user: User,
        job_id: int,
        data: CompanyJobUpdate,
    ) -> CompanyJob:

        job = self.get_job(current_user, job_id)

        return self.job_repository.update(job, data)

    def delete_job(
        self,
        current_user: User,
        job_id: int,
    ) -> dict:

        job = self.get_job(current_user, job_id)

        self.job_repository.delete(job)

        return {
            "message": "Job deleted successfully."
        }