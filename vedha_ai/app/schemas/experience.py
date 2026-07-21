from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ExperienceBase(BaseModel):
    company: str
    job_title: str
    employment_type: str
    location: str | None = None
    start_date: date
    end_date: date | None = None
    currently_working: bool = False
    technologies: str | None = None
    description: str | None = None


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company: str | None = None
    job_title: str | None = None
    employment_type: str | None = None
    location: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    currently_working: bool | None = None
    technologies: str | None = None
    description: str | None = None


class ExperienceResponse(ExperienceBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)