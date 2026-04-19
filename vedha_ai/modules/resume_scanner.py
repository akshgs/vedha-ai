from fastapi import APIRouter, HTTPException, UploadFile, File
from utils.db import get_connection
import re

router = APIRouter()

ALL_SKILLS = [
    "Python", "Pandas", "NumPy", "Scikit-learn",
    "TensorFlow", "PyTorch", "OpenCV", "FastAPI",
    "Flask", "Django", "React", "JavaScript",
    "SQL", "PostgreSQL", "MongoDB", "Redis",
    "Machine Learning", "Deep Learning", "NLP",
    "Data Visualization", "Statistics", "Git",
    "Docker", "REST APIs", "HTML", "CSS",
    "Matplotlib", "Seaborn", "XGBoost",
    "Computer Vision", "Transformers", "AWS",
    "Linux", "Jupyter", "Tableau", "Power BI"
]

def extract_skills_from_text(text: str) -> list:
    text_lower   = text.lower()
    found_skills = []
    for skill in ALL_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill)
    return found_skills

@router.get("/skills-list")
def get_skills_list():
    return {
        "available_skills": ALL_SKILLS,
        "total":            len(ALL_SKILLS),
        "tip":              "Make sure your resume mentions these exact skill names!"
    }

@router.post("/scan-text")
async def scan_resume_text(student_id: int, resume_text: str):
    if not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Resume text cannot be empty!"
        )
    found_skills = extract_skills_from_text(resume_text)
    if not found_skills:
        return {
            "message":      "No known skills found",
            "found_skills": [],
            "count":        0,
            "tip":          "Try adding more technical skills to your resume!"
        }
    conn    = get_connection()
    student = conn.execute(
        "SELECT skills FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()
    if student:
        existing = student["skills"]
        if existing and existing != "[]":
            existing_list = [s.strip().strip("[]'\"") for s in existing.split(",")]
        else:
            existing_list = []
        all_skills = list(set(existing_list + found_skills))
        conn.execute(
            "UPDATE students SET skills = ? WHERE id = ?",
            (str(all_skills), student_id)
        )
        conn.commit()
    conn.close()
    return {
        "student_id":   student_id,
        "found_skills": found_skills,
        "count":        len(found_skills),
        "message":      f"Found {len(found_skills)} skills in your resume!",
        "tip":          "Go to Skill Gap Analyser to see what you are missing!"
    }

@router.post("/scan-file")
async def scan_resume_file(student_id: int, file: UploadFile = File(...)):
    allowed_types = ["text/plain","application/pdf","application/msword"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only .txt, .pdf, .doc files allowed!"
        )
    content = await file.read()
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        try:
            text = content.decode("latin-1")
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Could not read file. Try .txt format!"
            )
    found_skills = extract_skills_from_text(text)
    return {
        "filename":     file.filename,
        "student_id":   student_id,
        "found_skills": found_skills,
        "count":        len(found_skills),
        "message":      f"Scanned {file.filename} — Found {len(found_skills)} skills!"
    }