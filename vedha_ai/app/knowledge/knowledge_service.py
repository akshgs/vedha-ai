from app.knowledge.vector_store import (
    build_vector_store,
)


class KnowledgeService:
    """
    Shared Knowledge Service for Vedha AI.
    Builds the vector store once and
    provides a reusable retriever.
    """

    def __init__(self):

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
        return self.retriever.invoke(query)


knowledge_service = KnowledgeService()