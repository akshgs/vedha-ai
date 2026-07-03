from sentence_transformers import SentenceTransformer

# Load only once
embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)