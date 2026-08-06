"""
app/models/submission.py
Code submission model — tracks all student code submissions with verdicts.
"""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    problem_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("problems.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    language: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        comment="python | javascript | java | cpp | go",
    )

    code: Mapped[str] = mapped_column(Text, nullable=False)

    verdict: Mapped[str] = mapped_column(
        String(50),
        default="pending",
        comment="accepted | wrong_answer | time_limit_exceeded | runtime_error | compilation_error | pending",
    )

    runtime_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    memory_kb: Mapped[int | None] = mapped_column(Integer, nullable=True)

    test_cases_passed: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_test_cases: Mapped[int | None] = mapped_column(Integer, nullable=True)

    error_log: Mapped[str | None] = mapped_column(Text, nullable=True)

    ai_feedback: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="AI-generated hints and optimization suggestions",
    )

    is_contest_submission: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, index=True
    )

    problem = relationship("Problem", back_populates="submissions")
