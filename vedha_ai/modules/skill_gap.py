from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import text
from utils.db import get_connection

router = APIRouter()

# ═══════════════════════════════════════════════
# 2026 KERALA IT ROLES
# ═══════════════════════════════════════════════

ROLE_SKILLS = {
    "Data Scientist": [
        "Python", "Pandas", "NumPy", "Scikit-learn",
        "Statistics", "Machine Learning", "SQL",
        "Data Visualization", "Matplotlib", "Seaborn"
    ],
    "ML Engineer": [
        "Python", "TensorFlow", "PyTorch", "Scikit-learn",
        "Docker", "REST APIs", "Deep Learning", "Git",
        "MLflow", "Model Deployment"
    ],
    "Backend Developer": [
        "Python", "FastAPI", "PostgreSQL", "SQL",
        "REST APIs", "Git", "Docker", "MongoDB",
        "Redis", "JWT Authentication"
    ],
    "Computer Vision Engineer": [
        "Python", "OpenCV", "TensorFlow", "PyTorch",
        "NumPy", "Deep Learning", "MediaPipe",
        "Image Processing", "Object Detection", "Git"
    ],
    "Prompt Engineer": [
        "Python", "LLM", "LangChain", "Prompt Engineering",
        "RAG", "Vector Databases", "ChatGPT", "Groq",
        "Fine-tuning", "Hugging Face"
    ],
    "MLOps Engineer": [
        "Python", "Docker", "Kubernetes", "MLflow",
        "CI/CD", "AWS", "Model Deployment", "FastAPI",
        "GitHub Actions", "Linux"
    ],
    "LLM Engineer": [
        "Python", "Transformers", "PyTorch", "Fine-tuning",
        "RAG", "LangChain", "Hugging Face", "FAISS",
        "BERT", "Llama"
    ],
    "GenAI Developer": [
        "Python", "LangChain", "Groq", "RAG",
        "FAISS", "Prompt Engineering", "FastAPI",
        "Vector Search", "LLM", "Streamlit"
    ],
    "Full Stack Developer": [
        "JavaScript", "React", "NodeJS", "Python",
        "FastAPI", "SQL", "MongoDB", "HTML", "CSS",
        "REST API", "Git", "Docker", "TypeScript"
    ],
    "DevOps Engineer": [
        "Docker", "Kubernetes", "AWS", "Linux",
        "CI/CD", "Jenkins", "Terraform", "Git",
        "Bash Scripting", "Monitoring"
    ],
    "Data Analyst": [
        "Python", "SQL", "Pandas", "Excel",
        "Power BI", "Tableau", "Statistics",
        "Data Visualization", "Google Analytics"
    ],
    "Android Developer": [
        "Kotlin", "Java", "Android SDK", "XML",
        "REST APIs", "Firebase", "Git",
        "Room Database", "Jetpack Compose"
    ],
    "Cloud Engineer": [
        "AWS", "Azure", "GCP", "Docker",
        "Kubernetes", "Terraform", "Linux",
        "Networking", "Security", "Python"
    ],
    "Cybersecurity Analyst": [
        "Linux", "Networking", "Python", "Ethical Hacking",
        "OWASP", "Firewalls", "Penetration Testing",
        "Cryptography", "SIEM", "Incident Response"
    ],
    "NLP Engineer": [
        "Python", "BERT", "Transformers", "spaCy",
        "NLTK", "Text Classification", "NER",
        "Hugging Face", "PyTorch", "RAG"
    ]
}

# ═══════════════════════════════════════════════
# KERALA IT COMPANIES
# ═══════════════════════════════════════════════

KERALA_COMPANIES = {
    "ML Engineer":           ["UST Global", "IBS Software", "Tata Elxsi", "Envestnet Yodlee"],
    "Data Scientist":        ["UST Global", "Ernst & Young", "Mphasis", "IBS Software"],
    "Full Stack Developer":  ["UST Global", "Infosys Kochi", "TCS Kochi", "Quest Global"],
    "DevOps Engineer":       ["UST Global", "Wipro Kochi", "IBS Software", "Mphasis"],
    "GenAI Developer":       ["UST Global", "Tata Elxsi", "Ernst & Young", "IBS Software"],
    "LLM Engineer":          ["UST Global", "Tata Elxsi", "Envestnet", "Mphasis"],
    "Android Developer":     ["UST Global", "Quest Global", "IBS Software", "Tata Elxsi"],
    "Cloud Engineer":        ["UST Global", "Wipro", "Infosys", "TCS"],
    "Cybersecurity Analyst": ["UST Global", "Ernst & Young", "IBS Software", "Mphasis"],
    "NLP Engineer":          ["UST Global", "Tata Elxsi", "Mphasis", "IBS Software"],
}

# ═══════════════════════════════════════════════
# REQUEST MODEL
# ═══════════════════════════════════════════════

class SkillGapRequest(BaseModel):
    student_id: int
    skills: List[str]
    target_role: str

# ═══════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════

def calculate_score(user_skills: List[str], required_skills: List[str]) -> int:
    if not required_skills:
        return 0
    user_lower     = [s.lower() for s in user_skills]
    required_lower = [s.lower() for s in required_skills]
    matched        = len([s for s in required_lower if s in user_lower])
    return int((matched / len(required_skills)) * 100)


def get_learning_resources(missing_skills: List[str]) -> List[dict]:
    resources_map = {
        "python":     {"platform": "freeCodeCamp",        "url": "https://freecodecamp.org",              "type": "Free"},
        "pytorch":    {"platform": "PyTorch Official",    "url": "https://pytorch.org/tutorials",         "type": "Free"},
        "docker":     {"platform": "Play with Docker",    "url": "https://labs.play-with-docker.com",     "type": "Free"},
        "langchain":  {"platform": "LangChain Docs",      "url": "https://python.langchain.com",          "type": "Free"},
        "sql":        {"platform": "SQLZoo",              "url": "https://sqlzoo.net",                    "type": "Free"},
        "react":      {"platform": "React Official Docs", "url": "https://react.dev",                     "type": "Free"},
        "aws":        {"platform": "AWS Free Tier",       "url": "https://aws.amazon.com/free",           "type": "Free"},
        "mlflow":     {"platform": "MLflow Docs",         "url": "https://mlflow.org/docs",               "type": "Free"},
        "kubernetes": {"platform": "Kubernetes Docs",     "url": "https://kubernetes.io/docs",            "type": "Free"},
        "spacy":      {"platform": "spaCy Docs",          "url": "https://spacy.io/usage",                "type": "Free"},
        "bert":       {"platform": "Hugging Face",        "url": "https://huggingface.co/docs",           "type": "Free"},
        "rag":        {"platform": "LangChain RAG Guide", "url": "https://python.langchain.com/docs/rag", "type": "Free"},
    }
    results = []
    for skill in missing_skills[:3]:
        skill_lower = skill.lower()
        if skill_lower in resources_map:
            results.append({"skill": skill, **resources_map[skill_lower]})
        else:
            results.append({
                "skill":    skill,
                "platform": "YouTube + Official Docs",
                "url":      f"https://youtube.com/search?q={skill}+tutorial+2026",
                "type":     "Free"
            })
    return results

# ═══════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════

@router.post("/analyse")
def analyse_skills(data: SkillGapRequest):
    required = ROLE_SKILLS.get(data.target_role)
    if not required:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown role: {data.target_role}. Available: {list(ROLE_SKILLS.keys())}"
        )

    user_lower     = [s.lower() for s in data.skills]
    missing_skills = [s for s in required if s.lower() not in user_lower]
    matched_skills = [s for s in required if s.lower() in user_lower]
    score          = calculate_score(data.skills, required)
    kerala_companies = KERALA_COMPANIES.get(data.target_role, [
        "Technopark companies", "Infopark companies", "Cyberpark companies"
    ])
    resources      = get_learning_resources(missing_skills)
    missing_count  = len(missing_skills)

    if missing_count <= 3:
        timeline = "1-2 months"
    elif missing_count <= 6:
        timeline = "3-4 months"
    else:
        timeline = "6-8 months"

    # ── PostgreSQL compatible update ──
    import json
    session = get_connection()
    try:
        session.execute(
            text("""UPDATE students
                    SET skills = :skills, quiz_score = :score
                    WHERE id = :id"""),
            {"skills": json.dumps(data.skills), "score": score, "id": data.student_id}
        )
        session.commit()
    finally:
        session.close()

    return {
        "student_id":         data.student_id,
        "target_role":        data.target_role,
        "your_skills":        data.skills,
        "matched_skills":     matched_skills,
        "missing_skills":     missing_skills,
        "score":              score,
        "kerala_companies":   kerala_companies,
        "learning_resources": resources,
        "estimated_timeline": timeline,
        "message": f"You have {score}% skills for {data.target_role} in Kerala IT market!"
    }


@router.get("/roles")
def get_all_roles():
    return {
        "total_roles": len(ROLE_SKILLS),
        "roles": [
            {
                "role":             role,
                "skills_required":  len(skills),
                "kerala_companies": KERALA_COMPANIES.get(role, ["Multiple Kerala IT companies"])
            }
            for role, skills in ROLE_SKILLS.items()
        ],
        "message": "2026 Kerala IT market roles"
    }


@router.get("/roles/{role_name}")
def get_role_details(role_name: str):
    skills = ROLE_SKILLS.get(role_name)
    if not skills:
        raise HTTPException(status_code=404, detail=f"Role '{role_name}' not found!")
    return {
        "role":              role_name,
        "required_skills":   skills,
        "total_skills":      len(skills),
        "kerala_companies":  KERALA_COMPANIES.get(role_name, ["Multiple Kerala IT companies"]),
        "message":           f"Skills needed for {role_name} in Kerala"
    }