SKILL_ALIASES = {
    "tensorflow": ["deep learning", "machine learning"],
    "pytorch": ["deep learning", "neural networks"],
    "scikit-learn": ["machine learning"],
    "fastapi": ["rest api"],
    "nlp": ["natural language processing"],
    "sql": ["mysql", "postgresql"],
    "aws": ["cloud"],
    "docker": ["containers"],
}


def calculate_job_match(
    resume_skills: list[str],
    job_skills: list[str],
) -> dict:

    resume_set = {
        skill.lower().strip()
        for skill in resume_skills
    }

    expanded_resume = set(resume_set)

    for skill in list(resume_set):
        aliases = SKILL_ALIASES.get(skill, [])
        expanded_resume.update(
            alias.lower()
            for alias in aliases
        )

    job_set = {
        skill.lower().strip()
        for skill in job_skills
    }

    if not job_set:
        return {
            "match_percent": 0,
            "matched_skills": [],
        }

    matched = sorted(
        expanded_resume.intersection(job_set)
    )

    score = round(
        (len(matched) / len(job_set)) * 100,
        1,
    )

    return {
        "match_percent": score,
        "matched_skills": matched,
    }