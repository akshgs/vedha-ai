from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.base import Base


class CompanyJob(Base):
    __tablename__ = "company_jobs"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("company_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    location = Column(String(255), nullable=False)

    employment_type = Column(String(50), nullable=False)
    # Full-time | Part-time | Internship | Contract | Remote

    experience_level = Column(String(100), nullable=False)
    # Fresher | 1-3 Years | 3-5 Years | Senior

    salary = Column(String(100))

    skills = Column(Text)
    # Python, FastAPI, SQL, React

    vacancies = Column(Integer, default=1)

    application_deadline = Column(DateTime, nullable=True)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    company = relationship(
        "CompanyProfile",
        back_populates="jobs",
    )

    applications = relationship(
        "Application",
        back_populates="job",
        cascade="all, delete-orphan",
    )