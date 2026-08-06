import numpy as np
try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False

class SentenceEmbeddings:
    """
    Generate deep learning sentence/document embeddings using sentence-transformers
    with a lightweight semantic mock vectorizer fallback if memory or import limits arise.
    """
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = None
        if HAS_SENTENCE_TRANSFORMERS:
            try:
                self.model = SentenceTransformer(model_name)
            except Exception as e:
                print(f"⚠️ Failed to load SentenceTransformer: {e}")

    def embed_text(self, text: str) -> list:
        if self.model:
            try:
                embedding = self.model.encode(text)
                return embedding.tolist()
            except Exception as e:
                print(f"❌ Encoding text failed: {e}")
        
        # Simple deterministic character-frequency hashing mock vector (384 dimensions)
        return self._generate_mock_vector(text)

    def embed_batch(self, texts: list) -> list:
        if self.model:
            try:
                embeddings = self.model.encode(texts)
                return embeddings.tolist()
            except Exception as e:
                print(f"❌ Batch encoding failed: {e}")
                
        return [self._generate_mock_vector(t) for t in texts]

    def _generate_mock_vector(self, text: str) -> list:
        # Simple character distribution mock vector
        vector = np.zeros(384)
        for char in text:
            idx = ord(char) % 384
            vector[idx] += 1.0
        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm
        return vector.tolist()

embedding_pipeline = SentenceEmbeddings()
