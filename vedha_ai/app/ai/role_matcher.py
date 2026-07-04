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
    description: str,
) -> float:

    keywords = ROLE_KEYWORDS.get(
        target_role,
        [],
    )

    text = f"{job_title} {description}".lower()

    matched = sum(
        1
        for keyword in keywords
        if keyword in text
    )

    if not keywords:
        return 0.0

    return round(
        (matched / len(keywords)) * 100,
        1,
    )