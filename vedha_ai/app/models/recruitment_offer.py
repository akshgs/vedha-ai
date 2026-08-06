from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.base import Base

class RecruitmentOffer(Base):
    __tablename__ = "recruitment_offers"

    id = Column(Integer, primary_key=True, index=True)
    company_job_id = Column(Integer, ForeignKey("company_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    salary = Column(String(100), nullable=False)
    deadline = Column(String(50), nullable=False)
    status = Column(String(50), default="Pending", nullable=False)  # Pending | Accepted | Declined
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("CompanyJob")
    student = relationship("User")
