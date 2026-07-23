from datetime import datetime, date

from sqlalchemy import (
    String,
    Integer,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Certification(Base):
    __tablename__ = "certifications"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    certificate_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    issuing_organization: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    credential_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    issue_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    expiry_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    does_not_expire: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    credential_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
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

    user = relationship(
        "User",
        back_populates="certifications",
    )