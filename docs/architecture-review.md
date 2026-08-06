# Architecture Review & AI Centralization - Phase 10

This review verifies Clean Architecture boundaries and centralizes AI capabilities within the repository.

---

## 1. Clean Architecture Enforcement

We enforce strict separation of concerns, routing logic downwards through the application layers:

```
[API Routing Layer] (FastAPI Routers: auth.py, problems.py, recruitment.py, etc.)
        ↓
[Business Service Layer] (AuthService, CompilerService, CourseService, etc.)
        ↓
[Data Access Repository Layer] (ProblemRepository, RecruitmentRepository, etc.)
        ↓
[Database Model / Engine Layer] (SQLAlchemy Engine, PostgreSQL, SQLite)
```

- **Rule 1 (Downwards Dependency):** High-level layers never depend on low-level implementation details. API routes never run raw database queries; they delegate execution to Services or Repositories.
- **Rule 2 (No Duplicated Logic):** Entities share common attributes. For instance, the recruitment module references the existing `CompanyJob` and `User` schemas instead of duplicating tables.

---

## 2. Centralized AI Engine Design

All artificial intelligence operations are unified under the dedicated `app/ai` package, isolating prompts, langchain chains, and model wrappers. No AI logic or prompts reside inside API routes.

```
app/ai/
 ├── services/
 │    ├── career_ai_service.py   # Mentor Chat, PDF Chat, Salary, Path Predictions
 │    ├── coding_ai_service.py   # Explain Code, Complexity, Debug Hints, Optimization
 │    └── resume_ai_service.py   # ATS Scoring Checklists, Skill Gaps Analyses
 ├── prompts/
 │    ├── career.py              # Mentorship prompt templates
 │    ├── coding.py              # Coding assistance prompt templates
 │    └── resume.py              # ATS validation prompt templates
 ├── engine.py                   # ChatGroq LLM initialization
 └── prompts_legacy.py           # Re-exported prompts for legacy modules compat
```

### Verified AI Capabilities:
1. **Resume Analyzer & ATS:** Handled via `resume_ai_service.py` (`build_resume`, `detailed_ats_analysis`).
2. **Skill Gap Calculator:** Handled via `resume_ai_service.py` (`analyze_skill_gap`).
3. **Coding Assistant:** Handled via `coding_ai_service.py` (`full_coding_assistant`, `explain_code`, `optimize_code`, `debug_code`).
4. **Mock Interview:** Routes technical assessments via `app/services/interview_service.py`, using RAG vectors from `app/ai/rag_engine.py` to evaluate responses.
5. **PDF Chat & Research:** Consumed via `career_ai_service.py` (`chat_with_pdf`, `research_assistant`).
6. **Career & Salary Predictor:** Evaluated via `career_ai_service.py` (`predict_salary`, `predict_career_path`).
