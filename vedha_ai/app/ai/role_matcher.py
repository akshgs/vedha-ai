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


def is_role_relevant(target_role: str, job_title: str) -> bool:
    import re
    target_role_lower = target_role.lower()
    job_title_lower = job_title.lower()
    
    if target_role_lower in job_title_lower or job_title_lower in target_role_lower:
        return True

    target_words = set(re.sub(r'[^a-zA-Z0-9\s]', ' ', target_role_lower).split())
    stopwords = {"developer", "engineer", "engineering", "manager", "lead", "architect", "intern", "junior", "senior", "staff", "associate", "analyst", "specialist", "assistant"}
    filtered_target_words = target_words - stopwords
    if not filtered_target_words:
        filtered_target_words = target_words

    job_words = set(re.sub(r'[^a-zA-Z0-9\s]', ' ', job_title_lower).split())
    if len(filtered_target_words.intersection(job_words)) > 0:
        return True

    # Check case-insensitive ROLE_KEYWORDS
    role_keywords_lower = {k.lower(): [v.lower() for v in val] for k, val in ROLE_KEYWORDS.items()}
    keywords = role_keywords_lower.get(target_role_lower, [])
    for kw in keywords:
        if kw in job_title_lower:
            return True

    return False