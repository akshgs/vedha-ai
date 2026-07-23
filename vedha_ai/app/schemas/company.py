from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class CompanyProfileBase(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=200)
    industry: str = Field(default="", max_length=150)
    website: HttpUrl | None = None
    location: str = Field(default="", max_length=200)
    description: str = Field(default="", max_length=5000)
    logo_url: HttpUrl | None = None
    company_size: str = Field(default="", max_length=50)
    founded_year: int | None = Field(default=None, ge=1800)


class CompanyProfileCreate(CompanyProfileBase):
    pass


class CompanyProfileUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=2, max_length=200)
    industry: str | None = Field(default=None, max_length=150)
    website: HttpUrl | None = None
    location: str | None = Field(default=None, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    logo_url: HttpUrl | None = None
    company_size: str | None = Field(default=None, max_length=50)
    founded_year: int | None = Field(default=None, ge=1800)


class CompanyProfileResponse(CompanyProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)