from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    cover_letter: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: str


class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    company_job_id: int

    status: str

    created_at: datetime

    model_config = {
        "from_attributes": True
    }