"""
app/repositories/ai_history_repository.py
Data access layer for AI interaction history.
"""
import time
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.ai_history import AIInteraction


class AIHistoryRepository:

    def __init__(self, db: Session):
        self.db = db

    def log(
        self,
        user_id: int,
        feature: str,
        input_summary: str | None = None,
        output_summary: str | None = None,
        tokens_used: int | None = None,
        duration_ms: int | None = None,
        status: str = "success",
        model_used: str | None = None,
    ) -> AIInteraction:
        record = AIInteraction(
            user_id=user_id,
            feature=feature,
            input_summary=input_summary[:500] if input_summary else None,
            output_summary=output_summary[:500] if output_summary else None,
            tokens_used=tokens_used,
            duration_ms=duration_ms,
            status=status,
            model_used=model_used,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_by_user(
        self,
        user_id: int,
        feature: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[AIInteraction]:
        query = self.db.query(AIInteraction).filter(
            AIInteraction.user_id == user_id
        )
        if feature:
            query = query.filter(AIInteraction.feature == feature)
        return (
            query.order_by(AIInteraction.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

    def count_by_user(self, user_id: int, feature: str | None = None) -> int:
        query = self.db.query(AIInteraction).filter(
            AIInteraction.user_id == user_id
        )
        if feature:
            query = query.filter(AIInteraction.feature == feature)
        return query.count()

    def get_usage_stats(self, user_id: int) -> dict:
        """Per-feature usage counts for dashboard."""
        records = (
            self.db.query(AIInteraction.feature)
            .filter(AIInteraction.user_id == user_id)
            .all()
        )
        stats: dict[str, int] = {}
        for (feature,) in records:
            stats[feature] = stats.get(feature, 0) + 1
        return stats
