from datetime import datetime

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.company_job import CompanyJob
from app.models.company_profile import CompanyProfile
from app.models.interview import InterviewSession
from app.models.resume import ResumeAnalysis
from app.models.user import User


class AdminRepository:
    def __init__(self, db: Session):
        self.db = db

    # =========================
    # Dashboard
    # =========================

    def get_total_users(self) -> int:
        return self.db.query(func.count(User.id)).scalar() or 0

    def get_total_students(self) -> int:
        return (
            self.db.query(func.count(User.id))
            .filter(User.role == "student")
            .scalar()
            or 0
        )

    def get_total_companies(self) -> int:
        return (
            self.db.query(func.count(CompanyProfile.id))
            .scalar()
            or 0
        )

    def get_total_jobs(self) -> int:
        return (
            self.db.query(func.count(CompanyJob.id))
            .scalar()
            or 0
        )

    def get_active_jobs(self) -> int:
        return (
            self.db.query(func.count(CompanyJob.id))
            .filter(CompanyJob.is_active.is_(True))
            .scalar()
            or 0
        )

    def get_inactive_jobs(self) -> int:
        return (
            self.db.query(func.count(CompanyJob.id))
            .filter(CompanyJob.is_active.is_(False))
            .scalar()
            or 0
        )

    def get_total_applications(self) -> int:
        return (
            self.db.query(func.count(Application.id))
            .scalar()
            or 0
        )

    def get_total_resumes(self) -> int:
        return (
            self.db.query(func.count(ResumeAnalysis.id))
            .scalar()
            or 0
        )

    def get_total_interviews(self) -> int:
        return (
            self.db.query(func.count(InterviewSession.id))
            .scalar()
            or 0
        )

    def get_completed_interviews(self) -> int:
        return (
            self.db.query(func.count(InterviewSession.id))
            .filter(InterviewSession.status == "completed")
            .scalar()
            or 0
        )

    # =========================
    # User Management
    # =========================

    def get_users(
        self,
        page: int = 1,
        limit: int = 10,
        search: str | None = None,
        role: str | None = None,
        status: str | None = None,
    ):
        query = self.db.query(User)

        if search:
            query = query.filter(
                or_(
                    User.name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%"),
                )
            )

        if role:
            query = query.filter(User.role == role)

        if status:
            query = query.filter(User.status == status)

        total = query.count()

        users = (
            query.order_by(User.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "users": users,
        }

    def update_user_status(
        self,
        user_id: int,
        status: str,
    ):
        user = (
            self.db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if user is None:
            return None

        user.status = status

        self.db.commit()
        self.db.refresh(user)

        return user

    def delete_user(
        self,
        user_id: int,
    ) -> bool:
        user = (
            self.db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if user is None:
            return False

        self.db.delete(user)
        self.db.commit()

        return True

    # =========================
    # Company Management
    # =========================

    def get_companies(
        self,
        page: int = 1,
        limit: int = 10,
        search: str | None = None,
        status: str | None = None,
    ):
        query = self.db.query(CompanyProfile)

        if search:
            query = query.filter(
                CompanyProfile.company_name.ilike(f"%{search}%")
            )

        if status:
            query = query.filter(
                CompanyProfile.verification_status == status
            )

        total = query.count()

        companies = (
            query.order_by(CompanyProfile.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "companies": companies,
        }

    def get_pending_companies(self):
        return (
            self.db.query(CompanyProfile)
            .filter(
                CompanyProfile.verification_status == "pending"
            )
            .order_by(CompanyProfile.created_at.desc())
            .all()
        )

    def approve_company(
        self,
        company_id: int,
        admin_id: int,
    ):
        company = (
            self.db.query(CompanyProfile)
            .filter(CompanyProfile.id == company_id)
            .first()
        )

        if company is None:
            return None

        company.is_verified = True
        company.verification_status = "approved"
        company.approved_at = datetime.utcnow()
        company.approved_by = admin_id
        company.rejection_reason = None

        self.db.commit()
        self.db.refresh(company)

        return company

    def reject_company(
        self,
        company_id: int,
        reason: str,
    ):
        company = (
            self.db.query(CompanyProfile)
            .filter(CompanyProfile.id == company_id)
            .first()
        )

        if company is None:
            return None

        company.is_verified = False
        company.verification_status = "rejected"
        company.rejection_reason = reason
        company.approved_at = None
        company.approved_by = None

        self.db.commit()
        self.db.refresh(company)

        return company