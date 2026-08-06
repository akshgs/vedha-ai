"""
app/models/problem.py
Coding platform problems, test cases, and editorial models.
Follows LeetCode-style structure.
"""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

import enum


class Difficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    title: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    slug: Mapped[str] = mapped_column(String(200), nullable=False, unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="medium",
        comment="easy | medium | hard",
    )
    tags: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="JSON array of tag strings",
    )
    examples: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="JSON array of {input, output, explanation}",
    )
    constraints: Mapped[str | None] = mapped_column(Text, nullable=True)
    hints: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="JSON array of hint strings",
    )
    starter_code: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="JSON map: language -> starter_code",
    )
    solution: Mapped[str | None] = mapped_column(Text, nullable=True)
    editorial: Mapped[str | None] = mapped_column(Text, nullable=True)

    is_premium: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    acceptance_rate: Mapped[float | None] = mapped_column(Integer, nullable=True)
    total_submissions: Mapped[int] = mapped_column(Integer, default=0)
    total_accepted: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    submissions = relationship("Submission", back_populates="problem", cascade="all, delete-orphan")
