from langchain_huggingface import HuggingFaceEmbeddings

class EmbeddingFactory:
    """Centralized factory for Text Embeddings extraction."""
    
    @staticmethod
    def get_embedding_model(model_name: str = "BAAI/bge-small-en-v1.5"):
        """Loads and caches the target embedding transformer model."""
        return HuggingFaceEmbeddings(
            model_name=model_name,
        )
