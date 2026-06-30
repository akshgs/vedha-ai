from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
import json

from utils.db import get_connection

router = APIRouter()


class JobRecommendationRequest(BaseModel):
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


def get_jobs():
    session = get_connection()

    try:
        jobs = session.execute(
            text("""
            SELECT *
            FROM job_listings
            """)
        ).fetchall()

        return jobs

    finally:
        session.close()


def calculate_match(resume_skills, job_skills):

    resume_set = {
        skill.lower().strip()
        for skill in resume_skills
    }

    job_set = {
        skill.lower().strip()
        for skill in job_skills
    }

    if len(job_set) == 0:
        return 0

    matched = resume_set.intersection(job_set)

    score = round(
        (len(matched) / len(job_set)) * 100,
        1
    )

    return score


@router.post("/recommend")
async def recommend_jobs(data: JobRecommendationRequest):

    resume = get_latest_resume(data.student_id)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume analysis not found"
        )

    matched_skills = json.loads(
        resume.matched_skills
    )

    jobs = get_jobs()

    recommendations = []

    for job in jobs:

        job_skills = []

        if job.skills:
            job_skills = [
                skill.strip()
                for skill in job.skills.split(",")
            ]

        score = calculate_match(
            matched_skills,
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