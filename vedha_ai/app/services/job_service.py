import json

from app.ai.job_matcher import calculate_job_match
from app.ai.semantic_matcher import semantic_similarity
from app.repositories.job_repository import JobRepository
from app.ai.role_matcher import role_match_score

MIN_MATCH_PERCENT = 20

class JobService:

    def __init__(self, repository: JobRepository):
        self.repository = repository

    def recommend_jobs(
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

        jobs = self.repository.get_all_jobs()

        recommendations = []

        for job in jobs:

            job_skills = []

            if job.skills:
                try:
                    job_skills = json.loads(job.skills)
                except Exception:
                    job_skills = [
                        skill.strip()
                        for skill in job.skills.split(",")
                    ]

            result = calculate_job_match(
                resume_skills,
                job_skills,
            )

            semantic_score = semantic_similarity(
                resume_skills,
                job_skills,
            )

            role_score = role_match_score(
                target_role=target_role,
                job_title=job.title,
                description=job.description,
            )

            final_score = round(
                (result["match_percent"] * 0.4)
                + (semantic_score * 0.3)
                + (role_score * 0.3),
                1,
            )

            if final_score >= MIN_MATCH_PERCENT:

                recommendations.append(
                    {
                        "id": job.id,
                        "title": job.title,
                        "company": job.company,
                        "location": job.location,
                        "salary": job.salary,
                        "job_type": job.job_type,
                        "source": job.source,
                        "url": job.url,
                        "match_percent": final_score,
                        "exact_match_score": result["match_percent"],
                        "semantic_score": semantic_score,
                        "role_score": role_score,
                        "matched_skills": result["matched_skills"],
                    }
                )

        recommendations.sort(
            key=lambda job: job["match_percent"],
            reverse=True,
        )

        return {
            "student_id": student_id,
            "target_role": target_role,
            "recommended_jobs": recommendations[:10],
        }