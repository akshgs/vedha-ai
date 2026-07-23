from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.admin_repository import AdminRepository
from app.schemas.admin import (
    AdminDashboardResponse,
    AdminMessageResponse,
    AdminUsersResponse,
    AdminUserStatusUpdate,
)
from app.security.jwt import get_current_user
from app.services.admin_service import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


def require_admin(user):
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin accounts can access this resource.",
        )
    return user


@router.get(
    "/dashboard",
    response_model=AdminDashboardResponse,
)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_admin(current_user)

    service = AdminService(AdminRepository(db))
    return service.get_dashboard()


@router.get(
    "/users",
    response_model=AdminUsersResponse,
)
def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    role: str | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_admin(current_user)

    service = AdminService(AdminRepository(db))

    return service.get_users(
        page=page,
        limit=limit,
        search=search,
        role=role,
        status=status,
    )


@router.patch(
    "/users/{user_id}/status",
    response_model=AdminMessageResponse,
)
def update_user_status(
    user_id: int = Path(..., ge=1),
    request: AdminUserStatusUpdate = ...,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_admin(current_user)

    service = AdminService(AdminRepository(db))

    return service.update_user_status(
        user_id=user_id,
        status=request.status,
    )