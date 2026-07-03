import os

from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

feedback_prompt = PromptTemplate(
    input_variables=[
        "role",
        "matched_skills",
        "missing_skills",
        "match_percent",
    ],
    template="""
You are a professional career counselor.

Target Role: {role}

Match Score: {match_percent}%

Matched Skills:
{matched_skills}

Missing Skills:
{missing_skills}

Provide:

1. Overall assessment
2. Top skills to learn
3. Free learning resources
4. Estimated timeline to become job-ready

Keep the response practical and concise.
""",
)

feedback_chain = feedback_prompt | llm | StrOutputParser()


async def generate_feedback(
    role: str,
    matched_skills: list[str],
    missing_skills: list[str],
    match_percent: float,
) -> str:

    try:
        return await feedback_chain.ainvoke(
            {
                "role": role,
                "matched_skills": ", ".join(matched_skills),
                "missing_skills": ", ".join(missing_skills),
                "match_percent": match_percent,
            }
        )

    except Exception:
        return "AI feedback temporarily unavailable."