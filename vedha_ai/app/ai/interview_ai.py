import json

from langchain_core.output_parsers import StrOutputParser

from app.ai.engine import get_llm
from app.ai.prompts import INTERVIEW_GENERATION_PROMPT
from app.ai.rag_engine import retrieve_context


_llm = None
_str_parser = StrOutputParser()


def _get_generation_chain():
    global _llm
    if _llm is None:
        _llm = get_llm(
            model="llama-3.3-70b-versatile",
            temperature=0.2,
        )
    return INTERVIEW_GENERATION_PROMPT | _llm | _str_parser



def _validate_questions(data: dict) -> dict:
    required_counts = {
        "technical": 5,
        "follow_up": 3,
        "scenario": 2,
    }

    if not isinstance(data, dict):
        raise ValueError("Interview AI output must be a JSON object.")

    if set(data.keys()) != set(required_counts.keys()):
        raise ValueError("Interview AI output contains invalid keys.")

    for key, expected_count in required_counts.items():
        questions = data[key]

        if not isinstance(questions, list):
            raise ValueError(f"{key} must be a list.")

        if len(questions) != expected_count:
            raise ValueError(
                f"{key} must contain exactly "
                f"{expected_count} questions."
            )

        if not all(
            isinstance(question, str) and question.strip()
            for question in questions
        ):
            raise ValueError(
                f"{key} contains an invalid question."
            )

        data[key] = [
            question.strip()
            for question in questions
        ]

    return data


def generate_ai_questions(
    role: str,
    skills: list[str],
    base_questions: list[str],
) -> dict:

    query = (
        f"{role} "
        f"{' '.join(skills)} "
        "technical interview questions"
    )

    context = retrieve_context(query)

    raw_output = _get_generation_chain().invoke(
        {
            "context": context,
            "role": role,
            "skills": ", ".join(skills)
            if skills
            else "No student skills available",
            "questions": "\n".join(base_questions),
        }
    )

    try:
        parsed_output = json.loads(raw_output)

    except json.JSONDecodeError as exc:
        raise ValueError(
            "Interview AI returned invalid JSON."
        ) from exc

    return _validate_questions(parsed_output)