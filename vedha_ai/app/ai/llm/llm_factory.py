from langchain_groq import ChatGroq
from app.core.config import settings

class LLMFactory:
    """Centralized factory for Large Language Model instances in 2026."""
    
    @staticmethod
    def get_chat_model(temperature: float = 0.3, model: str = "llama-3.3-70b-versatile"):
        """Returns standard LLM client configured with defaults and retries."""
        return ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model=model,
            temperature=temperature,
            max_retries=2,
        )

    @staticmethod
    def get_structured_model(temperature: float = 0.1, model: str = "llama-3.3-70b-versatile"):
        """Returns low-temperature model optimal for parsing structured outputs."""
        return ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model=model,
            temperature=temperature,
            max_retries=3,
        )
