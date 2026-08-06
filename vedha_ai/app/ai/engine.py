from __future__ import annotations
from langchain_groq import ChatGroq
from app.core.config import settings

# Lazy singleton — avoids crashing at import time due to LangChain
# version incompatibilities with the global langchain.verbose attribute.
_llm_instance: ChatGroq | None = None


def get_llm(
    temperature: float = 0.3,
    model: str = "llama-3.3-70b-versatile",
) -> ChatGroq:
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=model,
        temperature=temperature,
        max_retries=2,
    )


def get_llm_cached() -> ChatGroq:
    """Return a cached LLM instance, creating it on first call."""
    global _llm_instance
    if _llm_instance is None:
        _llm_instance = get_llm()
    return _llm_instance


# Module-level alias kept for backward compatibility with any code that
# does `from app.ai.engine import llm`.
# This is now a property-like accessor, not an eagerly created instance.
class _LazyLlm:
    def __getattr__(self, name: str):
        return getattr(get_llm_cached(), name)

    def __call__(self, *args, **kwargs):
        return get_llm_cached()(*args, **kwargs)


llm = _LazyLlm()  # type: ignore[assignment]