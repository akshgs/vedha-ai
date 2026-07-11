from functools import lru_cache

from app.knowledge.vector_store import build_vector_store


class KnowledgeService:
    """
    Shared Knowledge Service for Vedha AI.
    Vector store is created only once when first used.
    """

    def __init__(self):
        self.vector_store = None
        self.retriever = None

    def _initialize(self):

        if self.vector_store is None:

            self.vector_store = build_vector_store()

            self.retriever = (
                self.vector_store.as_retriever(
                    search_kwargs={
                        "k": 5,
                    }
                )
            )

    def retrieve(
        self,
        query: str,
    ):

        self._initialize()

        return self.retriever.invoke(query)


@lru_cache(maxsize=1)
def get_knowledge_service():

    return KnowledgeService()