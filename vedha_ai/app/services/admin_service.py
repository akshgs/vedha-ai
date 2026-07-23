from fastapi import HTTPException

from app.repositories.admin_repository import AdminRepository
from app.schemas.admin import (
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