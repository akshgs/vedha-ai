from fastapi import APIRouter, HTTPException
from sqlalchemy import text

from utils.db import get_connection

router = APIRouter()

PLACEMENT_WEIGHTS = {
    "resume": 0.40,
    "quiz": 0.30,
    "interview": 0.20,
    "leetcode": 0.10,
}


def get_readiness_label(score: float) -> str:
    if score >= 85:
        return "Excellent"
    elif score >= 70:
        return "Strong"
    elif score >= 55:
        return "Moderate"
    elif score >= 40:
        return "Needs Improvement"
    return "High Risk"


@router.get("/placement-score/{student_id}")
async def placement_score(student_id: int):

    session = get_connection()

    try:

        student = session.execute(
            text("""
            SELECT id, full_name
            FROM students
            WHERE id = :id
            """),
            {"id": student_id}
        ).fetchone()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        resume = session.execute(
            text("""
            SELECT match_percent
            FROM resume_analysis
            WHERE student_id = :id
            ORDER BY id DESC
            LIMIT 1
            """),
            {"id": student_id}
        ).fetchone()

        quiz = session.execute(
            text("""
            SELECT score
            FROM quiz_results
            WHERE student_id = :id
            ORDER BY id DESC
            LIMIT 1
            """),
            {"id": student_id}
        ).fetchone()

    finally:
        session.close()

    resume_score = (
        float(resume.match_percent)
        if resume and resume.match_percent is not None
        else 0.0
    )

    quiz_score = (
        float(quiz.score)
        if quiz and quiz.score is not None
        else 0.0
    )

    # Future modules
    interview_score = 0.0
    leetcode_score = 0.0

    readiness_score = round(
        (
            resume_score * PLACEMENT_WEIGHTS["resume"]
            + quiz_score * PLACEMENT_WEIGHTS["quiz"]
            + interview_score * PLACEMENT_WEIGHTS["interview"]
            + leetcode_score * PLACEMENT_WEIGHTS["leetcode"]
        ),
        1
    )

    readiness_level = get_readiness_label(
        readiness_score
    )

    strengths = []

    if resume_score >= 70:
        strengths.append("Resume")

    if quiz_score >= 70:
        strengths.append("Technical Knowledge")

    improvement_areas = []

    if resume_score < 70:
        improvement_areas.append(
            "Improve resume quality and role alignment"
        )

    if quiz_score < 70:
        improvement_areas.append(
            "Improve technical assessment performance"
        )

    return {
        "student_id": student_id,
        "student_name": student.full_name,
        "resume_score": resume_score,
        "quiz_score": quiz_score,
        "interview_score": interview_score,
        "leetcode_score": leetcode_score,
        "placement_readiness": readiness_score,
        "readiness_level": readiness_level,
        "strengths": strengths,
        "improvement_areas": improvement_areas
    }