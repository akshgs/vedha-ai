"""
app/ai/prompts/__init__.py
Re-exports existing prompts — imports from prompts_legacy.py.
"""
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

