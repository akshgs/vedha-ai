from langchain_text_splitters import RecursiveCharacterTextSplitter


splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=150,
)


def chunk_documents(
    documents: list[dict],
):
    """
    Split markdown documents into smaller chunks.
    """

    chunks = []

    for document in documents:

        texts = splitter.split_text(
            document["content"]
        )

        for text in texts:

            chunks.append(
                {
                    "source": document["source"],
                    "content": text,
                }
            )

    return chunks