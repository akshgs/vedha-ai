from fastapi import APIRouter
from utils.db import get_connection

router = APIRouter()

OPPORTUNITIES = [
    {
        "id": 1,
        "type": "internship",
        "title": "Data Science Intern",
        "company": "TCS Digital",
        "required_skills": ["Python", "Pandas", "Machine Learning"],
        "stipend": "₹20,000/month",
        "deadline": "May 30, 2026",
        "link": "https://tcs.com/careers"
    },
    {
        "id": 2,
        "type": "internship",
        "title": "ML Research Intern",
        "company": "IIT Madras AI Lab",
        "required_skills": ["Python", "TensorFlow", "Deep Learning"],
        "stipend": "₹15,000/month",
        "deadline": "May 10, 2026",
        "link": "https://www.iitm.ac.in"
    },
    {
        "id": 3,
        "type": "scholarship",
        "title": "KSUM Innovation Grant",
        "company": "Kerala Startup Mission",
        "required_skills": ["Python", "Machine Learning", "Project"],
        "stipend": "₹1,00,000",
        "deadline": "May 1, 2026",
        "link": "https://startupmission.kerala.gov.in"
    },
    {
        "id": 4,
        "type": "internship",
        "title": "Computer Vision Intern",
        "company": "UST Global Kochi",
        "required_skills": ["OpenCV", "Python", "Deep Learning"],
        "stipend": "₹18,000/month",
        "deadline": "April 25, 2026",
        "link": "https://www.ust.com/careers"
    },
    {
        "id": 5,
        "type": "job",
        "title": "Junior Data Analyst",
        "company": "Infosys Trivandrum",
        "required_skills": ["SQL", "Python", "Data Visualization"],
        "stipend": "₹4.5 LPA",
        "deadline": "Open",
        "link": "https://infosys.com/careers"
    },
    {
        "id": 6,
        "type": "scholarship",
        "title": "DST INSPIRE Fellowship",
        "company": "Govt. of India",
        "required_skills": ["Statistics", "Research", "Machine Learning"],
        "stipend": "₹80,000",
        "deadline": "May 15, 2026",
        "link": "https://online-inspire.gov.in"
    }
]

def calculate_match(user_skills: list,
                    required_skills: list) -> int:
    if not required_skills:
        return 0
    matched = len([
        s for s in required_skills
        if s in user_skills
    ])
    return int((matched / len(required_skills)) * 100)

@router.get("/all")
def get_all_opportunities():
    return {
        "opportunities": OPPORTUNITIES,
        "total":         len(OPPORTUNITIES)
    }

@router.get("/match/{student_id}")
def get_matched_opportunities(student_id: int):
    conn    = get_connection()
    student = conn.execute(
        "SELECT skills FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()
    conn.close()

    if not student:
        return {"error": "Student not found"}

    raw_skills = student["skills"]

    if raw_skills == "[]" or not raw_skills:
        user_skills = []
    else:
        user_skills = [
            s.strip().strip("[]'\"")
            for s in raw_skills.split(",")
        ]

    results = []
    for opp in OPPORTUNITIES:
        match_pct = calculate_match(
            user_skills,
            opp["required_skills"]
        )
        results.append({
            **opp,
            "match_percent": match_pct
        })

    results.sort(
        key=lambda x: x["match_percent"],
        reverse=True
    )

    return {
        "student_id":    student_id,
        "user_skills":   user_skills,
        "opportunities": results,
        "total":         len(results)
    }

@router.get("/filter/{opp_type}")
def filter_opportunities(opp_type: str):
    valid_types = ["internship", "scholarship", "job"]

    if opp_type not in valid_types:
        return {
            "error": f"Invalid type. Choose: {valid_types}"
        }

    filtered = [
        o for o in OPPORTUNITIES
        if o["type"] == opp_type
    ]

    return {
        "type":          opp_type,
        "opportunities": filtered,
        "total":         len(filtered)
    }