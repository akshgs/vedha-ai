from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.base import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    company_job_id = Column(
        Integer,
        ForeignKey("company_jobs.id", ondelete="CASCADE"),
        nullable=False,
    )

    cover_letter = Column(
        Text,
        nullable=True,
    )

    status = Column(
        String(50),
        default="Applied",
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    student = relationship(
        "User",
        back_populates="applications",
    )

    job = relationship(
        "CompanyJob",
        back_populates="applications",
    )