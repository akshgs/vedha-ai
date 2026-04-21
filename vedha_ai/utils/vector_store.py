import faiss
import numpy as np
import os
import json
from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL = SentenceTransformer("all-MiniLM-L6-v2")

INDEX_PATH = "data/faiss.index"
DOCS_PATH  = "data/documents.json"

faiss_index = None
documents   = []

def save_to_disk():
    os.makedirs("data", exist_ok=True)
    faiss.write_index(faiss_index, INDEX_PATH)
    with open(DOCS_PATH, "w") as f:
        json.dump(documents, f)

def load_from_disk():
    global faiss_index, documents
    if not os.path.exists(INDEX_PATH) or not os.path.exists(DOCS_PATH):
        return False
    faiss_index = faiss.read_index(INDEX_PATH)
    with open(DOCS_PATH, "r") as f:
        documents = json.load(f)
    print(f"Loaded {len(documents)} documents from disk")
    return True

def build_index(docs):
    global faiss_index, documents
    embeddings  = EMBEDDING_MODEL.encode(docs)
    embeddings  = np.array(embeddings).astype("float32")
    dimension   = embeddings.shape[1]
    faiss_index = faiss.IndexFlatL2(dimension)
    faiss_index.add(embeddings)
    documents   = list(docs)
    save_to_disk()
    print(f"Built index with {len(docs)} documents")

def add_documents(new_docs):
    global faiss_index, documents
    if faiss_index is None:
        build_index(new_docs)
        return
    new_embeddings = EMBEDDING_MODEL.encode(new_docs)
    new_embeddings = np.array(new_embeddings).astype("float32")
    faiss_index.add(new_embeddings)
    documents.extend(new_docs)
    save_to_disk()
    print(f"Added {len(new_docs)} docs. Total: {len(documents)}")

def search(query, top_k=3):
    if faiss_index is None or len(documents) == 0:
        return []
    query_vector = EMBEDDING_MODEL.encode([query])
    query_vector = np.array(query_vector).astype("float32")
    k = min(top_k, len(documents))
    distances, indices = faiss_index.search(query_vector, k)
    results = []
    for idx in indices[0]:
        if 0 <= idx < len(documents):
            results.append(documents[idx])
    return results

def get_stats():
    return {
        "total_documents": len(documents),
        "index_ready":     faiss_index is not None,
        "index_size_kb":   round(os.path.getsize(INDEX_PATH) / 1024, 1)
                           if os.path.exists(INDEX_PATH) else 0
    }
