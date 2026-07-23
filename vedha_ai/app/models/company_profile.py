from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    company_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    industry: Mapped[str] = mapped_column(
        String(150),
        default="",
    )

    website: Mapped[str] = mapped_column(
        String(255),
        default="",
    )

    location: Mapped[str] = mapped_column(
        String(200),
        default="",
    )

    description: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    logo_url: Mapped[str] = mapped_column(
        String(500),
        default="",
    )

    company_size: Mapped[str] = mapped_column(
        String(50),
        default="",
    )

    founded_year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # Relationship with User
    user = relationship(
        "User",
        back_populates="company_profile",
    )

    # Relationship with Company Jobs
    jobs = relationship(
        "CompanyJob",
        back_populates="company",
        cascade="all, delete-orphan",
    )