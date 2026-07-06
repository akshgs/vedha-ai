from pathlib import Path


KNOWLEDGE_PATH = Path(__file__).parent


def load_knowledge_documents():
    """
    Load every markdown document inside app/knowledge.
    """

    documents = []

    for file in KNOWLEDGE_PATH.rglob("*.md"):

        try:

            content = file.read_text(
                encoding="utf-8"
            )

            documents.append(
                {
                    "source": str(
                        file.relative_to(
                            KNOWLEDGE_PATH
                        )
                    ),
                    "content": content,
                }
            )

        except Exception as e:

            print(
                f"Error loading {file}: {e}"
            )

    return documents