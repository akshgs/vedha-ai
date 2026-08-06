"""
app/core/cache.py
Redis cache manager.
Provides a simple async/sync cache interface.
Falls back gracefully if Redis is unavailable (dev mode).
"""
import json
import logging
from typing import Any

logger = logging.getLogger(__name__)

try:
    import redis

    from app.core.config import settings

    _redis_client: redis.Redis | None = redis.from_url(
        getattr(settings, "REDIS_URL", "redis://localhost:6379/0"),
        decode_responses=True,
        socket_connect_timeout=2,
    )
except Exception:
    _redis_client = None
    logger.warning("Redis unavailable — cache disabled (dev mode).")


def set_cache(key: str, value: Any, ttl: int = 300) -> bool:
    """Set a cached value. Returns True on success."""
    if _redis_client is None:
        return False
    try:
        _redis_client.setex(key, ttl, json.dumps(value))
        return True
    except Exception as e:
        logger.debug(f"Cache set failed: {e}")
        return False


def get_cache(key: str) -> Any | None:
    """Get a cached value. Returns None on miss or error."""
    if _redis_client is None:
        return None
    try:
        raw = _redis_client.get(key)
        return json.loads(raw) if raw else None
    except Exception as e:
        logger.debug(f"Cache get failed: {e}")
        return None


def delete_cache(key: str) -> bool:
    """Delete a cached value."""
    if _redis_client is None:
        return False
    try:
        _redis_client.delete(key)
        return True
    except Exception:
        return False


def cache_key(*parts: str) -> str:
    """Build a namespaced cache key."""
    return ":".join(str(p) for p in parts)


def is_cache_available() -> bool:
    if _redis_client is None:
        return False
    try:
        _redis_client.ping()
        return True
    except Exception:
        return False
