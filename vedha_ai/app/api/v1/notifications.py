"""
app/api/v1/notifications.py
In-app notification API routes.
Reuses: get_current_user, get_db, NotificationRepository.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import get_current_user
from app.repositories.notification_repository import NotificationRepository

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/")
def list_notifications(
    unread_only: bool = Query(default=False),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=30, ge=1, le=100),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List the user's notifications with pagination."""
    repo = NotificationRepository(db)
    offset = (page - 1) * page_size
    items, total = repo.get_by_user(
        user_id=current_user.id,
        unread_only=unread_only,
        limit=page_size,
        offset=offset,
    )
    unread_count = repo.count_unread(current_user.id)

    import math
    return {
        "items": [
            {
                "id": n.id,
                "title": n.title,
                "body": n.body,
                "type": n.notification_type,
                "is_read": n.is_read,
                "action_url": n.action_url,
                "created_at": n.created_at,
            }
            for n in items
        ],
        "total": total,
        "unread_count": unread_count,
        "page": page,
        "total_pages": math.ceil(total / page_size) if page_size else 1,
    }


@router.get("/unread-count")
def unread_count(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get unread notification count (for badge display)."""
    repo = NotificationRepository(db)
    return {"unread_count": repo.count_unread(current_user.id)}


@router.patch("/{notification_id}/read")
@router.post("/{notification_id}/read")
def mark_read(
    notification_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a single notification as read."""
    repo = NotificationRepository(db)
    success = repo.mark_as_read(notification_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return {"message": "Notification marked as read."}


@router.patch("/read-all")
@router.post("/read-all")
def mark_all_read(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark all notifications as read."""
    repo = NotificationRepository(db)
    count = repo.mark_all_read(current_user.id)
    return {"message": f"{count} notifications marked as read."}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a notification."""
    repo = NotificationRepository(db)
    success = repo.delete(notification_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return {"message": "Notification deleted."}
