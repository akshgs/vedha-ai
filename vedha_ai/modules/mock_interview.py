from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from utils.db import get_connection

from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


router = APIRouter()

llm = OllamaLLM(model="llama3.2", temperature=0.7)


# -------------------------------------------------------
# All supported roles and their core topics
# -------------------------------------------------------
ROLE_TOPICS = {
    "Data Scientist": [
        "Python & Pandas", "Machine Learning", "Statistics & Probability",
        "Feature Engineering", "Model Evaluation", "SQL & Data Wrangling",
        "Deep Learning Basics", "Real-world Projects"
    ],
    "ML Engineer": [
        "Python & PyTorch/TensorFlow", "Model Deployment", "MLOps & Docker",
        "REST APIs with FastAPI", "Deep Learning", "Git & CI/CD",
        "Data Pipelines", "System Design for ML"
    ],
    "Data Analyst": [
        "SQL & Excel", "Data Visualization", "Statistics",
        "Python & Pandas", "Business Problem Solving",
        "Tableau / Power BI", "A/B Testing", "Reporting & Dashboards"
    ],
    "Computer Vision Engineer": [
        "OpenCV Fundamentals", "CNNs & Deep Learning", "Image Preprocessing",
        "Object Detection (YOLO)", "PyTorch for Vision", "Real-time Video Processing",
        "Transfer Learning", "Dataset Handling"
    ],
    "NLP Engineer": [
        "Text Preprocessing", "Transformers & BERT", "spaCy & NLTK",
        "Sentiment Analysis", "Named Entity Recognition", "LLMs & Prompt Engineering",
        "Text Classification", "Sequence Models"
    ],
    "Backend Developer": [
        "FastAPI & Flask", "PostgreSQL & MongoDB", "REST API Design",
        "Authentication & JWT", "Docker & Deployment", "Git",
        "System Design Basics", "Caching & Redis"
    ]
}

DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"]

# -------------------------------------------------------
# Pydantic models
# -------------------------------------------------------
class StartInterviewRequest(BaseModel):
    student_id: int
    role: str
    difficulty: str = "Intermediate"   # Beginner | Intermediate | Advanced
    topic: Optional[str] = None        # None = random topic

class SubmitAnswerRequest(BaseModel):
    student_id: int
    role: str
    difficulty: str
    question: str
    answer: str

class InterviewFeedback(BaseModel):
    score: int                 # 0 - 100
    grade: str                 # Excellent / Good / Needs Work / Poor
    strengths: List[str]
    improvements: List[str]
    sample_answer: str
    tip: str

# -------------------------------------------------------
# Helper: call ollma
# -------------------------------------------------------
async def call_llama(system_prompt: str, user_message: str) -> str:
    prompt = PromptTemplate(
        input_variables=["system", "user"],
        template="{system}\n\n{user}"
    )
    chain = prompt | llm | StrOutputParser()
    
    result = await chain.ainvoke({
        "system": system_prompt,
        "user": user_message
    })
    return result
# -------------------------------------------------------
# Helper: save interview session to DB
# -------------------------------------------------------
def save_session(student_id: int, role: str, question: str,
                 answer: str, score: int, feedback: str):
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS interview_sessions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id  INTEGER NOT NULL,
            role        TEXT,
            question    TEXT,
            answer      TEXT,
            score       INTEGER,
            feedback    TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.execute("""
        INSERT INTO interview_sessions (student_id, role, question, answer, score, feedback)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (student_id, role, question, answer, score, feedback))
    conn.commit()
    conn.close()

# -------------------------------------------------------
# Helper: grade from score
# -------------------------------------------------------
def get_grade(score: int) -> str:
    if score >= 85: return "Excellent 🌟"
    if score >= 65: return "Good 👍"
    if score >= 40: return "Needs Work 📚"
    return "Keep Practicing 💪"

# -------------------------------------------------------
# ENDPOINT 1: Get all supported roles
# -------------------------------------------------------
@router.get("/roles")
def get_roles():
    return {
        "roles":      list(ROLE_TOPICS.keys()),
        "difficulty": DIFFICULTY_LEVELS,
        "message":    "Choose a role and difficulty to start your mock interview!"
    }

# -------------------------------------------------------
# ENDPOINT 2: Get topics for a role
# -------------------------------------------------------
@router.get("/topics/{role}")
def get_topics(role: str):
    topics = ROLE_TOPICS.get(role)
    if not topics:
        raise HTTPException(status_code=400, detail=f"Role '{role}' not found. Use /interview/roles to see all roles.")
    return {"role": role, "topics": topics}

# -------------------------------------------------------
# ENDPOINT 3: Start interview — generate a question
# -------------------------------------------------------
@router.post("/start")
async def start_interview(data: StartInterviewRequest):
    topics = ROLE_TOPICS.get(data.role)
    if not topics:
        raise HTTPException(status_code=400, detail=f"Role '{data.role}' not supported.")

    chosen_topic = data.topic if data.topic else topics[0]

    system_prompt = """You are an expert technical interviewer at a top Indian tech company.
Your job is to ask ONE clear, realistic interview question.
Return ONLY the question — no explanation, no intro, no numbering.
The question should be practical and test real understanding."""

    user_message = f"""Generate ONE {data.difficulty} level interview question for a {data.role} candidate.
Topic: {chosen_topic}
The question should be specific, not generic. Make it something a real interviewer would ask."""

    try:
        question = await call_llama(system_prompt, user_message, max_tokens=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

    return {
        "role":       data.role,
        "difficulty": data.difficulty,
        "topic":      chosen_topic,
        "question":   question.strip(),
        "message":    "Answer this question using the /interview/submit endpoint!"
    }

# -------------------------------------------------------
# ENDPOINT 4: Submit answer — get score + feedback
# -------------------------------------------------------
@router.post("/submit")
async def submit_answer(data: SubmitAnswerRequest):
    if not data.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty!")

    if len(data.answer.strip()) < 20:
        raise HTTPException(status_code=400, detail="Answer is too short. Please give a proper answer!")

    system_prompt = """You are a strict but fair technical interviewer evaluating a candidate's answer.
You MUST respond in this exact JSON format (no extra text):
{
  "score": <integer 0-100>,
  "strengths": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "sample_answer": "<a concise ideal answer in 3-4 sentences>",
  "tip": "<one specific career tip for this topic>"
}
Be honest. If the answer is wrong or incomplete, give a low score."""

    user_message = f"""Role: {data.role}
Difficulty: {data.difficulty}
Question: {data.question}
Candidate's Answer: {data.answer}

Evaluate this answer strictly and fairly. Score out of 100."""

    try:
        raw = await call_llama(system_prompt, user_message, max_tokens=600)

        # Parse JSON safely
        import json, re
        json_match = re.search(r'\{.*\}', raw, re.DOTALL)
        if not json_match:
            raise ValueError("Could not parse AI response")

        parsed = json.loads(json_match.group())

        score        = int(parsed.get("score", 50))
        strengths    = parsed.get("strengths", [])
        improvements = parsed.get("improvements", [])
        sample       = parsed.get("sample_answer", "")
        tip          = parsed.get("tip", "Keep practising!")

    except Exception:
        # Fallback if JSON parsing fails
        score        = 50
        strengths    = ["You attempted the answer"]
        improvements = ["Try to be more specific", "Add examples from real projects"]
        sample       = "Please review the topic and try again."
        tip          = "Practice explaining concepts out loud — it helps in real interviews!"

    grade = get_grade(score)

    # Save to database
    try:
        save_session(
            data.student_id, data.role,
            data.question, data.answer,
            score, str({"strengths": strengths, "improvements": improvements})
        )
    except Exception:
        pass  # Don't crash if DB save fails

    return {
        "score":        score,
        "grade":        grade,
        "strengths":    strengths,
        "improvements": improvements,
        "sample_answer": sample,
        "tip":          tip,
        "message":      "Call /interview/start again for your next question!"
    }

# -------------------------------------------------------
# ENDPOINT 5: Get interview history for a student
# -------------------------------------------------------
@router.get("/history/{student_id}")
def get_history(student_id: int):
    conn = get_connection()
    try:
        sessions = conn.execute("""
            SELECT role, question, score, created_at
            FROM interview_sessions
            WHERE student_id = ?
            ORDER BY created_at DESC
            LIMIT 20
        """, (student_id,)).fetchall()
    except Exception:
        return {"sessions": [], "message": "No interview history yet. Start practicing!"}
    finally:
        conn.close()

    if not sessions:
        return {"sessions": [], "message": "No interview history yet. Start practicing!"}

    result = [dict(s) for s in sessions]
    avg_score = sum(s["score"] for s in result) / len(result)

    return {
        "student_id": student_id,
        "total_sessions": len(result),
        "average_score":  round(avg_score, 1),
        "sessions":       result
    }

# -------------------------------------------------------
# ENDPOINT 6: Quick practice — random question, no login
# -------------------------------------------------------
@router.get("/quick/{role}")
async def quick_practice(role: str, difficulty: str = "Intermediate"):
    topics = ROLE_TOPICS.get(role)
    if not topics:
        raise HTTPException(status_code=400, detail=f"Role '{role}' not supported.")

    import random
    topic = random.choice(topics)

    system_prompt = "You are a technical interviewer. Ask ONE short, clear interview question. Return ONLY the question."
    user_message  = f"One {difficulty} {role} interview question about {topic}."

    try:
        question = await call_llama(system_prompt, user_message, max_tokens=150)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "role":       role,
        "topic":      topic,
        "difficulty": difficulty,
        "question":   question.strip()
    }