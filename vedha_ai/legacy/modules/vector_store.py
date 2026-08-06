import os
import chromadb
from sentence_transformers import SentenceTransformer, CrossEncoder
from dotenv import load_dotenv

load_dotenv()

CHROMA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'chromadb')
client = chromadb.PersistentClient(path=CHROMA_PATH)

# Bi-encoder → fast retrieval
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Cross-encoder → accurate re-ranking
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

career_collection = client.get_or_create_collection(
    name="career_knowledge",
    metadata={"hnsw:space": "cosine"}
)

def rewrite_query(query: str) -> list[str]:
    """Query-യെ multiple versions ആക്കുന്നു — better recall"""
    q = query.lower().strip()
    variants = [q]

    expansions = {
        "ml engineer": "machine learning engineer skills roadmap",
        "data scientist": "data science career path python",
        "ai engineer": "artificial intelligence engineer skills",
        "resume": "resume tips skills job application",
        "interview": "technical interview preparation questions",
        "roadmap": "career roadmap learning path steps",
        "salary": "salary package lpa fresher india",
    }

    for keyword, expansion in expansions.items():
        if keyword in q:
            variants.append(expansion)
            break

    return variants

def add_documents(texts: list[str], metadatas: list[dict] = None, collection=career_collection):
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
    """
    Advanced RAG Search:
    1. Query rewriting → multiple variants
    2. Retrieve top-10 candidates
    3. Re-rank with CrossEncoder
    4. Return top n_results
    """

    # Step 1: Query rewriting
    query_variants = rewrite_query(query)

    # Step 2: Retrieve candidates (more than needed)
    candidate_docs = []
    seen = set()

    for variant in query_variants:
        query_embedding = embedder.encode([variant]).tolist()
        kwargs = {
            "query_embeddings": query_embedding,
            "n_results": min(10, collection.count() or 1),
            "include": ["documents", "distances"]
        }
        if filters:
            kwargs["where"] = filters

        results = collection.query(**kwargs)
        docs = results["documents"][0] if results["documents"] else []

        for doc in docs:
            if doc not in seen:
                candidate_docs.append(doc)
                seen.add(doc)

    if not candidate_docs:
        return []

    # Step 3: Re-rank with CrossEncoder
    pairs = [[query, doc] for doc in candidate_docs]
    scores = reranker.predict(pairs)

    # Step 4: Sort by score, return top n_results
    ranked = sorted(zip(scores, candidate_docs), reverse=True)
    top_docs = [doc for _, doc in ranked[:n_results]]

    return top_docs

def get_collection_count(collection=career_collection):
    return collection.count()