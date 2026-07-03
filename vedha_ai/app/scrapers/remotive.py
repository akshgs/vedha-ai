import json
import requests

from app.nlp.job_skill_extractor import extract_job_skills
from app.utils.html_cleaner import clean_html

REMOTIVE_API = "https://remotive.com/api/remote-jobs"


def fetch_remotive_jobs(limit: int = 50) -> list[dict]:
    """
    Fetch jobs from Remotive API.
    Returns a normalized list of job dictionaries.
    """

    response = requests.get(
        REMOTIVE_API,
        timeout=20,
    )

    response.raise_for_status()

    jobs = response.json().get("jobs", [])

    normalized = []

    for job in jobs[:limit]:

        description = job.get("description", "")

        clean_description = clean_html(
            description
        )

        extracted_skills = extract_job_skills(
            clean_description
        )

        normalized.append(
            {
                "title": job.get("title", ""),
                "company": job.get("company_name", ""),
                "location": job.get(
                    "candidate_required_location",
                    "Remote",
                ),
                "description": clean_description,
                "skills": json.dumps(extracted_skills),
                "salary": job.get(
                    "salary",
                    "Not specified",
                ),
                "job_type": job.get(
                    "job_type",
                    "Full Time",
                ),
                "source": "Remotive",
                "url": job.get("url", ""),
            }
        )

    return normalized