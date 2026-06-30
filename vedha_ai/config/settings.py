import os
from dotenv import load_dotenv
load_dotenv()

ANTHROPIC_API_KEY  = os.getenv("ANTHROPIC_API_KEY", "")
DATABASE_URL       = "vedha_ai.db"
EMBEDDING_MODEL    = "all-MiniLM-L6-v2"
APP_NAME           = "Vedha AI"

SCORE_WEIGHTS = {
    "quiz_score": 0.30, "project_score": 0.30,
    "skill_count": 0.20, "activity": 0.20,
}

TECH_STACKS = [
    "Python","JavaScript","React","Node.js","Machine Learning",
    "Deep Learning","Data Science","DevOps","Flutter","SQL",
    "Java","Kotlin","Swift","Cloud (AWS/GCP/Azure)","Cybersecurity"
]

ROADMAPS = {
    "Machine Learning Engineer": [
        "Python","NumPy","Pandas","Scikit-learn",
        "Deep Learning","TensorFlow/PyTorch","MLOps","SQL","Cloud (AWS/GCP/Azure)"
    ],
    "Full Stack Developer": [
        "HTML/CSS","JavaScript","React","Node.js",
        "SQL","REST APIs","Git","Docker","Cloud (AWS/GCP/Azure)"
    ],
    "Data Scientist": [
        "Python","SQL","Pandas","NumPy","Statistics",
        "Matplotlib","Scikit-learn","Machine Learning","Deep Learning"
    ],
    "DevOps Engineer": [
        "Linux","Git","Docker","Kubernetes",
        "CI/CD","Cloud (AWS/GCP/Azure)","Terraform","Python"
    ],
    "Android Developer": [
        "Java","Kotlin","Android SDK","REST APIs",
        "SQL","Git","Firebase"
    ],
}