from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(20),
        default="student",
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="active",
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
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

    last_login: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    educations = relationship(
        "Education",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    experiences = relationship(
        "Experience",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    projects = relationship(
        "Project",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    certifications = relationship(
        "Certification",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    skills = relationship(
        "Skill",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    company_profile = relationship(
        "CompanyProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    applications = relationship(
        "Application",
        back_populates="student",
        cascade="all, delete-orphan",
    )