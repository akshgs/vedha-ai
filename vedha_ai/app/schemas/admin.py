from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================
# Dashboard
# ==========================================

class AdminDashboardResponse(BaseModel):
    total_users: int
    total_students: int
    total_companies: int
    total_employees: int
    total_courses: int
    total_jobs: int
    active_jobs: int
    inactive_jobs: int
    total_applications: int
    total_resumes: int
    total_interviews: int
    completed_interviews: int
    total_offers: int
    total_active_users: int
    learning_progress_avg: float
    job_statistics: dict
    active_users_trend: list[dict]


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


# ==========================================
# Company Management
# ==========================================

class AdminCompanyResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    industry: str
    website: str
    location: str
    verification_status: str
    is_verified: bool
    approved_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class AdminCompaniesResponse(BaseModel):
    total: int
    page: int
    limit: int
    companies: list[AdminCompanyResponse]


class CompanyRejectionRequest(BaseModel):
    reason: str


# ==========================================
# Common Response
# ==========================================

class AdminMessageResponse(BaseModel):
    message: str