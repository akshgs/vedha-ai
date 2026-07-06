from sentence_transformers import SentenceTransformer


MODEL_NAME = "BAAI/bge-small-en-v1.5"

embedding_model = SentenceTransformer(
    MODEL_NAME
)


def get_embeddings(texts: list[str]):
    """
    Generate embeddings for a list of texts.
    """
    return embedding_model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True,
    )