import json
from unittest import result

from app.ai.job_matcher import calculate_job_match
from app.ai.semantic_matcher import semantic_similarity
from app.repositories.job_repository import JobRepository


MIN_MATCH_PERCENT = 20


class JobService:

    def __init__(self, repository: JobRepository):
        self.repository = repository

    def recommend_jobs(
        self,
        student_id: int,
    ):

        resume_skills = self.repository.get_resume_skills(
            student_id
        )

        if not resume_skills:
            raise ValueError(
                "Resume analysis not found."
            )

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
            final_score = round((result["match_percent"] * 0.6)
                                + (semantic_score * 0.4),
                                1,
                        )
            print("=" * 60)
            print("Job:", job.title)
            print("Resume Skills:", resume_skills)
            print("Job Skills:", job_skills)
            print("Exact Score:", result["match_percent"])
            print("Semantic Score:", semantic_score)
            print("Final Score:", final_score)
            print("=" * 60)

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
                        "matched_skills": result["matched_skills"],
                    }
                )

        recommendations.sort(
            key=lambda job: job["match_percent"],
            reverse=True,
        )

        return {
            "student_id": student_id,
            "recommended_jobs": recommendations[:10],
        }