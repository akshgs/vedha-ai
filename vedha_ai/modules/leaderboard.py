from fastapi import APIRouter
from sqlalchemy import text
from utils.db import get_connection

router = APIRouter()

@router.get("/top")
def get_leaderboard():
    session = get_connection()
    try:
        students = session.execute(text("""
            SELECT id, name, goal, quiz_score, skills
            FROM students
            ORDER BY quiz_score DESC
            LIMIT 10
        """)).fetchall()
    finally:
        session.close()

    result = []
    for i, student in enumerate(students):
        skills_raw = student.skills or "[]"
        try:
            import json
            skill_count = len(json.loads(skills_raw))
        except Exception:
            skill_count = 0
        result.append({
            "rank":        i + 1,
            "id":          student.id,
            "name":        student.name,
            "goal":        student.goal,
            "score":       student.quiz_score,
            "skill_count": skill_count
        })

    return {"leaderboard": result, "total": len(result)}


@router.get("/my-rank/{student_id}")
def get_my_rank(student_id: int):
    session = get_connection()
    try:
        my_score = session.execute(
            text("SELECT quiz_score FROM students WHERE id = :id"),
            {"id": student_id}
        ).fetchone()

        if not my_score:
            return {"error": "Student not found"}

        rank = session.execute(
            text("SELECT COUNT(*) as cnt FROM students WHERE quiz_score > :score"),
            {"score": my_score.quiz_score}
        ).fetchone()
    finally:
        session.close()

    return {
        "student_id": student_id,
        "score":      my_score.quiz_score,
        "rank":       rank.cnt + 1
    }