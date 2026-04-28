from fastapi import APIRouter, HTTPException
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel
from typing import Optional
from utils.db import get_connection

router = APIRouter()

llm = OllamaLLM(model="llama3.2", temperature=0.7)

# ─── All IT Tracks ────────────────────────────────
IT_TRACKS = {
    "Python & DSA": [
        "Arrays & Lists", "Strings", "Recursion",
        "Sorting & Searching", "Stacks & Queues",
        "Trees & Graphs", "Dynamic Programming",
        "OOP in Python", "File Handling"
    ],
    "Java": [
        "OOP Concepts", "Collections Framework",
        "Exception Handling", "Multithreading",
        "Java 8 Features", "Design Patterns",
        "Spring Boot Basics", "JDBC & Database"
    ],
    "JavaScript & Web": [
        "JS Fundamentals", "DOM Manipulation",
        "Async/Await & Promises", "React Basics",
        "Node.js & Express", "REST APIs",
        "HTML & CSS", "TypeScript Basics"
    ],
    "SQL & Database": [
        "SELECT & Filtering", "JOINs",
        "Aggregations", "Subqueries",
        "Indexes & Performance", "NoSQL Basics",
        "Database Design", "Transactions"
    ],
    "Machine Learning": [
        "Linear Regression", "Classification",
        "Decision Trees", "Neural Networks",
        "Model Evaluation", "Feature Engineering",
        "Clustering", "Deep Learning Basics"
    ],
    "Cloud & DevOps": [
        "Linux Commands", "Git & GitHub",
        "Docker Basics", "CI/CD Pipeline",
        "AWS/GCP Basics", "Kubernetes Intro",
        "Networking Basics", "Shell Scripting"
    ],
    "Cybersecurity": [
        "Network Security", "Linux Security",
        "Cryptography Basics", "OWASP Top 10",
        "Penetration Testing Intro",
        "Firewalls & IDS", "CTF Challenges"
    ],
    "Android Development": [
        "Kotlin Basics", "Android UI",
        "Activities & Fragments", "RecyclerView",
        "API Integration", "Room Database",
        "Firebase", "Play Store Deploy"
    ],
    "Data Analytics": [
        "Pandas & NumPy", "Data Visualization",
        "Matplotlib & Seaborn", "Power BI",
        "Excel & Google Sheets", "Statistics",
        "A/B Testing", "Dashboard Design"
    ]
}

# ─── Pydantic Models ──────────────────────────────
class HintRequest(BaseModel):
    student_id: int
    track: str
    topic: str
    problem: str
    hint_level: int = 1
    code: Optional[str] = None

class PracticeRequest(BaseModel):
    student_id: int
    track: str
    topic: str
    difficulty: str = "Intermediate"

# ─── AI Functions ─────────────────────────────────
async def get_hint(problem: str, hint_level: int, 
                   track: str, code: Optional[str]) -> str:
    
    hint_instructions = {
        1: "Give ONE small hint only. No solution. Just point toward the right direction.",
        2: "Explain the approach and algorithm. No complete code.",
        3: "Give complete step-by-step solution with explanation."
    }
    
    instruction = hint_instructions.get(hint_level, hint_instructions[1])
    
    code_section = f"\nStudent's current code:\n{code}" if code else ""
    
    prompt = PromptTemplate(
        input_variables=["track", "problem", "code", "instruction"],
        template="""You are a coding mentor helping a {track} student.

Problem: {problem}
{code}

Instructions: {instruction}

Be encouraging and educational."""
    )
    
    chain = prompt | llm | StrOutputParser()
    
    result = await chain.ainvoke({
        "track": track,
        "problem": problem,
        "code": code_section,
        "instruction": instruction
    })
    
    return result


async def generate_practice_problem(track: str, topic: str, 
                                     difficulty: str) -> str:
    prompt = PromptTemplate(
        input_variables=["track", "topic", "difficulty"],
        template="""You are a coding instructor creating a practice problem.

Track: {track}
Topic: {topic}  
Difficulty: {difficulty}

Create ONE clear practice problem with:
1. Problem statement
2. Example input/output
3. Constraints

Keep it practical and relevant for Indian IT interviews."""
    )
    
    chain = prompt | llm | StrOutputParser()
    
    result = await chain.ainvoke({
        "track": track,
        "topic": topic,
        "difficulty": difficulty
    })
    
    return result


# ─── Endpoints ────────────────────────────────────

@router.get("/tracks")
def get_tracks():
    return {
        "tracks": list(IT_TRACKS.keys()),
        "total": len(IT_TRACKS),
        "message": "Choose a track to start practicing!"
    }


@router.get("/topics/{track}")
def get_topics(track: str):
    topics = IT_TRACKS.get(track)
    if not topics:
        raise HTTPException(
            status_code=400,
            detail=f"Track '{track}' not found!"
        )
    return {
        "track": track,
        "topics": topics,
        "total": len(topics)
    }


@router.post("/practice")
async def get_practice_problem(data: PracticeRequest):
    if data.track not in IT_TRACKS:
        raise HTTPException(
            status_code=400,
            detail=f"Track '{data.track}' not found!"
        )

    topics = IT_TRACKS[data.track]
    if data.topic not in topics:
        raise HTTPException(
            status_code=400,
            detail=f"Topic '{data.topic}' not found!"
        )

    try:
        problem = await generate_practice_problem(
            data.track,
            data.topic,
            data.difficulty
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI error: {str(e)}"
        )

    return {
        "track": data.track,
        "topic": data.topic,
        "difficulty": data.difficulty,
        "problem": problem,
        "message": "Use /leetcode/hint to get hints!"
    }


@router.post("/hint")
async def get_problem_hint(data: HintRequest):
    if not data.problem.strip():
        raise HTTPException(
            status_code=400,
            detail="Problem cannot be empty!"
        )

    if data.hint_level not in [1, 2, 3]:
        raise HTTPException(
            status_code=400,
            detail="Hint level must be 1, 2, or 3!"
        )

    try:
        hint = await get_hint(
            data.problem,
            data.hint_level,
            data.track,
            data.code
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI error: {str(e)}"
        )

    # Save to DB
    try:
        conn = get_connection()
        conn.execute("""
            CREATE TABLE IF NOT EXISTS leetcode_history (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id  INTEGER,
                track       TEXT,
                topic       TEXT,
                problem     TEXT,
                hint_level  INTEGER,
                hint        TEXT,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.execute("""
            INSERT INTO leetcode_history
            (student_id, track, topic, problem, hint_level, hint)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            data.student_id,
            data.track,
            data.topic,
            data.problem[:200],
            data.hint_level,
            hint[:500]
        ))
        conn.commit()
        conn.close()
    except Exception:
        pass

    return {
        "track": data.track,
        "topic": data.topic,
        "hint_level": data.hint_level,
        "hint": hint,
        "next_hint": data.hint_level + 1 if data.hint_level < 3 else None,
        "message": "Need more help? Increase hint_level!"
    }


@router.get("/history/{student_id}")
def get_history(student_id: int):
    conn = get_connection()
    try:
        rows = conn.execute("""
            SELECT track, topic, hint_level, created_at
            FROM leetcode_history
            WHERE student_id = ?
            ORDER BY created_at DESC
            LIMIT 20
        """, (student_id,)).fetchall()
    except Exception:
        return {"history": [], "message": "No history yet!"}
    finally:
        conn.close()

    return {
        "student_id": student_id,
        "total": len(rows),
        "history": [dict(r) for r in rows]
    }