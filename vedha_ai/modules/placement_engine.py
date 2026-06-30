from fastapi import APIRouter
from sqlalchemy import text

from utils.db import get_connection

router = APIRouter()


@router.get("/placement-score/{student_id}")
async def placement_score(student_id: int):

    session = get_connection()

    try:

        student = session.execute(
            text("""
            SELECT *
            FROM students
            WHERE id = :id
            """),
            {"id": student_id}
        ).fetchone()

        resume = session.execute(
            text("""
            SELECT *
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

    if not student:
        return {
            "error": "Student not found"
        }

    resume_score = (
        float(resume.match_percent)
        if resume
        else 0
    )

    quiz_score = (
        float(quiz.score)
        if quiz
        else 0
    )

    # Temporary values until those modules are connected
    interview_score = 0
    leetcode_score = 0

    placement_score = round(
        (
            resume_score * 0.4 +
            quiz_score * 0.3 +
            interview_score * 0.2 +
            leetcode_score * 0.1
        ),
        1
    )

    return {
        "student_id": student_id,
        "resume_score": resume_score,
        "quiz_score": quiz_score,
        "interview_score": interview_score,
        "leetcode_score": leetcode_score,
        "placement_readiness": placement_score
    }