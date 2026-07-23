from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class SkillBase(BaseModel):
    skill_name: str
    category: str
    proficiency_level: str
    years_of_experience: Optional[float] = None
    last_used: Optional[int] = None
    is_primary: bool = False


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    skill_name: Optional[str] = None
    category: Optional[str] = None
    proficiency_level: Optional[str] = None
    years_of_experience: Optional[float] = None
    last_used: Optional[int] = None
    is_primary: Optional[bool] = None


class SkillResponse(SkillBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)