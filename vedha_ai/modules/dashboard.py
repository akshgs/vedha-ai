from fastapi import APIRouter
from sqlalchemy import text

from utils.db import get_connection

router = APIRouter()

@router.get("/{student_id}")
async def get_dashboard(student_id: int):

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

        total_chats = session.execute(
            text("""
            SELECT COUNT(*)
            FROM chat_history
            WHERE student_id = :id
            """),
            {"id": student_id}
        ).scalar()

    finally:
        session.close()

    if not student:
        return {
            "error": "Student not found"
        }

    return {
        "student_id": student.id,
        "name": student.name,
        "goal": student.goal,
        "quiz_score": student.quiz_score,

        "resume_score":
            resume.match_percent if resume else 0,

        "target_role":
            resume.target_role if resume else None,

        "total_chats":
            total_chats
    }