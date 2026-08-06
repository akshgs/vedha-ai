"""
app/models/ai_history.py
AI interaction history — tracks every AI feature usage per user.
Supports audit trail, usage analytics, and session replay.
"""
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class AIInteraction(Base):
    __tablename__ = "ai_interactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    feature: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
        comment="career_mentor | resume_builder | ats | skill_gap | coding | research | pdf_chat | salary | trends",
    )

    input_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="Truncated input for audit (no PII exposure)",
    )

    output_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="Truncated output for audit",
    )

    tokens_used: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    duration_ms: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        comment="Latency in milliseconds",
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="success",
        comment="success | fallback | error",
    )

    model_used: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True,
    )
