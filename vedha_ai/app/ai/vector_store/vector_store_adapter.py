from abc import ABC, abstractmethod

class BaseVectorStoreAdapter(ABC):
    """Abstract interface to ensure swappable vector database backing stores."""
    
    @abstractmethod
    def search(self, query: str, k: int = 4) -> list[dict]:
        """Performs semantic search query returning documents with metadata."""
        pass

class FAISSVectorStoreAdapter(BaseVectorStoreAdapter):
    """Concrete FAISS vector database store adapter wrapper."""
    
    def __init__(self, store):
        self.store = store

    def search(self, query: str, k: int = 4) -> list[dict]:
        docs = self.store.similarity_search(query, k=k)
        return [
            {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in docs
        ]
