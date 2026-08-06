from langchain_core.output_parsers import JsonOutputParser

from app.ai.engine import get_llm
from app.ai.prompts import INTERVIEW_REPORT_PROMPT


_llm = None
_json_parser = JsonOutputParser()


def _get_report_chain():
    global _llm
    if _llm is None:
        _llm = get_llm(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
        )
    return INTERVIEW_REPORT_PROMPT | _llm | _json_parser



def generate_interview_report(
    target_role: str,
    questions: list[str],
    answers: list[str],
    scores: list[int],
):

    return _get_report_chain().invoke(
        {
            "target_role": target_role,
            "questions": "\n".join(questions),
            "answers": "\n".join(answers),
            "scores": ", ".join(
                str(score)
                for score in scores
            ),
        }
    )