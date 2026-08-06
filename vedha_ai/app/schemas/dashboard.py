from datetime import datetime
from pydantic import BaseModel


class RecentInterview(BaseModel):
    interview_id: int
    target_role: str
    status: str
    overall_score: float | None = None
    created_at: datetime


class DashboardResponse(BaseModel):
    student_name: str
    resume_score: float
    total_jobs: int
    total_interviews: int
    completed_interviews: int
    average_interview_score: float
    best_interview_score: float
    roadmap_progress: float
    career_readiness: float
    recent_interviews: list[RecentInterview]

    # New Ecosystem fields
    target_role: str | None = None
    dream_company: str | None = None
    today_mission: str | None = None
    next_skill: str | None = None
    ecosystem_stage: str | None = None