from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json

from utils.db import get_connection

router = APIRouter()

# Load once at startup
embedding_model = SentenceTransformer(
    "BAAI/bge-small-en-v1.5"
)


class JobRecommendationRequest(BaseModel):
    student_id: int


def get_latest_resume(student_id: int):
    session = get_connection()

    try:
        result = session.execute(
            text("""
                SELECT matched_skills
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


def get_jobs():
    session = get_connection()

    try:
        jobs = session.execute(
            text("""
                SELECT
                    id,
                    title,
                    company,
                    location,
                    skills
                FROM job_listings
            """)
        ).fetchall()

        return jobs

    finally:
        session.close()


def calculate_match(
    resume_embedding: np.ndarray,
    job_skills: list[str]
) -> float:

    if not job_skills:
        return 0.0

    job_text = " ".join(job_skills)

    job_embedding = embedding_model.encode(
        job_text,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    similarity = cosine_similarity(
        [resume_embedding],
        [job_embedding]
    )[0][0]

    score = round(
        float(similarity) * 100,
        1
    )

    return max(0.0, min(score, 100.0))


@router.post("/recommend")
async def recommend_jobs(
    data: JobRecommendationRequest
):

    resume = get_latest_resume(
        data.student_id
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume analysis not found"
        )

    try:
        matched_skills = json.loads(
            resume.matched_skills
        )

        if not isinstance(
            matched_skills,
            list
        ):
            matched_skills = []

    except Exception:
        matched_skills = []

    if len(matched_skills) == 0:
        raise HTTPException(
            status_code=400,
            detail="No skills found in resume"
        )

    jobs = get_jobs()

    # Generate once
    resume_text = " ".join(
        skill.strip()
        for skill in matched_skills
        if skill and skill.strip()
    )

    resume_embedding = embedding_model.encode(
        resume_text,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    recommendations = []

    for job in jobs:

        job_skills = []

        if job.skills:
            job_skills = [
                skill.strip()
                for skill in job.skills.split(",")
                if skill.strip()
            ]

        score = calculate_match(
            resume_embedding,
            job_skills
        )

        recommendations.append(
            {
                "job_id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "match_percent": score
            }
        )

    recommendations.sort(
        key=lambda x: x["match_percent"],
        reverse=True
    )

    return {
        "student_id": data.student_id,
        "recommended_jobs": recommendations[:10]
    }