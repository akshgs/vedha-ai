from langchain_core.output_parsers import StrOutputParser

from app.ai.engine import get_llm
from app.ai.prompts import INTERVIEW_EVALUATION_PROMPT
from app.ai.rag_engine import retrieve_context


llm = get_llm(
    model="llama-3.3-70b-versatile",
    temperature=0.3,
)


evaluation_chain = (
    INTERVIEW_EVALUATION_PROMPT
    | llm
    | StrOutputParser()
)


def evaluate_answer(
    question: str,
    answer: str,
    target_role: str,
):

    query = (
        f"{target_role} "
        f"{question}"
    )

    context = retrieve_context(
        query
    )

    return evaluation_chain.invoke(
        {
            "context": context,
            "question": question,
            "answer": answer,
            "target_role": target_role,
        }
    )