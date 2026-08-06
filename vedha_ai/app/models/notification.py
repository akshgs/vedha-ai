"""
app/models/notification.py
Notification model — in-app notifications for all user roles.
Supports real-time delivery via WebSocket and async background tasks.
"""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    title: Mapped[str] = mapped_column(String(200), nullable=False)

    body: Mapped[str | None] = mapped_column(Text, nullable=True)

    notification_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
        comment="job_match | application_update | interview | message | system | ai_result | achievement",
    )

    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    action_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="Frontend deep-link URL for the notification",
    )

    metadata_json: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="JSON payload for rich notification data",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True,
    )
