from functools import lru_cache

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings

from app.knowledge.chunker import chunk_documents
from app.knowledge.loader import load_knowledge_documents


@lru_cache(maxsize=1)
def get_embedding_model():
    """
    Load the embedding model only once.
    It will be created the first time it is needed.
    """
    return HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en-v1.5",
    )


def build_vector_store():

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
        get_embedding_model(),
    )