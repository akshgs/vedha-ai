from functools import lru_cache

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings

from app.knowledge.chunker import chunk_documents
from app.knowledge.loader import load_knowledge_documents


# Lazy-loaded singletons
_embedding_model = None
_vector_store = None
_embedding_failed = False


def get_embedding_model():
    """
    Load the embedding model only once.
    It will be created the first time it is needed.
    """
    global _embedding_model, _embedding_failed
    if _embedding_failed:
        return None

    if _embedding_model is None:
        try:
            _embedding_model = HuggingFaceEmbeddings(
                model_name="BAAI/bge-small-en-v1.5",
            )
        except Exception as e:
            print(f"⚠️ Failed to load HuggingFaceEmbeddings ('BAAI/bge-small-en-v1.5'): {e}")
            _embedding_failed = True
            return None
    return _embedding_model


def get_vector_store():
    """
    Get or initialize the vector store lazy singleton.
    """
    global _vector_store
    if _vector_store is None:
        try:
            embedding_model = get_embedding_model()
            if embedding_model is None:
                print("⚠️ Embedding model is not available. Skipping vector store initialization.")
                return None
            _vector_store = build_vector_store(embedding_model)
        except Exception as e:
            print(f"⚠️ Failed to build vector store: {e}")
            return None
    return _vector_store


def build_vector_store(embedding_model):

    documents = load_knowledge_documents()

    chunks = chunk_documents(documents)

    docs = [
        Document(
            page_content=chunk["content"],
            metadata={
                "source": chunk["source"],
            },
        )
        for chunk in chunks
    ]

    return FAISS.from_documents(
        docs,
        embedding_model,
    )