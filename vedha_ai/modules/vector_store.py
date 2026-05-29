# modules/vector_store.py — ChromaDB (replaces FAISS)
import os
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

# ChromaDB persistent client
CHROMA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'chromadb')
client = chromadb.PersistentClient(path=CHROMA_PATH)

# Embedding model
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Collections (like tables in ChromaDB)
career_collection = client.get_or_create_collection(
    name="career_knowledge",
    metadata={"hnsw:space": "cosine"}
)

def add_documents(texts: list[str], metadatas: list[dict] = None, collection=career_collection):
    """Documents add ചെയ്യൂ"""
    embeddings = embedder.encode(texts).tolist()
    ids = [f"doc_{i}_{hash(t) % 100000}" for i, t in enumerate(texts)]
    metadatas = metadatas or [{}] * len(texts)
    collection.add(
        embeddings=embeddings,
        documents=texts,
        metadatas=metadatas,
        ids=ids
    )
    print(f"✅ {len(texts)} documents added to ChromaDB")

def search(query: str, n_results: int = 3, collection=career_collection, filters: dict = None):
    """Query-നു relevant documents കണ്ടെത്തൂ"""
    query_embedding = embedder.encode([query]).tolist()
    kwargs = {
        "query_embeddings": query_embedding,
        "n_results": n_results,
        "include": ["documents", "metadatas", "distances"]
    }
    if filters:
        kwargs["where"] = filters
    results = collection.query(**kwargs)
    return results["documents"][0] if results["documents"] else []

def get_collection_count(collection=career_collection):
    return collection.count()