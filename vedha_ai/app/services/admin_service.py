from fastapi import HTTPException

from app.repositories.admin_repository import AdminRepository
from app.schemas.admin import (
    AdminCompaniesResponse,
    AdminDashboardResponse,
    AdminMessageResponse,
    AdminUsersResponse,
)


class AdminService:
    def __init__(self, admin_repository: AdminRepository):
        self.admin_repository = admin_repository

    # =========================
    # Dashboard
    # =========================

    def get_dashboard(self) -> AdminDashboardResponse:
        return AdminDashboardResponse(
            total_users=self.admin_repository.get_total_users(),
            total_students=self.admin_repository.get_total_students(),
            total_companies=self.admin_repository.get_total_companies(),
            total_jobs=self.admin_repository.get_total_jobs(),
            active_jobs=self.admin_repository.get_active_jobs(),
            inactive_jobs=self.admin_repository.get_inactive_jobs(),
            total_applications=self.admin_repository.get_total_applications(),
            total_resumes=self.admin_repository.get_total_resumes(),
            total_interviews=self.admin_repository.get_total_interviews(),
            completed_interviews=self.admin_repository.get_completed_interviews(),
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
    ) -> AdminUsersResponse:
        data = self.admin_repository.get_users(
            page=page,
            limit=limit,
            search=search,
            role=role,
            status=status,
        )

        return AdminUsersResponse(**data)

    def update_user_status(
        self,
        user_id: int,
        status: str,
    ) -> AdminMessageResponse:
        if status not in ("active", "inactive"):
            raise HTTPException(
                status_code=400,
                detail="Status must be either 'active' or 'inactive'.",
            )

        user = self.admin_repository.update_user_status(
            user_id=user_id,
            status=status,
        )

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found.",
            )

        return AdminMessageResponse(
            message="User status updated successfully."
        )

    def delete_user(
        self,
        current_user_id: int,
        user_id: int,
    ) -> AdminMessageResponse:
        if current_user_id == user_id:
            raise HTTPException(
                status_code=400,
                detail="You cannot delete your own account.",
            )

        deleted = self.admin_repository.delete_user(user_id)

        if not deleted:
            raise HTTPException(
                status_code=404,
                detail="User not found.",
            )

        return AdminMessageResponse(
            message="User deleted successfully."
        )

    # =========================
    # Company Management
    # =========================

    def get_companies(
        self,
        page: int = 1,
        limit: int = 10,
        search: str | None = None,
        status: str | None = None,
    ) -> AdminCompaniesResponse:
        data = self.admin_repository.get_companies(
            page=page,
            limit=limit,
            search=search,
            status=status,
        )

        return AdminCompaniesResponse(**data)

    def get_pending_companies(self) -> AdminCompaniesResponse:
        companies = self.admin_repository.get_pending_companies()

        return AdminCompaniesResponse(
            total=len(companies),
            page=1,
            limit=len(companies),
            companies=companies,
        )

    def approve_company(
        self,
        company_id: int,
        admin_id: int,
    ) -> AdminMessageResponse:
        company = self.admin_repository.approve_company(
            company_id=company_id,
            admin_id=admin_id,
        )

        if company is None:
            raise HTTPException(
                status_code=404,
                detail="Company not found.",
            )

        return AdminMessageResponse(
            message="Company approved successfully."
        )

    def reject_company(
        self,
        company_id: int,
        reason: str,
    ) -> AdminMessageResponse:
        if not reason.strip():
            raise HTTPException(
                status_code=400,
                detail="Rejection reason is required.",
            )

        company = self.admin_repository.reject_company(
            company_id=company_id,
            reason=reason.strip(),
        )

        if company is None:
            raise HTTPException(
                status_code=404,
                detail="Company not found.",
            )

        return AdminMessageResponse(
            message="Company rejected successfully."
        )