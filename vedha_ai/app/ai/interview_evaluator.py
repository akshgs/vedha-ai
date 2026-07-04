from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq

from app.core.config import settings


llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model="llama-3.3-70b-versatile",
    temperature=0.3,
)


evaluation_prompt = PromptTemplate(
    input_variables=[
        "question",
        "answer",
        "target_role",
    ],
    template="""
You are an expert technical interviewer.

Target Role:
{target_role}

Interview Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer and return your response in the following format.

Technical Score: /100

Communication Score: /100

Overall Score: /100

Strengths:
- ...

Weaknesses:
- ...

Suggestions:
- ...

Keep the evaluation professional, concise and constructive.
""",
)

evaluation_chain = (
    evaluation_prompt
    | llm
    | StrOutputParser()
)


def evaluate_answer(
    question: str,
    answer: str,
    target_role: str,
):

    return evaluation_chain.invoke(
        {
            "question": question,
            "answer": answer,
            "target_role": target_role,
        }
    )