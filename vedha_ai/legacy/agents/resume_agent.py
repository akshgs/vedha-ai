from modules.resume_scanner import (
    extract_skills_nlp,
    calculate_role_match
)

class ResumeAgent:

    def analyze(self, resume_text, target_role):

        skills = extract_skills_nlp(resume_text)

        match_result = calculate_role_match(
            skills,
            target_role
        )

        return {
            "skills": skills,
            "match_result": match_result
        }