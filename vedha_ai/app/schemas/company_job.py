from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CompanyJobBase(BaseModel):
    title: str
    description: str

    location: str

    employment_type: str
    experience_level: str

    salary: Optional[str] = None
    skills: Optional[str] = None

    vacancies: int = 1

    application_deadline: Optional[datetime] = None

    is_active: bool = True


class CompanyJobCreate(CompanyJobBase):
    pass


class CompanyJobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

    location: Optional[str] = None

    employment_type: Optional[str] = None
    experience_level: Optional[str] = None

    salary: Optional[str] = None
    skills: Optional[str] = None

    vacancies: Optional[int] = None

    application_deadline: Optional[datetime] = None

    is_active: Optional[bool] = None


class CompanyJobResponse(CompanyJobBase):
    id: int
    company_id: int

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }