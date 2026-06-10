import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel
from sqlalchemy import text

from utils.db import get_connection
from utils.vector_store import search

load_dotenv()

router = APIRouter()

# ──────────────────────────────────────────────────────
# LLM
# ──────────────────────────────────────────────────────

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.7
)

# ──────────────────────────────────────────────────────
# Prompt
# ──────────────────────────────────────────────────────

chat_prompt = PromptTemplate(
    input_variables=[
        "student_context",
        "chat_history",
        "knowledge_context",
        "question"
    ],
    template="""
You are Vedha AI, a professional AI career mentor for students.

Student Profile:
{student_context}

Relevant Knowledge:
{knowledge_context}

Previous Conversation:
{chat_history}

Student Question:
{question}

Instructions:
- Use the Relevant Knowledge section whenever possible.
- Personalize responses using the Student Profile.
- Give practical career advice.
- Focus on Indian job market.
- Mention KSUM, TCS, Infosys only when relevant.
- Always reply in English.
- Keep answers concise and useful.
"""
)

chat_chain = chat_prompt | llm | StrOutputParser()

# ──────────────────────────────────────────────────────
# Request Model
# ──────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    student_id: int
    message: str

# ──────────────────────────────────────────────────────
# Student Context
# ──────────────────────────────────────────────────────

def get_student_context(student_id: int) -> str:
    session = get_connection()

    try:
        result = session.execute(
            text(
                """
                SELECT *
                FROM students
                WHERE id = :id
                """
            ),
            {"id": student_id}
        ).fetchone()

    finally:
        session.close()

    if not result:
        return "A student using Vedha AI."

    return f"""
Name: {result.name}
Goal: {result.goal}
Skills: {result.skills}
Quiz Score: {result.quiz_score}%
"""

# ──────────────────────────────────────────────────────
# Chat History
# ──────────────────────────────────────────────────────

def get_chat_history(student_id: int) -> str:
    session = get_connection()

    try:
        history = session.execute(
            text(
                """
                SELECT role, message
                FROM chat_history
                WHERE student_id = :id
                ORDER BY created_at DESC
                LIMIT 6
                """
            ),
            {"id": student_id}
        ).fetchall()

    finally:
        session.close()

    if not history:
        return "No previous conversation."

    messages = []

    for row in reversed(history):
        role = "Student" if row.role == "user" else "Vedha AI"
        messages.append(f"{role}: {row.message}")

    return "\n".join(messages)

# ──────────────────────────────────────────────────────
# Save Messages
# ──────────────────────────────────────────────────────

def save_message(student_id: int, role: str, message: str):
    session = get_connection()

    try:
        session.execute(
            text(
                """
                INSERT INTO chat_history
                (student_id, role, message)
                VALUES
                (:student_id, :role, :message)
                """
            ),
            {
                "student_id": student_id,
                "role": role,
                "message": message
            }
        )

        session.commit()

    finally:
        session.close()

# ──────────────────────────────────────────────────────
# Knowledge Retrieval (RAG)
# ──────────────────────────────────────────────────────

def get_knowledge_context(question: str) -> str:
    try:
        docs = search(question, top_k=3)

        if not docs:
            return "No relevant knowledge found."

        results = []

        for doc in docs:

            if isinstance(doc, str):
                results.append(doc)

            elif hasattr(doc, "page_content"):
                results.append(doc.page_content)

            else:
                results.append(str(doc))

        return "\n\n".join(results)

    except Exception as e:
        print(f"Knowledge Search Error: {e}")
        return "Knowledge retrieval failed."

# ──────────────────────────────────────────────────────
# Chat API
# ──────────────────────────────────────────────────────

@router.post("/chat")
async def chat(data: ChatRequest):

    if not data.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    save_message(
        data.student_id,
        "user",
        data.message
    )

    student_context = get_student_context(
        data.student_id
    )

    chat_history = get_chat_history(
        data.student_id
    )

    knowledge_context = get_knowledge_context(
        data.message
    )

    print("\n==========================")
    print("QUESTION:", data.message)
    print("KNOWLEDGE:", knowledge_context[:500])
    print("==========================\n")

    try:
        reply = await chat_chain.ainvoke(
            {
                "student_context": student_context,
                "chat_history": chat_history,
                "knowledge_context": knowledge_context,
                "question": data.message
            }
        )

    except Exception as e:
        reply = f"Error: {str(e)}"

    save_message(
        data.student_id,
        "assistant",
        reply
    )

    return {
        "reply": reply,
        "mode": "llama-3.3-70b-versatile",
        "student_id": data.student_id
    }

# ──────────────────────────────────────────────────────
# History API
# ──────────────────────────────────────────────────────

@router.get("/history/{student_id}")
async def get_history(student_id: int):

    session = get_connection()

    try:
        history = session.execute(
            text(
                """
                SELECT role, message, created_at
                FROM chat_history
                WHERE student_id = :id
                ORDER BY created_at ASC
                """
            ),
            {"id": student_id}
        ).fetchall()

    finally:
        session.close()

    return {
        "student_id": student_id,
        "history": [
            {
                "role": row.role,
                "message": row.message,
                "created_at": str(row.created_at)
            }
            for row in history
        ]
    }