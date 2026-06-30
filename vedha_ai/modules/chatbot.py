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
    temperature=0.3
)

# ──────────────────────────────────────────────────────
# Prompt
# ──────────────────────────────────────────────────────

chat_prompt = PromptTemplate(
    input_variables=[
    "student_context",
    "resume_context",
    "chat_history",
    "knowledge_context",
    "question"
],
   template="""
You are Vedha AI, an AI-powered career mentor.

Question:
{question}

Relevant Knowledge:
{knowledge_context}

Student Profile:
{student_context}

Resume Analysis:
{resume_context}

Previous Conversation:
{chat_history}

Rules:

1. FIRST answer the user's question directly.

2. Use Relevant Knowledge whenever available.

3. If Resume Analysis exists, use it to personalize career advice.

4. Mention resume strengths before suggesting improvements.

5. Prioritize missing skills from the resume analysis.

6. If the user asks about:
   - AI Engineer
   - ML Engineer
   - Data Scientist
   - Resume
   - Career
   - Roadmap
   - Interview
   - Skills

   Then use the Resume Analysis section.

7. Mention:
   - Resume Score
   - Matched Skills
   - Missing Skills

   whenever relevant.

8. For general knowledge questions
   (example: "What is Python?", "What is TensorFlow?")
   ignore Resume Analysis completely.

9. Keep answers concise, practical, and personalized.

Answer:
""")

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
            text("""
                SELECT *
                FROM students
                WHERE id = :id
            """),
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

def get_resume_context(student_id: int) -> str:
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

        print("RESUME QUERY RESULT:", result)

    finally:
        session.close()

    if not result:
        return "No resume analysis available."

    return f"""
Resume Score: {result.match_percent}%

Target Role: {result.target_role}

Matched Skills:
{result.matched_skills}

Missing Skills:
{result.missing_skills}
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

    career_keywords = [
        "career",
        "job",
        "resume",
        "roadmap",
        "skill",
        "interview",
        "placement",
        "internship",
        "ai engineer",
        "ml engineer",
        "data scientist"
    ]

    is_career_question = any(
        keyword in data.message.lower()
        for keyword in career_keywords
    )

    student_context = (
        get_student_context(data.student_id)
        if is_career_question
        else ""
    )

    resume_context = (
        get_resume_context(data.student_id)
        if is_career_question
        else ""
    )
    print("\n========== RESUME CONTEXT ==========")
    print(resume_context)
    print("====================================\n")

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
                "resume_context": resume_context,
                "chat_history": chat_history,
                "knowledge_context": knowledge_context,
                "question": data.message
            }
        )

    except Exception as e:
        print("\n========== CHAT ERROR ==========")
        print(type(e))
        print(str(e))
        print("================================")
        reply = "Chat service unavailable"

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
