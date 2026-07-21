from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, HttpUrl


class ProjectBase(BaseModel):
    project_name: str
    role: str
    description: str
    technologies: str

    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None

    start_date: date
    end_date: Optional[date] = None

    currently_working: bool = False

    team_size: Optional[int] = None
    featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    project_name: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[str] = None

    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None

    start_date: Optional[date] = None
    end_date: Optional[date] = None

    currently_working: Optional[bool] = None
    team_size: Optional[int] = None
    featured: Optional[bool] = None


class ProjectResponse(ProjectBase):
    id: int
    user_id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)