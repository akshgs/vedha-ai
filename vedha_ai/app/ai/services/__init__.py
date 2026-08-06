"""
app/ai/services/__init__.py
Central exports for all AI services.
"""
from app.ai.services.coding_ai_service import (
    explain_code,
    optimize_code,
    debug_code,
    analyze_complexity,
    get_coding_hint,
    full_coding_assistant,
)
from app.ai.services.resume_ai_service import (
    build_resume,
    analyze_skill_gap,
    detailed_ats_analysis,
)
from app.ai.services.career_ai_service import (
    chat_with_career_mentor,
    predict_salary,
    predict_career_path,
    analyze_industry_trends,
    research_assistant,
    chat_with_pdf,
)

__all__ = [
    # Coding
    "explain_code",
    "optimize_code",
    "debug_code",
    "analyze_complexity",
    "get_coding_hint",
    "full_coding_assistant",
    # Resume
    "build_resume",
    "analyze_skill_gap",
    "detailed_ats_analysis",
    # Career
    "chat_with_career_mentor",
    "predict_salary",
    "predict_career_path",
    "analyze_industry_trends",
    "research_assistant",
    "chat_with_pdf",
]
