import json

from app.repositories.resume_repository import ResumeRepository
from app.repositories.roadmap_repository import (
    RoadmapRepository,
)
from app.utils.roadmap_loader import (
    get_roadmap_template,
)


def normalize_skill(skill: str) -> str:
    import re
    cleaned = re.sub(r'[^a-zA-Z0-9\s+#]', ' ', skill)
    return " ".join(cleaned.lower().split())


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
            target_role = "Full Stack Developer"
            resume_skills = []
        else:
            target_role = resume.target_role or "Full Stack Developer"
            try:
                resume_skills = json.loads(resume.matched_skills) if resume.matched_skills else []
            except Exception:
                resume_skills = []

        roadmap = get_roadmap_template(
            target_role
        )

        required_skills = roadmap[
            "required_skills"
        ]

        completed_skills = []
        missing_skills = []

        resume_skill_set = {
            normalize_skill(skill)
            for skill in resume_skills
        }

        for skill in required_skills:
            if normalize_skill(skill) in resume_skill_set:
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
            progress=completion,
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