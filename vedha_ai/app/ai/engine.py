from langchain_groq import ChatGroq
from app.core.config import settings


def get_llm(
    temperature: float = 0.3,
    model: str = "llama-3.3-70b-versatile",
):
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=model,
        temperature=temperature,
        max_retries=2,
    )


llm = get_llm()