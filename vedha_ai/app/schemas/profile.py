from typing import Optional

from pydantic import BaseModel, ConfigDict, HttpUrl


class ProfileBase(BaseModel):
    phone: Optional[str] = None
    about: Optional[str] = None
    location: Optional[str] = None

    college: Optional[str] = None
    degree: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None

    company: Optional[str] = None
    designation: Optional[str] = None
    experience: Optional[str] = None

    skills: Optional[str] = None

    github_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None
    portfolio_url: Optional[HttpUrl] = None

    target_role: Optional[str] = None


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    pass


class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    profile_image: Optional[str] = None
    career_readiness: int

    model_config = ConfigDict(from_attributes=True)