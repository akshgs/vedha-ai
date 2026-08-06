"""
app/ai/llm/__init__.py
Exposes the canonical LLM factory for the entire app/ai package.
Wraps the existing engine.py to avoid duplication.
"""
from app.ai.engine import get_llm, llm

__all__ = ["get_llm", "llm"]
