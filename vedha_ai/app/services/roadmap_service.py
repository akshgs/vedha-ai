import json

from app.repositories.resume_repository import ResumeRepository
from app.repositories.roadmap_repository import (
    RoadmapRepository,
)
from app.utils.roadmap_loader import (
    get_roadmap_template,
)


class RoadmapService:

    def __init__(
        self,
        roadmap_repository: RoadmapRepository,
        resume_repository: ResumeRepository,
    ):
        self.roadmap_repository = roadmap_repository
        self.resume_repository = resume_repository

    def generate_roadmap(
        self,
        student_id: int,
    ):

        resume = (
            self.resume_repository.get_latest_by_student(
                student_id
            )
        )

        if resume is None:
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

        if roadmap is None:
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

        roadmap_data = {
            "student_id": student_id,
            "target_role": target_role,
            "completed_skills": completed_skills,
            "missing_skills": missing_skills,
            "completion": completion,
        }

        self.roadmap_repository.create_roadmap(
            student_id=student_id,
            target_role=target_role,
            roadmap_json=json.dumps(
                roadmap_data
            ),
        )

        return roadmap_data

    def get_latest_roadmap(
        self,
        student_id: int,
    ):

        roadmap = (
            self.roadmap_repository.get_latest_roadmap(
                student_id
            )
        )

        if roadmap is None:
            raise ValueError(
                "Roadmap not found."
            )

        return json.loads(
            roadmap.roadmap_json
        )

    def update_progress(
        self,
        roadmap_id: int,
        progress: float,
    ):

        roadmap = (
            self.roadmap_repository.update_progress(
                roadmap_id,
                progress,
            )
        )

        if roadmap is None:
            raise ValueError(
                "Roadmap not found."
            )

        return {
            "roadmap_id": roadmap.id,
            "progress": roadmap.progress,
        }