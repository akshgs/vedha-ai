from modules.skill_gap import (
    ROLE_SKILLS,
    calculate_score,
    get_learning_resources
)

class CareerAgent:

    def analyze(self, skills, target_role):

        required_skills = ROLE_SKILLS.get(
            target_role,
            []
        )

        user_lower = [
            s.lower() for s in skills
        ]

        missing_skills = [
            s for s in required_skills
            if s.lower() not in user_lower
        ]

        matched_skills = [
            s for s in required_skills
            if s.lower() in user_lower
        ]

        score = calculate_score(
            skills,
            required_skills
        )

        resources = get_learning_resources(
            missing_skills
        )

        return {
            "score": score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "resources": resources
        }