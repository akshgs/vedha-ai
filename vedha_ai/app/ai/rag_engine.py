from app.knowledge.knowledge_service import (
    knowledge_service,
)


def retrieve_context(
    query: str,
) -> str:
    """
    Retrieve relevant context from the
    Vedha AI Knowledge Base.
    """

    documents = knowledge_service.retrieve(
        query
    )

    return "\n\n".join(
        doc.page_content
        for doc in documents
    )