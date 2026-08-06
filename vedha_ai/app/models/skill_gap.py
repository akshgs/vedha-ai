from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class SkillGapAnalysis(Base):
    __tablename__ = "skill_gap_analyses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    target_role: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    current_skills: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="[]",
    )

    missing_skills: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="[]",
    )

    learning_path: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="[]",
    )

    dependency_graph: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="{}",
    )

    readiness_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
