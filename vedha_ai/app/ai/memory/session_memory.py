"""
app/ai/memory/session_memory.py
In-process session memory for AI chat contexts.
Stores per-user conversation history in a TTL-aware dict.
Designed to be replaced with Redis in production.
"""
import time
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Message:
    role: str  # "user" | "assistant"
    content: str
    timestamp: float = field(default_factory=time.time)


class SessionMemory:
    """
    Lightweight in-memory chat history manager.
    Each session_id (user_id + context) holds a list of Messages.
    Enforces max_turns to prevent unbounded growth.
    TTL ensures stale sessions are evicted.
    """

    def __init__(self, max_turns: int = 20, ttl_seconds: int = 3600):
        self.max_turns = max_turns
        self.ttl = ttl_seconds
        self._store: dict[str, list[Message]] = defaultdict(list)
        self._last_access: dict[str, float] = {}

    def _session_key(self, user_id: int, context: str = "career") -> str:
        return f"{user_id}:{context}"

    def add_message(self, user_id: int, role: str, content: str, context: str = "career") -> None:
        key = self._session_key(user_id, context)
        self._store[key].append(Message(role=role, content=content))
        self._last_access[key] = time.time()

        # Trim to max_turns (each turn = 1 user + 1 assistant)
        if len(self._store[key]) > self.max_turns * 2:
            self._store[key] = self._store[key][-(self.max_turns * 2):]

    def get_history(self, user_id: int, context: str = "career") -> list[Message]:
        key = self._session_key(user_id, context)
        self._evict_stale()
        return self._store.get(key, [])

    def format_history_string(self, user_id: int, context: str = "career") -> str:
        """Format history as a readable string for LLM prompt injection."""
        messages = self.get_history(user_id, context)
        if not messages:
            return "No previous conversation."
        lines = []
        for msg in messages[-10:]:  # Last 10 messages only
            label = "User" if msg.role == "user" else "Vedha AI"
            lines.append(f"{label}: {msg.content}")
        return "\n".join(lines)

    def clear_session(self, user_id: int, context: str = "career") -> None:
        key = self._session_key(user_id, context)
        self._store.pop(key, None)
        self._last_access.pop(key, None)

    def _evict_stale(self) -> None:
        now = time.time()
        stale_keys = [
            k for k, t in self._last_access.items()
            if now - t > self.ttl
        ]
        for k in stale_keys:
            self._store.pop(k, None)
            self._last_access.pop(k, None)

    def session_exists(self, user_id: int, context: str = "career") -> bool:
        key = self._session_key(user_id, context)
        return key in self._store and len(self._store[key]) > 0


# Singleton instance — shared across request lifecycle
session_memory = SessionMemory(max_turns=20, ttl_seconds=3600)
