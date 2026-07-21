import re


def calculate_ats_score(
    resume_text: str,
    match_percent: int,
) -> int:
    """
    Calculate ATS score out of 100.
    """

    score = 0
    text = resume_text.lower()

    # -------------------------
    # 1. Skill Match (40 Marks)
    # -------------------------
    score += match_percent * 0.4

    # -------------------------
    # 2. Resume Length (10 Marks)
    # -------------------------
    word_count = len(re.findall(r"\w+", text))

    if 300 <= word_count <= 900:
        score += 10
    elif 200 <= word_count < 300:
        score += 5

    # -------------------------
    # 3. Projects (15 Marks)
    # -------------------------
    if "project" in text:
        score += 15

    # -------------------------
    # 4. Education (10 Marks)
    # -------------------------
    education_keywords = [
        "b.tech",
        "btech",
        "m.tech",
        "degree",
        "university",
        "college",
    ]

    if any(word in text for word in education_keywords):
        score += 10

    # -------------------------
    # 5. Experience (15 Marks)
    # -------------------------
    experience_keywords = [
        "experience",
        "intern",
        "developer",
        "engineer",
        "worked",
    ]

    if any(word in text for word in experience_keywords):
        score += 15

    # -------------------------
    # 6. Important Keywords (10 Marks)
    # -------------------------
    keywords = [
        "python",
        "sql",
        "git",
        "api",
        "docker",
        "fastapi",
        "machine learning",
    ]

    matched = sum(
        keyword in text
        for keyword in keywords
    )

    score += min(10, matched * 2)

    return min(100, round(score))