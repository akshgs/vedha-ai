"""
app/schemas/ai.py
Pydantic v2 schemas for all AI API endpoints.
Covers: Career Mentor, Salary, Career Path, Trends,
        Resume Builder, Skill Gap, ATS,
        Coding Assistant, Research, PDF Chat.
"""
from typing import Any
from pydantic import BaseModel, Field


# ──────────────────────────────────────────────
# Career Mentor
# ──────────────────────────────────────────────

class CareerMentorRequest(BaseModel):
    message: str = Field(min_length=2, max_length=2000)
    current_role: str = Field(default="Student", max_length=100)
    target_role: str = Field(default="Software Engineer", max_length=100)
    skills: list[str] = Field(default=[])

class CareerMentorResponse(BaseModel):
    reply: str
    session_active: bool
    status: str

class ClearChatRequest(BaseModel):
    context: str = Field(default="career", max_length=50)


# ──────────────────────────────────────────────
# Salary Prediction
# ──────────────────────────────────────────────

class SalaryPredictionRequest(BaseModel):
    role: str = Field(min_length=2, max_length=100)
    skills: list[str] = Field(default=[])
    experience_years: int = Field(default=0, ge=0, le=50)
    location: str = Field(default="India", max_length=100)

class SalaryRangeItem(BaseModel):
    min: float
    max: float
    currency: str = "INR"
    period: str = "annual"

class SalaryPredictionResponse(BaseModel):
    role: str
    location: str
    predicted_lpa: float | None = None
    entry_level: SalaryRangeItem | None = None
    mid_level: SalaryRangeItem | None = None
    senior_level: SalaryRangeItem | None = None
    growth_trajectory: str | None = None
    top_paying_companies: list[str] = []
    reasoning: str | None = None
    status: str


# ──────────────────────────────────────────────
# Career Path Prediction
# ──────────────────────────────────────────────

class CareerPathRequest(BaseModel):
    current_role: str = Field(default="Student", max_length=100)
    experience_years: int = Field(default=0, ge=0, le=50)
    skills: list[str] = Field(default=[])
    interests: list[str] = Field(default=[])

class PredictedRole(BaseModel):
    role: str
    timeline: str
    probability: float = Field(..., ge=0.0, le=1.0)
    required_skills: list[str]

class CareerPathResponse(BaseModel):
    predicted_roles: list[PredictedRole] = []
    recommended_path: str | None = None
    skill_investments: list[str] = []
    market_demand: str | None = None
    growth_probability: float | None = Field(default=None, ge=0.0, le=1.0)
    industry_outlook: str | None = None
    action_plan: list[str] = []
    status: str


# ──────────────────────────────────────────────
# Industry Trends
# ──────────────────────────────────────────────

class TrendsRequest(BaseModel):
    domain: str = Field(min_length=2, max_length=100)
    skills: list[str] = Field(default=[])

class TrendsResponse(BaseModel):
    trending_skills: list[str] = []
    declining_skills: list[str] = []
    emerging_technologies: list[str] = []
    top_companies_hiring: list[str] = []
    average_salary_trend: str | None = None
    demand_index: int | None = None
    supply_index: int | None = None
    outlook: str | None = None
    key_insights: list[str] = []
    status: str


# ──────────────────────────────────────────────
# Resume Builder
# ──────────────────────────────────────────────

class ResumeBuilderRequest(BaseModel):
    target_role: str = Field(min_length=2, max_length=100)
    experience: str = Field(min_length=10, max_length=5000)
    education: str = Field(min_length=10, max_length=2000)
    skills: list[str] = Field(min_length=1)
    projects: list[str] = Field(default=[])

class ResumeBuilderResponse(BaseModel):
    target_role: str
    summary: str | None = None
    skills_section: list[str] = []
    experience_bullets: list[str] = []
    project_highlights: list[str] = []
    ats_keywords: list[str] = []
    formatting_tips: list[str] = []
    estimated_ats_score: int | None = None
    status: str


# ──────────────────────────────────────────────
# Skill Gap Analysis
# ──────────────────────────────────────────────

class SkillGapRequest(BaseModel):
    target_role: str = Field(min_length=2, max_length=100)
    current_skills: list[str] = Field(default=[])
    matched_skills: list[str] = Field(default=[])
    missing_skills: list[str] = Field(default=[])

class LearningPlanItem(BaseModel):
    skill: str
    priority: str
    estimated_weeks: int
    resources: list[str]
    reason: str

class SkillGapResponse(BaseModel):
    target_role: str
    gap_score: int | None = None
    critical_missing: list[str] = []
    nice_to_have: list[str] = []
    learning_plan: list[LearningPlanItem] = []
    total_weeks_to_ready: int | None = None
    summary: str | None = None
    status: str


# ──────────────────────────────────────────────
# ATS Analysis
# ──────────────────────────────────────────────

class ATSAnalysisRequest(BaseModel):
    resume_text: str = Field(min_length=100, max_length=20000)
    target_role: str = Field(min_length=2, max_length=100)
    ats_score: int = Field(ge=0, le=100)
    matched_skills: list[str] = Field(default=[])
    missing_skills: list[str] = Field(default=[])

class ATSAnalysisResponse(BaseModel):
    ats_score: int
    sections: dict[str, Any] = {}
    keyword_density: float | None = None
    formatting_issues: list[str] = []
    missing_keywords: list[str] = []
    improvement_actions: list[str] = []
    overall_grade: str | None = None
    status: str


# ──────────────────────────────────────────────
# Coding Assistant
# ──────────────────────────────────────────────

class CodeExplainRequest(BaseModel):
    code: str = Field(min_length=1, max_length=10000)
    language: str = Field(default="python", max_length=30)

class CodeOptimizeRequest(BaseModel):
    code: str = Field(min_length=1, max_length=10000)
    language: str = Field(default="python", max_length=30)

class CodeDebugRequest(BaseModel):
    code: str = Field(min_length=1, max_length=10000)
    error: str = Field(min_length=1, max_length=2000)
    language: str = Field(default="python", max_length=30)

class BigORequest(BaseModel):
    code: str = Field(min_length=1, max_length=10000)
    language: str = Field(default="python", max_length=30)

class CodingHintRequest(BaseModel):
    problem_title: str = Field(min_length=2, max_length=200)
    problem_desc: str = Field(min_length=10, max_length=5000)
    current_code: str = Field(default="", max_length=10000)
    language: str = Field(default="python", max_length=30)

class CodingAssistantRequest(BaseModel):
    code: str = Field(min_length=1, max_length=10000)
    problem_id: int = Field(ge=1)
    language: str = Field(default="python", max_length=30)
    error_log: str | None = Field(default=None, max_length=2000)

class CodingAssistantResponse(BaseModel):
    time_complexity: str | None = None
    space_complexity: str | None = None
    explanation: str | None = None
    debug_hint: str | None = None
    suggested_fix: str | None = None
    status: str


# ──────────────────────────────────────────────
# Research Assistant
# ──────────────────────────────────────────────

class ResearchRequest(BaseModel):
    query: str = Field(min_length=5, max_length=1000)

class ResearchResponse(BaseModel):
    query: str
    answer: str
    sources: list[str] = []
    status: str


# ──────────────────────────────────────────────
# PDF Chat
# ──────────────────────────────────────────────

class PDFChatRequest(BaseModel):
    question: str = Field(min_length=5, max_length=1000)
    session_id: str = Field(default="pdf", max_length=100)

class PDFChatResponse(BaseModel):
    question: str
    answer: str
    session_id: str
    status: str
