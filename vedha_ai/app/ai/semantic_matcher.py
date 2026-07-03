from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")


def semantic_similarity(
    resume_skills: list[str],
    job_skills: list[str],
) -> float:

    if not resume_skills or not job_skills:
        return 0.0

    resume_text = " ".join(resume_skills)
    job_text = " ".join(job_skills)

    resume_embedding = model.encode([resume_text])
    job_embedding = model.encode([job_text])

    similarity = cosine_similarity(
        resume_embedding,
        job_embedding,
    )[0][0]

    return round(float(similarity) * 100, 1)