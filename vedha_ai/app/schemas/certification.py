from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, HttpUrl


class CertificationBase(BaseModel):
    certificate_name: str
    issuing_organization: str
    credential_id: Optional[str] = None
    issue_date: date
    expiry_date: Optional[date] = None
    does_not_expire: bool = False
    credential_url: Optional[HttpUrl] = None
    description: Optional[str] = None


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(BaseModel):
    certificate_name: Optional[str] = None
    issuing_organization: Optional[str] = None
    credential_id: Optional[str] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    does_not_expire: Optional[bool] = None
    credential_url: Optional[HttpUrl] = None
    description: Optional[str] = None


class CertificationResponse(CertificationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime