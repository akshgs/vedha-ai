import json

from app.repositories.roadmap_repository import (
    RoadmapRepository,
)
from app.utils.roadmap_loader import (
    get_roadmap_template,
)


class RoadmapService:

    def __init__(
        self,
        repository: RoadmapRepository,
    ):
        self.repository = repository

    def generate_roadmap(
        self,
        student_id: int,
    ):

        resume = self.repository.get_latest_resume(
            student_id
        )

        if not resume:
            raise ValueError(
                "Resume analysis not found."
            )

        resume_skills = json.loads(
            resume.matched_skills
        )

        target_role = resume.target_role

        roadmap = get_roadmap_template(
            target_role
        )

        if not roadmap:
            raise ValueError(
                "Roadmap template not found."
            )

        required_skills = roadmap[
            "required_skills"
        ]

        completed_skills = []

        missing_skills = []

        resume_skill_set = {
            skill.lower()
            for skill in resume_skills
        }

        for skill in required_skills:

            if skill.lower() in resume_skill_set:
                completed_skills.append(skill)
            else:
                missing_skills.append(skill)

        completion = round(
            (
                len(completed_skills)
                / len(required_skills)
            )
            * 100,
            1,
        )

        return {
            "student_id": student_id,
            "target_role": target_role,
            "completed_skills": completed_skills,
            "missing_skills": missing_skills,
            "completion": completion,
        }