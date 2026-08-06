class XAIExplainer:
    """Helper class tracking and appending explainability rationale metadata."""
    
    @staticmethod
    def get_rationale(feature_name: str, parameters: dict, confidence: float = 0.95) -> dict:
        """Returns explainability block detailing why/how predictions were computed."""
        return {
            "xai": {
                "feature": feature_name,
                "confidence_interval": confidence,
                "input_weights": list(parameters.keys()),
                "method": "Chain-of-Thought (CoT) prompting with vector retrieval context anchoring."
            }
        }
