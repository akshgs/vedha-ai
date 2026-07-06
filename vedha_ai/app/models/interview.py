from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    target_role: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    base_questions: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    ai_questions: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="in_progress",
    )

    overall_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    interview_id: Mapped[int] = mapped_column(
        ForeignKey("interview_sessions.id"),
        nullable=False,
        index=True,
    )

    question: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    answer: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    technical_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    communication_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    overall_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    strengths: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    weaknesses: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    suggestions: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )