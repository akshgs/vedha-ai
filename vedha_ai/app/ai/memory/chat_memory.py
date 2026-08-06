from app.ai.memory.session_memory import session_memory

class AIChatMemory:
    """Conversational memory broker for session persistence."""
    
    @staticmethod
    def get_context_history(user_id: int, context: str) -> str:
        """Formats and retrieves historical turns for a user context."""
        return session_memory.format_history_string(user_id, context=context)

    @staticmethod
    def commit_turn(user_id: int, user_message: str, assistant_response: str, context: str) -> None:
        """Commits user query and assistant response to session buffer."""
        session_memory.add_message(user_id, "user", user_message, context=context)
        session_memory.add_message(user_id, "assistant", assistant_response, context=context)
