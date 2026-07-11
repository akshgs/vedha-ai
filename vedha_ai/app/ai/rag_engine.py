from app.knowledge.knowledge_service import (
    get_knowledge_service,
)


def retrieve_context(
    query: str,
) -> str:
    """
    Retrieve relevant context from the
    Vedha AI Knowledge Base.
    """

    knowledge_service = get_knowledge_service()

    documents = knowledge_service.retrieve(
        query
    )

    return "\n\n".join(
        doc.page_content
        for doc in documents
    )