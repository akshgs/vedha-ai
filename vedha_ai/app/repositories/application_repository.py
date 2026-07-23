from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

from app.models.application import Application
from app.schemas.application import ApplicationCreate


class ApplicationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        student_id: int,
        company_job_id: int,
        data: ApplicationCreate,
    ) -> Application:

        application = Application(
            student_id=student_id,
            company_job_id=company_job_id,
            cover_letter=data.cover_letter,
            status="Applied",
        )

        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)

        return application

    def get_by_id(
        self,
        application_id: int,
    ) -> Optional[Application]:
        return (
            self.db.query(Application)
            .options(
                joinedload(Application.job),
                joinedload(Application.student),
            )
            .filter(Application.id == application_id)
            .first()
        )

    def already_applied(
        self,
        student_id: int,
        company_job_id: int,
    ) -> Optional[Application]:
        return (
            self.db.query(Application)
            .filter(
                Application.student_id == student_id,
                Application.company_job_id == company_job_id,
            )
            .first()
        )

    def get_student_applications(
        self,
        student_id: int,
    ) -> List[Application]:
        return (
            self.db.query(Application)
            .options(joinedload(Application.job))
            .filter(Application.student_id == student_id)
            .all()
        )

    def get_job_applications(
        self,
        company_job_id: int,
    ) -> List[Application]:
        return (
            self.db.query(Application)
            .options(joinedload(Application.student))
            .filter(Application.company_job_id == company_job_id)
            .all()
        )

    def update(
        self,
        application: Application,
    ) -> Application:
        self.db.commit()
        self.db.refresh(application)
        return application