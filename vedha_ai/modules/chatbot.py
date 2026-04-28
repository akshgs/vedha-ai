from fastapi import APIRouter, HTTPException
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel
from utils.db import get_connection

router = APIRouter()

# Llama AI setup
llm = OllamaLLM(
    model="llama3.2",
    temperature=0.7
)

# Chat Prompt
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

# Chain
chat_chain = chat_prompt | llm | StrOutputParser()

# Pydantic model
class ChatRequest(BaseModel):
    student_id: int
    message: str

def get_student_context(student_id: int) -> str:
    conn = get_connection()
    student = conn.execute(
        "SELECT * FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()
    conn.close()

    if not student:
        return "A student using Vedha AI platform."

    return f"""Name: {student['name']}
Goal: {student['goal']}
Skills: {student['skills']}
Quiz Score: {student['quiz_score']}%"""


def get_chat_history(student_id: int) -> str:
    conn = get_connection()
    history = conn.execute(
        """SELECT role, message FROM chat_history
           WHERE student_id = ?
           ORDER BY created_at DESC
           LIMIT 6""",
        (student_id,)
    ).fetchall()
    conn.close()

    if not history:
        return "No previous conversation."

    lines = []
    for row in reversed(history):
        role = "Student" if row['role'] == "user" else "Vedha AI"
        lines.append(f"{role}: {row['message']}")

    return "\n".join(lines)


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

@router.post("/chat")
async def chat(data: ChatRequest):

    # Step 1: Empty check
    if not data.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty!"
        )

    # Step 2: Save user message
    save_message(data.student_id, "user", data.message)

    # Step 3: Get context
    student_context = get_student_context(data.student_id)
    chat_history = get_chat_history(data.student_id)

    # Step 4: Llama-നോട് ചോദിക്കുന്നു
    try:
        reply = await chat_chain.ainvoke({
            "student_context": student_context,
            "chat_history": chat_history,
            "question": data.message
        })

    except Exception as e:
        reply = f"Error: {str(e)}"

    # Step 5: Save and return
    save_message(data.student_id, "assistant", reply)
    return {
        "reply": reply,
        "mode": "llama3.2",
        "student_id": data.student_id
    }


@router.get("/history/{student_id}")
async def get_history(student_id: int):
    conn = get_connection()
    history = conn.execute(
        """SELECT role, message, created_at
           FROM chat_history
           WHERE student_id = ?
           ORDER BY created_at ASC""",
        (student_id,)
    ).fetchall()
    conn.close()

    return {
        "student_id": student_id,
        "history": [dict(row) for row in history]
    }