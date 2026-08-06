from app.knowledge.vector_store import get_vector_store
from app.ai.vector_store.vector_store_adapter import FAISSVectorStoreAdapter
from app.ai.rag.rag_pipeline import RAGPipeline

_adapter = None
_pipeline = None


def get_rag_pipeline():
    """
    Lazily initialize and return the RAG pipeline.
    """
    global _adapter, _pipeline
    if _pipeline is None:
        try:
            vector_store = get_vector_store()
            if vector_store is None:
                print("⚠️ RAG Engine: Vector store is not available. RAG pipeline will be disabled.")
                return None
            _adapter = FAISSVectorStoreAdapter(vector_store)
            _pipeline = RAGPipeline(_adapter)
        except Exception as e:
            print(f"⚠️ Failed to initialize RAG pipeline: {e}")
            return None
    return _pipeline


def retrieve_context(query: str) -> str:
    """
    Retrieve relevant context from the FAISS vector database with Hybrid Search and citation formatting.
    """
    try:
        pipeline = get_rag_pipeline()
        if pipeline is None:
            return "RAG is temporarily unavailable: embedding model/vector store could not be initialized due to network issues or offline mode."
        return pipeline.retrieve_hybrid_context(query, k=4)
    except Exception as e:
        return f"Error retrieving context: {str(e)}"