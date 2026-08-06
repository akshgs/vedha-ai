"""
app/repositories/notification_repository.py
Data access layer for in-app notifications.
"""
import json
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        user_id: int,
        title: str,
        notification_type: str,
        body: str | None = None,
        action_url: str | None = None,
        metadata: dict | None = None,
    ) -> Notification:
        notif = Notification(
            user_id=user_id,
            title=title,
            body=body,
            notification_type=notification_type,
            action_url=action_url,
            metadata_json=json.dumps(metadata) if metadata else None,
        )
        self.db.add(notif)
        self.db.commit()
        self.db.refresh(notif)
        return notif

    def get_by_user(
        self,
        user_id: int,
        unread_only: bool = False,
        limit: int = 30,
        offset: int = 0,
    ) -> tuple[list[Notification], int]:
        query = self.db.query(Notification).filter(Notification.user_id == user_id)
        if unread_only:
            query = query.filter(Notification.is_read == False)
        total = query.count()
        items = query.order_by(Notification.created_at.desc()).offset(offset).limit(limit).all()
        return items, total

    def mark_as_read(self, notification_id: int, user_id: int) -> bool:
        notif = (
            self.db.query(Notification)
            .filter(
                Notification.id == notification_id,
                Notification.user_id == user_id,
            )
            .first()
        )
        if notif:
            notif.is_read = True
            self.db.commit()
            return True
        return False

    def mark_all_read(self, user_id: int) -> int:
        count = (
            self.db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False,
            )
            .update({"is_read": True})
        )
        self.db.commit()
        return count

    def count_unread(self, user_id: int) -> int:
        return (
            self.db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read == False,
            )
            .count()
        )

    def delete(self, notification_id: int, user_id: int) -> bool:
        notif = (
            self.db.query(Notification)
            .filter(
                Notification.id == notification_id,
                Notification.user_id == user_id,
            )
            .first()
        )
        if notif:
            self.db.delete(notif)
            self.db.commit()
            return True
        return False
