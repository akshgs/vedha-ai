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

    keywords = [
        keyword.lower()
        for keyword in ROLE_KEYWORDS.get(
            target_role,
            [],
        )
    ]

    if not keywords:
        return 0.0

    title = job_title.lower()
    description = description.lower()

    skills = {
        skill.lower().strip()
        for skill in job_skills
    }

    # ---------- Title Score (50%) ----------
    title_matches = sum(
        1
        for keyword in keywords
        if keyword in title
    )

    title_score = (
        title_matches / len(keywords)
    ) * 50

    # ---------- Skills Score (30%) ----------
    skill_matches = sum(
        1
        for keyword in keywords
        if keyword in skills
    )

    skills_score = (
        skill_matches / len(keywords)
    ) * 30

    # ---------- Description Score (20%) ----------
    description_matches = sum(
        1
        for keyword in keywords
        if keyword in description
    )

    description_score = (
        description_matches / len(keywords)
    ) * 20

    final_score = (
        title_score
        + skills_score
        + description_score
    )

    return round(
        min(final_score, 100),
        1,
    )