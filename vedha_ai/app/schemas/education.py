from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class EducationBase(BaseModel):
    institution: str = Field(..., max_length=150)
    degree: str = Field(..., max_length=100)
    field_of_study: str = Field(..., max_length=100)

    cgpa: Optional[float] = Field(None, ge=0, le=10)
    percentage: Optional[float] = Field(None, ge=0, le=100)

    start_date: str
    end_date: Optional[str] = None

    currently_studying: bool = False

    description: Optional[str] = None


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    institution: Optional[str] = Field(None, max_length=150)
    degree: Optional[str] = Field(None, max_length=100)
    field_of_study: Optional[str] = Field(None, max_length=100)

    cgpa: Optional[float] = Field(None, ge=0, le=10)
    percentage: Optional[float] = Field(None, ge=0, le=100)

    start_date: Optional[str] = None
    end_date: Optional[str] = None

    currently_studying: Optional[bool] = None

    description: Optional[str] = None


class EducationResponse(EducationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)