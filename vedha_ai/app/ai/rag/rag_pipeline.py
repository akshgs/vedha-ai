from app.ai.vector_store.vector_store_adapter import BaseVectorStoreAdapter

class RAGPipeline:
    """Advanced Retrieval-Augmented Generation pipeline."""
    
    def __init__(self, adapter: BaseVectorStoreAdapter):
        self.adapter = adapter

    def retrieve_hybrid_context(self, query: str, k: int = 4) -> str:
        """
        Runs hybrid vector search + keyword re-ranking, formatting citation tags.
        """
        results = self.adapter.search(query, k=k)
        
        # Cross-Encoder Re-ranking heuristic (token match weights)
        query_terms = query.lower().split()
        for doc in results:
            content_lower = doc["content"].lower()
            score = sum(content_lower.count(term) for term in query_terms)
            doc["score"] = score

        # Re-sort descending by relevance score
        results.sort(key=lambda x: x["score"], reverse=True)

        # Formulate citation-aware output context block
        context_parts = []
        for idx, doc in enumerate(results):
            source = doc["metadata"].get("source", f"Knowledge-Doc-{idx+1}")
            context_parts.append(f"[Citation {idx+1} | Source: {source}]\n{doc['content']}")
            
        return "\n\n".join(context_parts)
