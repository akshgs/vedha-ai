import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel
from sqlalchemy import text
from utils.db import get_connection

load_dotenv()
router = APIRouter()

# ── LLM — upgraded to llama-3.3-70b ───────────────────
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.7
)

# ── Chat Prompt ────────────────────────────────────────
chat_prompt = PromptTemplate(
    input_variables=["student_context", "chat_history", "question"],
    template="""You are Vedha AI, a career mentor for students in Kerala, India.

Student Profile:
{student_context}

Previous Conversation:
{chat_history}

Student Question: {question}

Give practical, encouraging advice in 3-4 sentences.
Focus on Indian job market — mention KSUM, TCS, Infosys when relevant.
Always reply in English only.
Keep response clear and simple."""
)

chat_chain = chat_prompt | llm | StrOutputParser()

# ── Pydantic model ─────────────────────────────────────
class ChatRequest(BaseModel):
    student_id: int
    message: str

# ── Helpers ────────────────────────────────────────────
def get_student_context(student_id: int) -> str:
    session = get_connection()
    try:
        result = session.execute(
            text("SELECT * FROM students WHERE id = :id"),
            {"id": student_id}
        ).fetchone()
    finally:
        session.close()

    if not result:
        return "A student using Vedha AI platform."

    return f"""Name: {result.name}
Goal: {result.goal}
Skills: {result.skills}
Quiz Score: {result.quiz_score}%"""


def get_chat_history(student_id: int) -> str:
    session = get_connection()
    try:
        history = session.execute(
            text("""SELECT role, message FROM chat_history
                    WHERE student_id = :id
                    ORDER BY created_at DESC
                    LIMIT 6"""),
            {"id": student_id}
        ).fetchall()
    finally:
        session.close()

    if not history:
        return "No previous conversation."

    lines = []
    for row in reversed(history):
        role = "Student" if row.role == "user" else "Vedha AI"
        lines.append(f"{role}: {row.message}")
    return "\n".join(lines)


def save_message(student_id: int, role: str, message: str):
    session = get_connection()
    try:
        session.execute(
            text("""INSERT INTO chat_history (student_id, role, message)
                    VALUES (:student_id, :role, :message)"""),
            {"student_id": student_id, "role": role, "message": message}
        )
        session.commit()
    finally:
        session.close()

# ── API Endpoints ──────────────────────────────────────
@router.post("/chat")
async def chat(data: ChatRequest):
    if not data.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty!")

    save_message(data.student_id, "user", data.message)

    student_context = get_student_context(data.student_id)
    chat_history    = get_chat_history(data.student_id)

    try:
        reply = await chat_chain.ainvoke({
            "student_context": student_context,
            "chat_history":    chat_history,
            "question":        data.message
        })
    except Exception as e:
        reply = f"Error: {str(e)}"

    save_message(data.student_id, "assistant", reply)

    return {
        "reply":      reply,
        "mode":       "llama-3.3-70b-versatile",
        "student_id": data.student_id
    }


@router.get("/history/{student_id}")
async def get_history(student_id: int):
    session = get_connection()
    try:
        history = session.execute(
            text("""SELECT role, message, created_at
                    FROM chat_history
                    WHERE student_id = :id
                    ORDER BY created_at ASC"""),
            {"id": student_id}
        ).fetchall()
    finally:
        session.close()

    return {
        "student_id": student_id,
        "history": [
            {"role": r.role, "message": r.message, "created_at": str(r.created_at)}
            for r in history
        ]
    }