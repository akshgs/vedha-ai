from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    target_role: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    match_percent: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    matched_skills: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    missing_skills: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    ai_feedback: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )