from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class VerifiedBadge(Base):
    __tablename__ = "verified_badges"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    badge_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    verified_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    assessment_score: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    student = relationship("User")


class EcosystemStage(Base):
    __tablename__ = "ecosystem_stages"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    current_stage: Mapped[str] = mapped_column(
        String(50),
        default="onboarding",
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    student = relationship("User")
