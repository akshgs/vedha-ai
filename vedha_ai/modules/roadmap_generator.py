from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from utils.db import get_connection
from modules.chatbot import llm

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

router = APIRouter()

class RoadmapRequest(BaseModel):
    student_id: int

def get_latest_resume(student_id):
    session = get_connection()

    try:
        result = session.execute(
            text("""
            SELECT *
            FROM resume_analysis
            WHERE student_id = :id
            ORDER BY id DESC
            LIMIT 1
            """),
            {"id": student_id}
        ).fetchone()

        return result

    finally:
        session.close()

roadmap_prompt = PromptTemplate(
    input_variables=[
        "target_role",
        "score",
        "matched",
        "missing"
    ],
    template="""
You are an expert AI career mentor.

Target Role:
{target_role}

Resume Score:
{score}

Matched Skills:
{matched}

Missing Skills:
{missing}

Create:

1. 30 Day Learning Plan
2. 60 Day Learning Plan
3. 90 Day Learning Plan
4. 3 Portfolio Projects
5. Free Learning Resources
6. Estimated Job Readiness

Make it practical for Indian students.

Answer:
"""
)

roadmap_chain = (
    roadmap_prompt
    | llm
    | StrOutputParser()
)

@router.post("/generate")
async def generate_roadmap(data: RoadmapRequest):

    resume = get_latest_resume(data.student_id)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="No resume analysis found."
        )

    roadmap = await roadmap_chain.ainvoke({
        "target_role": resume.target_role,
        "score": resume.match_percent,
        "matched": resume.matched_skills,
        "missing": resume.missing_skills
    })

    return {
        "student_id": data.student_id,
        "target_role": resume.target_role,
        "roadmap": roadmap
    }