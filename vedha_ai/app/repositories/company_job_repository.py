from sqlalchemy.orm import Session

from app.models.company_job import CompanyJob
from app.schemas.company_job import (
    CompanyJobCreate,
    CompanyJobUpdate,
)


class CompanyJobRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        company_id: int,
        data: CompanyJobCreate,
    ) -> CompanyJob:

        job = CompanyJob(
            company_id=company_id,
            **data.model_dump(),
        )

        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        return job

    def get_all(
        self,
        company_id: int,
    ) -> list[CompanyJob]:

        return (
            self.db.query(CompanyJob)
            .filter(CompanyJob.company_id == company_id)
            .order_by(CompanyJob.created_at.desc())
            .all()
        )

    def get_by_id(
        self,
        job_id: int,
    ) -> CompanyJob | None:

        return (
            self.db.query(CompanyJob)
            .filter(CompanyJob.id == job_id)
            .first()
        )

    def update(
        self,
        job: CompanyJob,
        data: CompanyJobUpdate,
    ) -> CompanyJob:

        values = data.model_dump(exclude_unset=True)

        for key, value in values.items():
            setattr(job, key, value)

        self.db.commit()
        self.db.refresh(job)

        return job

    def delete(
        self,
        job: CompanyJob,
    ) -> None:

        self.db.delete(job)
        self.db.commit()