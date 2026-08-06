from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship

from app.database.base import Base

class RecruitmentInterviewSlot(Base):
    __tablename__ = "recruitment_interview_slots"

    id = Column(Integer, primary_key=True, index=True)
    company_job_id = Column(Integer, ForeignKey("company_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    date = Column(String(50), nullable=False)
    time = Column(String(50), nullable=False)
    interviewer_name = Column(String(100), nullable=False)
    status = Column(String(50), default="available", nullable=False)  # available | booked | cancelled
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("CompanyJob")
    candidate = relationship("User")
