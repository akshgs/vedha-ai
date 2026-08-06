import os
import json
import numpy as np
from app.ai.embeddings.hf_embeddings import embedding_pipeline

try:
    import faiss
    HAS_FAISS = True
except ImportError:
    HAS_FAISS = False

class FAISSVectorStore:
    """
    Central FAISS vector store supporting text vector additions and
    similarity lookups.
    """
    def __init__(self, dimension: int = 384, save_dir: str = "data/vector_store"):
        self.dimension = dimension
        self.save_dir = save_dir
        self.metadata = []
        
        if HAS_FAISS:
            self.index = faiss.IndexFlatIP(dimension) # Inner product (cosine distance for normalized vectors)
        else:
            self.index = None
            print("⚠️ FAISS is not installed. Falling back to NumPy cosine similarity indices.")

    def add_texts(self, texts: list, metadatas: list = None):
        if not texts:
            return
            
        embeddings = embedding_pipeline.embed_batch(texts)
        emb_arr = np.array(embeddings).astype("float32")
        
        # Normalize vectors for cosine similarity
        norms = np.linalg.norm(emb_arr, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        emb_arr = emb_arr / norms

        if self.index:
            self.index.add(emb_arr)
        else:
            # Simple NumPy list store fallback
            if not hasattr(self, "numpy_index"):
                self.numpy_index = []
            for emb in emb_arr.tolist():
                self.numpy_index.append(emb)

        for i, text in enumerate(texts):
            meta = metadatas[i] if metadatas else {}
            self.metadata.append({"text": text, **meta})

    def search(self, query: str, k: int = 3) -> list:
        if not self.metadata:
            return []
            
        query_emb = embedding_pipeline.embed_text(query)
        q_arr = np.array([query_emb]).astype("float32")
        
        # Normalize query vector
        norm = np.linalg.norm(q_arr)
        if norm > 0:
            q_arr = q_arr / norm

        results = []
        if self.index:
            try:
                distances, indices = self.index.search(q_arr, k)
                for dist, idx in zip(distances[0], indices[0]):
                    if idx != -1 and idx < len(self.metadata):
                        results.append({
                            "score": float(dist),
                            "metadata": self.metadata[idx]
                        })
            except Exception as e:
                print(f"❌ FAISS search error: {e}")
        
        # Cosine fallback search
        if not results and (hasattr(self, "numpy_index") or not self.index):
            numpy_idx = getattr(self, "numpy_index", [])
            if numpy_idx:
                scores = np.dot(np.array(numpy_idx), q_arr[0])
                top_indices = np.argsort(scores)[::-1][:k]
                for idx in top_indices:
                    results.append({
                        "score": float(scores[idx]),
                        "metadata": self.metadata[idx]
                    })
        return results

    def save(self):
        os.makedirs(self.save_dir, exist_ok=True)
        metadata_path = os.path.join(self.save_dir, "metadata.json")
        with open(metadata_path, "w", encoding="utf-8") as f:
            json.dump(self.metadata, f, indent=2)
            
        if self.index:
            index_path = os.path.join(self.save_dir, "faiss.index")
            try:
                faiss.write_index(self.index, index_path)
            except Exception as e:
                print(f"❌ Failed to serialize FAISS index to disk: {e}")

    def load(self) -> bool:
        metadata_path = os.path.join(self.save_dir, "metadata.json")
        if not os.path.exists(metadata_path):
            return False
            
        with open(metadata_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)
            
        if self.index:
            index_path = os.path.join(self.save_dir, "faiss.index")
            if os.path.exists(index_path):
                try:
                    self.index = faiss.read_index(index_path)
                    return True
                except Exception as e:
                    print(f"❌ Failed to load FAISS index from disk: {e}")
        return len(self.metadata) > 0

faiss_store = FAISSVectorStore()
