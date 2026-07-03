from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Job(Base):
    __tablename__ = "job_listings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    company: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    skills: Mapped[str] = mapped_column(
        Text,
        default="[]",
    )

    salary: Mapped[str] = mapped_column(
        String(100),
        default="Not specified",
    )

    job_type: Mapped[str] = mapped_column(
        String(50),
        default="fulltime",
    )

    source: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    scraped_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )