from langchain_core.output_parsers import JsonOutputParser

from app.ai.engine import get_llm
from app.ai.prompts import INTERVIEW_REPORT_PROMPT


llm = get_llm(
    model="llama-3.3-70b-versatile",
    temperature=0.3,
)

report_chain = (
    INTERVIEW_REPORT_PROMPT
    | llm
    | JsonOutputParser()
)


def generate_interview_report(
    target_role: str,
    questions: list[str],
    answers: list[str],
    scores: list[int],
):

    return report_chain.invoke(
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