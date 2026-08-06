"""
app/ai/prompts_compat.py
Compatibility shim — re-exports all prompts from the original prompts.py.
This avoids the circular import that occurs when app/ai/prompts/ (package)
tries to import from app.ai.prompts (module with the same name).
"""
# pylint: disable=wildcard-import
from app.ai.prompts_legacy import (
    RESUME_FEEDBACK_PROMPT,
    INTERVIEW_EVALUATION_PROMPT,
    CAREER_CHAT_PROMPT,
    INTERVIEW_GENERATION_PROMPT,
    INTERVIEW_REPORT_PROMPT,
)

__all__ = [
    "RESUME_FEEDBACK_PROMPT",
    "INTERVIEW_EVALUATION_PROMPT",
    "CAREER_CHAT_PROMPT",
    "INTERVIEW_GENERATION_PROMPT",
    "INTERVIEW_REPORT_PROMPT",
]
