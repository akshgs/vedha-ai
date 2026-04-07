from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from utils.db import get_connection

router = APIRouter()

ROLE_SKILLS={
     "Data Scientist": [
        "Python", "Pandas", "NumPy",
        "Scikit-learn", "Statistics",
        "Machine Learning", "SQL",
        "Data Visualization"
    ],
     "ML Engineer": [
        "Python", "TensorFlow", "PyTorch",
        "Scikit-learn", "Docker",
        "REST APIs", "Deep Learning", "Git"
    ],
    "Backend Developer": [
        "Python", "FastAPI", "PostgreSQL",
        "SQL", "REST APIs", "Git",
        "Docker", "MongoDB"
    ],
      "Computer Vision Engineer": [
        "Python", "OpenCV", "TensorFlow",
        "PyTorch", "NumPy",
        "Deep Learning", "Git"
    ]
}

class SkillGapRequest(BaseModel):
    student_id:int
    skills:List[str]
    target_role:str

def calculate_score(user_skills: List[str], required_skills: List[str]) -> float:
    if not required_skills:
        return 0
    matched=len([
        s for s  in user_skills if s in required_skills
    ])
    score=int((matched/len(required_skills))*100)
    return score

@router.post("/analyse")
def analyse_skills(data: SkillGapRequest):
    required=ROLE_SKILLS.get(data.target_role)

    if not required:
        raise HTTPException(status_code=400,detail=f"Unknown role: {data.target_role}")

    missing_skills=[s for s in required if s not in data.skills]
    score=calculate_score(data.skills,required)

    conn=get_connection()
    conn.execute(
        """UPDATE students 
           SET skills = ?, quiz_score = ?
           WHERE id = ?""",
        (str(data.skills), score, data.student_id)
    )
    conn.commit()
    conn.close()

    return {
        "student_id":    data.student_id,
        "target_role":   data.target_role,
        "your_skills":   data.skills,
        "missing_skills": missing_skills,
        "score":         score,
        "message":       f"You have {score}% skills for {data.target_role}"
    }

