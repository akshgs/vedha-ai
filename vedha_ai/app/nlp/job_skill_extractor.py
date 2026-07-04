import spacy

from app.utils.skill_loader import load_skills

nlp = spacy.load("en_core_web_sm")

KNOWN_SKILLS = load_skills()


def extract_job_skills(text: str) -> list[str]:

    if not text:
        return []

    text = text.lower()

    doc = nlp(text)

    skills = set()

    # Direct keyword matching
    for skill in KNOWN_SKILLS:
        if skill in text:
            skills.add(skill)

    # Noun phrase matching
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip().lower()

        if chunk_text in KNOWN_SKILLS:
            skills.add(chunk_text)

    return sorted(skills)