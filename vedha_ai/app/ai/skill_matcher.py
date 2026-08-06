from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from app.nlp.skill_extractor import ROLE_SKILLS

# Lazy loaded model
_embedding_model = None


def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        try:
            _embedding_model = SentenceTransformer(
                "all-MiniLM-L6-v2"
            )
        except Exception as e:
            print(f"⚠️ Failed to load SentenceTransformer ('all-MiniLM-L6-v2') in skill_matcher: {e}")
            print("Fallback to MockSentenceTransformer (384 dimensions) for offline/local compatibility.")
            
            class MockSentenceTransformer:
                def encode(self, sentences, **kwargs):
                    import numpy as np
                    if isinstance(sentences, str):
                        sentences = [sentences]
                    return np.zeros((len(sentences), 384), dtype=np.float32)
            
            _embedding_model = MockSentenceTransformer()

    return _embedding_model


SKILL_ALIASES = {
    "neural networks": [
        "deep learning",
        "tensorflow",
        "pytorch",
    ],
    "data preprocessing": [
        "data cleaning",
    ],
    "model training": [
        "machine learning",
    ],
    "numpy": [
        "pandas",
    ],
}


def calculate_role_match(
    resume_skills: list[str],
    role: str,
) -> dict:

    required_skills = ROLE_SKILLS.get(role, [])

    if not required_skills or not resume_skills:
        return {
            "match_percent": 0.0,
            "matched_skills": [],
            "missing_skills": required_skills,
        }

    embedding_model = get_embedding_model()

    resume_embedding = embedding_model.encode(
        [" ".join(resume_skills)]
    )

    role_embedding = embedding_model.encode(
        [" ".join(required_skills)]
    )

    similarity = cosine_similarity(
        resume_embedding,
        role_embedding,
    )[0][0]

    resume_lower = [
        skill.lower()
        for skill in resume_skills
    ]

    matched = []
    missing = []

    for skill in required_skills:

        if skill.lower() in resume_lower:
            matched.append(skill)
            continue

        aliases = SKILL_ALIASES.get(
            skill.lower(),
            [],
        )

        if any(
            alias.lower() in resume_lower
            for alias in aliases
        ):
            matched.append(skill)
        else:
            missing.append(skill)

    skill_score = (
        len(matched)
        / len(required_skills)
    ) * 100

    match_percent = round(
        (float(similarity) * 70)
        + (skill_score * 0.30),
        1,
    )

    return {
        "match_percent": match_percent,
        "matched_skills": matched,
        "missing_skills": missing[:5],
    }