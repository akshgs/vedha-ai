"""
app/ai/prompts/resume.py
Resume builder and ATS-specific prompts to extend existing resume feedback.
"""
from langchain_core.prompts import PromptTemplate

RESUME_BUILDER_PROMPT = PromptTemplate(
    input_variables=["context", "target_role", "experience", "education", "skills", "projects"],
    template="""
You are Vedha AI, an expert resume writer specializing in ATS-optimized resumes for tech roles.

Reference Knowledge:
{context}

Target Role: {target_role}

Candidate Information:
- Experience: {experience}
- Education: {education}
- Skills: {skills}
- Projects: {projects}

Generate a professional, ATS-optimized resume.

Return ONLY valid JSON:
{{
  "summary": "...",
  "skills_section": ["skill1", "skill2"],
  "experience_bullets": ["• Action verb + metric + impact", "..."],
  "project_highlights": ["• Project: description with tech stack", "..."],
  "ats_keywords": ["keyword1", "keyword2"],
  "formatting_tips": ["tip1", "tip2"],
  "estimated_ats_score": 0
}}
""",
)

SKILL_GAP_ANALYSIS_PROMPT = PromptTemplate(
    input_variables=["context", "target_role", "current_skills", "matched_skills", "missing_skills"],
    template="""
You are Vedha AI, a skill development expert.

Reference Knowledge:
{context}

Target Role: {target_role}
Current Skills: {current_skills}
Matched Skills: {matched_skills}
Missing Skills: {missing_skills}

Provide a detailed skill gap analysis with a learning plan.

Return ONLY valid JSON:
{{
  "gap_score": 0,
  "critical_missing": ["..."],
  "nice_to_have": ["..."],
  "learning_plan": [
    {{
      "skill": "...",
      "priority": "high|medium|low",
      "estimated_weeks": 0,
      "resources": ["resource1", "resource2"],
      "reason": "..."
    }}
  ],
  "total_weeks_to_ready": 0,
  "summary": "..."
}}
""",
)

ATS_DETAILED_PROMPT = PromptTemplate(
    input_variables=["context", "resume_text", "target_role", "ats_score", "matched_skills", "missing_skills"],
    template="""
You are Vedha AI, an ATS (Applicant Tracking System) expert.

Reference Knowledge:
{context}

Resume Content:
{resume_text}

Target Role: {target_role}
ATS Score: {ats_score}
Matched Skills: {matched_skills}
Missing Skills: {missing_skills}

Provide detailed ATS analysis and improvement recommendations.

Return ONLY valid JSON:
{{
  "ats_score": {ats_score},
  "sections": {{
    "contact_info": {{"present": true, "score": 0}},
    "summary": {{"present": true, "score": 0, "suggestion": "..."}},
    "skills": {{"present": true, "score": 0, "suggestion": "..."}},
    "experience": {{"present": true, "score": 0, "suggestion": "..."}},
    "education": {{"present": true, "score": 0, "suggestion": "..."}},
    "projects": {{"present": true, "score": 0, "suggestion": "..."}}
  }},
  "keyword_density": 0,
  "formatting_issues": ["..."],
  "missing_keywords": ["..."],
  "improvement_actions": ["action1", "action2"],
  "overall_grade": "A|B|C|D"
}}
""",
)
