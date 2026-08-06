import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

_model = None

def get_semantic_model():
    """
    Get or initialize the SentenceTransformer lazy singleton.
    """
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            print(f"⚠️ Failed to load SentenceTransformer ('all-MiniLM-L6-v2'): {e}")
            print("Fallback to MockSentenceTransformer (384 dimensions) for offline/local compatibility.")
            
            class MockSentenceTransformer:
                def encode(self, sentences, **kwargs):
                    if isinstance(sentences, str):
                        sentences = [sentences]
                    results = []
                    for text in sentences:
                        vector = np.zeros(384)
                        for char in text:
                            idx = ord(char) % 384
                            vector[idx] += 1.0
                        norm = np.linalg.norm(vector)
                        if norm > 0:
                            vector = vector / norm
                        results.append(vector)
                    return np.array(results, dtype=np.float32)
            
            _model = MockSentenceTransformer()
    return _model


def semantic_similarity(
    resume_skills: list[str],
    job_skills: list[str],
) -> float:

    if not resume_skills or not job_skills:
        return 0.0

    resume_text = " ".join(resume_skills)
    job_text = " ".join(job_skills)

    try:
        model = get_semantic_model()
        resume_embedding = model.encode([resume_text])
        job_embedding = model.encode([job_text])

        similarity = cosine_similarity(
            resume_embedding,
            job_embedding,
        )[0][0]

        return round(float(similarity) * 100, 1)
    except Exception as e:
        print(f"❌ Error in semantic_similarity: {e}")
        return 0.0