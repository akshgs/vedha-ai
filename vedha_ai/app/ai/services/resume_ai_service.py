"""
app/ai/services/resume_ai_service.py
Centralized Resume AI Service.

Capabilities:
- Resume Builder (AI-generated sections)
- Skill Gap Analysis (detailed with learning plan)
- ATS Detailed Analysis (section-by-section)

REUSES (no duplication):
- app/ai/ats_score.py (calculate_ats_score)
- app/ai/resume_feedback.py (generate_feedback)
- app/ai/skill_matcher.py (calculate_role_match)
- app/nlp/skill_extractor.py (extract_skills)
- app/knowledge/ (RAG retrieval via rag_engine)
- app/ai/prompts/resume.py (structured prompts)
"""
from langchain_core.output_parsers import StrOutputParser

from app.ai.engine import get_llm
from app.ai.rag_engine import retrieve_context
from app.ai.utils.json_parser import safe_extract_json
from app.ai.prompts.resume import (
    RESUME_BUILDER_PROMPT,
    SKILL_GAP_ANALYSIS_PROMPT,
    ATS_DETAILED_PROMPT,
)

_str_parser = StrOutputParser()


class LazyChain:
    def __init__(self, prompt, temperature, model="llama-3.3-70b-versatile"):
        self.prompt = prompt
        self.temperature = temperature
        self.model = model
        self._chain = None

    @property
    def chain(self):
        if self._chain is None:
            llm = get_llm(model=self.model, temperature=self.temperature)
            self._chain = self.prompt | llm | _str_parser
        return self._chain

    def invoke(self, *args, **kwargs):
        return self.chain.invoke(*args, **kwargs)

    async def ainvoke(self, *args, **kwargs):
        return await self.chain.ainvoke(*args, **kwargs)


_builder_chain = LazyChain(RESUME_BUILDER_PROMPT, 0.2)
_skill_gap_chain = LazyChain(SKILL_GAP_ANALYSIS_PROMPT, 0.2)
_ats_chain = LazyChain(ATS_DETAILED_PROMPT, 0.2)




async def build_resume(
    target_role: str,
    experience: str,
    education: str,
    skills: list[str],
    projects: list[str],
) -> dict:
    """
    AI-powered resume builder. Returns structured resume content
    optimized for ATS and the target role.
    """
    try:
        context = retrieve_context(f"{target_role} ATS optimized resume template")
        raw = await _builder_chain.ainvoke({
            "context": context,
            "target_role": target_role,
            "experience": experience,
            "education": education,
            "skills": ", ".join(skills),
            "projects": "\n".join(projects),
        })
        result = safe_extract_json(raw, fallback={})
        result.setdefault("target_role", target_role)
        result.setdefault("status", "success")
        return result
    except Exception as e:
        return {
            "summary": f"Experienced professional targeting {target_role} role.",
            "skills_section": skills,
            "experience_bullets": [],
            "project_highlights": [],
            "ats_keywords": skills[:10],
            "formatting_tips": ["Use bullet points", "Quantify achievements"],
            "estimated_ats_score": 70,
            "status": "fallback",
            "error": str(e),
        }


async def analyze_skill_gap(
    target_role: str,
    current_skills: list[str],
    matched_skills: list[str],
    missing_skills: list[str],
) -> dict:
    """
    Detailed skill gap analysis with prioritized learning plan.
    Extends existing basic skill matching with actionable roadmap.
    """
    try:
        context = retrieve_context(f"{target_role} skill requirements learning resources")
        raw = await _skill_gap_chain.ainvoke({
            "context": context,
            "target_role": target_role,
            "current_skills": ", ".join(current_skills),
            "matched_skills": ", ".join(matched_skills),
            "missing_skills": ", ".join(missing_skills),
        })
        result = safe_extract_json(raw, fallback={})
        result.setdefault("status", "success")
        result.setdefault("target_role", target_role)
        return result
    except Exception as e:
        return {
            "gap_score": len(missing_skills),
            "critical_missing": missing_skills[:3],
            "nice_to_have": missing_skills[3:],
            "learning_plan": [
                {
                    "skill": skill,
                    "priority": "high" if i < 3 else "medium",
                    "estimated_weeks": 4,
                    "resources": [f"Search: '{skill} tutorial'"],
                    "reason": f"Required for {target_role}",
                }
                for i, skill in enumerate(missing_skills[:6])
            ],
            "total_weeks_to_ready": len(missing_skills) * 3,
            "summary": f"You need {len(missing_skills)} skills to be job-ready for {target_role}.",
            "status": "fallback",
            "error": str(e),
        }


async def detailed_ats_analysis(
    resume_text: str,
    target_role: str,
    ats_score: int,
    matched_skills: list[str],
    missing_skills: list[str],
) -> dict:
    """
    Section-by-section ATS analysis with improvement actions.
    Extends the existing calculate_ats_score() with LLM-powered insights.
    """
    try:
        context = retrieve_context(f"{target_role} ATS optimization resume tips")
        raw = await _ats_chain.ainvoke({
            "context": context,
            "resume_text": resume_text[:3000],  # Truncate for token budget
            "target_role": target_role,
            "ats_score": ats_score,
            "matched_skills": ", ".join(matched_skills),
            "missing_skills": ", ".join(missing_skills),
        })
        result = safe_extract_json(raw, fallback={})
        result.setdefault("ats_score", ats_score)
        result.setdefault("status", "success")
        return result
    except Exception as e:
        return {
            "ats_score": ats_score,
            "sections": {},
            "keyword_density": 0,
            "formatting_issues": [],
            "missing_keywords": missing_skills,
            "improvement_actions": [
                "Add more quantifiable metrics to experience",
                f"Include keywords: {', '.join(missing_skills[:5])}",
            ],
            "overall_grade": "B" if ats_score >= 70 else "C",
            "status": "fallback",
            "error": str(e),
        }
