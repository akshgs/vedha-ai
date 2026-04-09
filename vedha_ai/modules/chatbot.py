from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.db import get_connection
import os
import httpx

router = APIRouter()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL      = "claude-sonnet-4-20250514"

class ChatRequest(BaseModel):
    student_id: int
    message:    str

def get_student_context(student_id: int) -> str:
    conn    = get_connection()
    student = conn.execute(
        "SELECT * FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()
    conn.close()

    if not student:
        return "A student using Vedha AI platform."

    return f"""Student profile:
- Name: {student['name']}
- Goal: {student['goal']}
- Skills: {student['skills']}
- Quiz Score: {student['quiz_score']}%
"""

def save_message(student_id: int, role: str, message: str):
    conn = get_connection()
    conn.execute(
        """INSERT INTO chat_history
           (student_id, role, message)
           VALUES (?, ?, ?)""",
        (student_id, role, message)
    )
    conn.commit()
    conn.close()

def get_fallback_response(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ["skill", "learn", "next"]):
        return "Focus on Python and ML first — they are the foundation. Build 2-3 real projects and put them on GitHub!"
    if any(w in msg for w in ["internship", "job", "apply"]):
        return "Check KSUM Kerala, LinkedIn, Internshala. Apply to 10+ places. Your data science background is a real advantage!"
    if any(w in msg for w in ["interview", "prepare"]):
        return "Practice DSA on LeetCode, revise ML concepts, and have 2 good projects ready to talk about!"
    return "Stay consistent — 2 hours of coding every day compounds faster than you think!"

@router.post("/chat")
async def chat(data: ChatRequest):
    if not data.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty!")

    save_message(data.student_id, "user", data.message)

    if not ANTHROPIC_API_KEY:
        reply = get_fallback_response(data.message)
        save_message(data.student_id, "assistant", reply)
        return {"reply": reply, "mode": "offline"}

    try:
        student_context = get_student_context(data.student_id)

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key":         ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type":      "application/json"
                },
                json={
                    "model":      CLAUDE_MODEL,
                    "max_tokens": 400,
                    "system": f"""You are Vedha AI — a career mentor for students in India.
{student_context}
Give practical, encouraging advice in 3-4 sentences.
Focus on Indian job market — mention KSUM, TCS, Infosys when relevant.""",
                    "messages": [
                        {"role": "user", "content": data.message}
                    ]
                }
            )

        result = response.json()
        reply  = result["content"][0]["text"]

    except Exception as e:
        reply = get_fallback_response(data.message)

    save_message(data.student_id, "assistant", reply)
    return {"reply": reply, "mode": "ai"}