from langchain_core.output_parsers import StrOutputParser

from app.ai.engine import get_llm
from app.ai.prompts import RESUME_FEEDBACK_PROMPT
from app.ai.rag_engine import retrieve_context


_llm = None
_str_parser = StrOutputParser()


def _get_feedback_chain():
    global _llm
    if _llm is None:
        _llm = get_llm(
            model="llama-3.1-8b-instant",
            temperature=0.3,
        )
    return RESUME_FEEDBACK_PROMPT | _llm | _str_parser



async def generate_feedback(
    role: str,
    matched_skills: list[str],
    missing_skills: list[str],
    match_percent: float,
) -> str:

    try:

        query = (
            f"{role} "
            f"{' '.join(missing_skills)} "
            "career roadmap skills"
        )

        context = retrieve_context(query)

        return await _get_feedback_chain().ainvoke(
            {
                "role": role,
                "matched_skills": ", ".join(
                    matched_skills
                ),
                "missing_skills": ", ".join(
                    missing_skills
                ),
                "match_percent": match_percent,
                "context": context,
            }
        )

    except Exception:
        return "AI feedback temporarily unavailable."