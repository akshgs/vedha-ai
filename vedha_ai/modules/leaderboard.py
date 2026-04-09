from fastapi import APIRouter
from utils.db import get_connection

router = APIRouter()

@router.get("/top")
def get_leaderboard():
    conn = get_connection()

    students = conn.execute("""
        SELECT id, name, goal,
               quiz_score, skills
        FROM students
        ORDER BY quiz_score DESC
        LIMIT 10
    """).fetchall()

    conn.close()

    result = []
    for i, student in enumerate(students):
        result.append({
            "rank":        i + 1,
            "id":          student["id"],
            "name":        student["name"],
            "goal":        student["goal"],
            "score":       student["quiz_score"],
            "skill_count": len(student["skills"].split(","))
                           if student["skills"] != "[]" else 0
        })

    return {
        "leaderboard": result,
        "total":       len(result)
    }

@router.get("/my-rank/{student_id}")
def get_my_rank(student_id: int):
    conn = get_connection()

    my_score = conn.execute(
        "SELECT quiz_score FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()

    if not my_score:
        conn.close()
        return {"error": "Student not found"}

    rank = conn.execute("""
        SELECT COUNT(*) as cnt
        FROM students
        WHERE quiz_score > ?
    """, (my_score["quiz_score"],)).fetchone()

    conn.close()

    return {
        "student_id": student_id,
        "score":      my_score["quiz_score"],
        "rank":       rank["cnt"] + 1
    }