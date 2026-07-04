import json
from pathlib import Path

from app.utils.skill_categories import get_skill_category


ROLE_FILE = (
    Path(__file__).parent.parent
    / "data"
    / "role_weights.json"
)

with open(
    ROLE_FILE,
    encoding="utf-8",
) as f:
    ROLE_WEIGHTS = json.load(f)


ROLE_KEYWORDS = {
    "Machine Learning Engineer": [
        "machine learning",
        "ai",
        "artificial intelligence",
        "ml",
        "data scientist",
        "computer vision",
        "nlp",
        "deep learning",
    ],
    "Data Scientist": [
        "data scientist",
        "machine learning",
        "analytics",
        "statistics",
        "data analysis",
    ],
    "Full Stack Developer": [
        "full stack",
        "backend",
        "frontend",
        "software engineer",
        "web developer",
    ],
    "NLP Engineer": [
        "nlp",
        "language model",
        "llm",
        "transformers",
        "bert",
        "rag",
    ],
}

def role_match_score(
    target_role: str,
    job_title: str,
    job_skills: list[str],
    description: str,
) -> float:

    role_config = ROLE_WEIGHTS.get(
        target_role,
        {},
    )

    if not role_config:
        return 0.0

    weights = role_config.get(
        "weights",
        {},
    )

    title_keywords = [
        keyword.lower()
        for keyword in role_config.get(
            "title_keywords",
            [],
        )
    ]

    title = job_title.lower()

    score = 0
    seen_categories = set()

    # ---------- Category Score ----------
    for skill in job_skills:

        category = get_skill_category(skill)

        if (
            category
            and category in weights
            and category not in seen_categories
        ):
            score += weights[category]
            seen_categories.add(category)

    # ---------- Title Bonus ----------
    title_bonus = 0

    for keyword in title_keywords:

        if keyword in title:
            title_bonus = 20
            break

    final_score = min(
        score + title_bonus,
        100,
    )

    return round(
        final_score,
        1,
    )