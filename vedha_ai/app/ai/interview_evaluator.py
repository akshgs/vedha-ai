import json

from langchain_core.output_parsers import StrOutputParser

from app.ai.engine import get_llm
from app.ai.prompts import INTERVIEW_EVALUATION_PROMPT
from app.ai.rag_engine import retrieve_context


llm = get_llm(
    model="llama-3.3-70b-versatile",
    temperature=0.2,
)

evaluation_chain = (
    INTERVIEW_EVALUATION_PROMPT
    | llm
    | StrOutputParser()
)


def _validate_evaluation(data: dict) -> dict:

    required_keys = [
        "technical_score",
        "communication_score",
        "overall_score",
        "strengths",
        "weaknesses",
        "suggestions",
    ]

    for key in required_keys:
        if key not in data:
            raise ValueError(f"Missing key: {key}")

    for score_key in [
        "technical_score",
        "communication_score",
        "overall_score",
    ]:
        score = data[score_key]

        if not isinstance(score, int):
            raise ValueError(f"{score_key} must be an integer.")

        if score < 0 or score > 100:
            raise ValueError(f"{score_key} must be between 0 and 100.")

    for list_key in [
        "strengths",
        "weaknesses",
        "suggestions",
    ]:
        if not isinstance(data[list_key], list):
            raise ValueError(f"{list_key} must be a list.")

    return data


def evaluate_answer(
    question: str,
    answer: str,
    target_role: str,
) -> dict:

    query = f"{target_role} interview"

    context = retrieve_context(query)

    raw_output = evaluation_chain.invoke(
        {
            "context": context,
            "target_role": target_role,
            "question": question,
            "answer": answer,
        }
    )

    try:
        parsed = json.loads(raw_output)

    except json.JSONDecodeError as exc:
        raise ValueError(
            "Interview evaluator returned invalid JSON."
        ) from exc

    return _validate_evaluation(parsed)