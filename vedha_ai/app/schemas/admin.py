from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================
# Dashboard
# ==========================================

class AdminDashboardResponse(BaseModel):
    total_users: int
    total_students: int
    total_companies: int
    total_jobs: int
    active_jobs: int
    inactive_jobs: int
    total_applications: int
    total_resumes: int
    total_interviews: int
    completed_interviews: int


# ==========================================
# User Management
# ==========================================

class AdminUserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUsersResponse(BaseModel):
    total: int
    page: int
    limit: int
    users: list[AdminUserResponse]


class AdminUserStatusUpdate(BaseModel):
    status: str


class AdminMessageResponse(BaseModel):
    message: str