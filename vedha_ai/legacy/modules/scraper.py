import os
import json
from datetime import datetime
from typing import List, Dict
from bs4 import BeautifulSoup
import httpx
from sqlalchemy import text, Column, Integer, String, Text, DateTime
from utils.db import Base, engine, get_connection
from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv()
router = APIRouter()

# ═══════════════════════════════════════════════
# DATABASE TABLE FOR JOBS
# ═══════════════════════════════════════════════

class JobListing(Base):
    __tablename__ = "job_listings"
    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String(200))
    company    = Column(String(200))
    location   = Column(String(200))
    skills     = Column(Text, default="[]")
    salary     = Column(String(100))
    job_type   = Column(String(50))
    source     = Column(String(100))
    url        = Column(String(500))
    scraped_at = Column(DateTime, default=datetime.utcnow)

def init_jobs_table():
    Base.metadata.create_all(bind=engine)
    print("✅ job_listings table ready!")

# ═══════════════════════════════════════════════
# GITHUB SCRAPER
# ═══════════════════════════════════════════════

async def scrape_github_trending() -> List[Dict]:
    jobs = []
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            headers = {"Accept": "application/json"}
            if os.getenv("GITHUB_TOKEN"):
                headers["Authorization"] = f"token {os.getenv('GITHUB_TOKEN')}"

            queries = ["machine+learning+kerala", "python+fastapi"]
            for query in queries:
                resp = await client.get(
                    f"https://api.github.com/search/repositories"
                    f"?q={query}&sort=stars&order=desc&per_page=5",
                    headers=headers
                )
                if resp.status_code == 200:
                    data = resp.json()
                    for repo in data.get("items", []):
                        jobs.append({
                            "title":    f"Open Source: {repo['name']}",
                            "company":  repo.get("owner", {}).get("login", "GitHub"),
                            "location": "Remote",
                            "skills":   json.dumps([repo.get("language", "Python")]),
                            "salary":   "Open Source",
                            "job_type": "opensource",
                            "source":   "github",
                            "url":      repo.get("html_url", "")
                        })
    except Exception as e:
        print(f"GitHub scrape error: {e}")
    return jobs

# ═══════════════════════════════════════════════
# REMOTIVE API
# ═══════════════════════════════════════════════

async def scrape_remotive_jobs() -> List[Dict]:
    jobs = []
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            categories = ["software-dev", "data", "devops-sysadmin"]
            for cat in categories:
                resp = await client.get(
                    f"https://remotive.com/api/remote-jobs?category={cat}&limit=5"
                )
                if resp.status_code == 200:
                    data = resp.json()
                    for job in data.get("jobs", []):
                        tags   = job.get("tags", [])
                        skills = json.dumps(tags[:5] if tags else ["Python"])
                        jobs.append({
                            "title":    job.get("title", ""),
                            "company":  job.get("company_name", ""),
                            "location": job.get("candidate_required_location", "Remote"),
                            "skills":   skills,
                            "salary":   job.get("salary", "Not specified"),
                            "job_type": "fulltime",
                            "source":   "remotive",
                            "url":      job.get("url", "")
                        })
    except Exception as e:
        print(f"Remotive scrape error: {e}")
    return jobs

# ═══════════════════════════════════════════════
# TECHNOPARK SCRAPER (httpx — no Playwright)
# ═══════════════════════════════════════════════

async def scrape_technopark_jobs() -> List[Dict]:
    """Scrape Technopark Kerala job listings using httpx"""
    jobs = []
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                "https://technopark.org/jobs",
                headers={"User-Agent": "Mozilla/5.0"}
            )
            soup = BeautifulSoup(resp.text, "html.parser")
            job_cards = (
                soup.find_all("div", class_="job-listing") or
                soup.find_all("div", class_="job-card") or
                soup.find_all("article")
            )
            for card in job_cards[:10]:
                title = card.find(["h2", "h3", "h4"])
                link  = card.find("a")
                if title:
                    jobs.append({
                        "title":    title.get_text(strip=True),
                        "company":  "Technopark Company",
                        "location": "Trivandrum, Kerala",
                        "skills":   json.dumps(["Python", "IT"]),
                        "salary":   "As per industry",
                        "job_type": "fulltime",
                        "source":   "technopark",
                        "url":      link.get("href", "https://technopark.org/jobs") if link else ""
                    })
    except Exception as e:
        print(f"Technopark scrape error: {e}")
    return jobs

def get_latest_resume(student_id):
    session = get_connection()

    try:
        result = session.execute(
            text("""
                SELECT *
                FROM resume_analysis
                WHERE student_id = :id
                ORDER BY id DESC
                LIMIT 1
            """),
            {"id": student_id}
        ).fetchone()

        return result

    finally:
        session.close()

# ═══════════════════════════════════════════════
# SAVE TO DATABASE
# ═══════════════════════════════════════════════

def save_jobs(jobs: List[Dict]) -> int:
    if not jobs:
        return 0
    session = get_connection()
    saved   = 0
    try:
        for job in jobs:
            existing = session.execute(
                text("SELECT id FROM job_listings WHERE url = :url AND title = :title"),
                {"url": job.get("url", ""), "title": job.get("title", "")}
            ).fetchone()
            if not existing:
                session.execute(text("""
                    INSERT INTO job_listings
                    (title, company, location, skills, salary, job_type, source, url, scraped_at)
                    VALUES (:title, :company, :location, :skills, :salary,
                            :job_type, :source, :url, :scraped_at)
                """), {**job, "scraped_at": datetime.utcnow()})
                saved += 1
        session.commit()
    finally:
        session.close()
    return saved

# ═══════════════════════════════════════════════
# MAIN SCRAPE FUNCTION
# ═══════════════════════════════════════════════

async def run_all_scrapers() -> Dict:

    print("🔍 Starting job scrapers...")

    init_jobs_table()

    remotive_jobs = await scrape_remotive_jobs()
    technopark_jobs = await scrape_technopark_jobs()

    all_jobs = (
        remotive_jobs +
        technopark_jobs
    )

    saved = save_jobs(all_jobs)

    result = {
        "remotive": len(remotive_jobs),
        "technopark": len(technopark_jobs),
        "total": len(all_jobs),
        "saved": saved,
        "timestamp": datetime.utcnow().isoformat()
    }

    print(f"✅ Scraping done: {result}")

    return result

# ═══════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════

@router.post("/scrape")
async def trigger_scrape():
    result = await run_all_scrapers()
    return {"message": "Scraping complete!", "result": result}


@router.get("/jobs")
async def get_jobs(
    source:   str = None,
    job_type: str = None,
    limit:    int = 20
):
    session = get_connection()
    try:
        query  = "SELECT * FROM job_listings WHERE 1=1"
        params = {}
        if source:
            query += " AND source = :source"
            params["source"] = source
        if job_type:
            query += " AND job_type = :job_type"
            params["job_type"] = job_type
        query += " ORDER BY scraped_at DESC LIMIT :limit"
        params["limit"] = limit
        rows = session.execute(text(query), params).fetchall()
        jobs = [
            {
                "id":        r.id,
                "title":     r.title,
                "company":   r.company,
                "location":  r.location,
                "skills":    json.loads(r.skills) if r.skills else [],
                "salary":    r.salary,
                "job_type":  r.job_type,
                "source":    r.source,
                "url":       r.url,
                "scraped_at": str(r.scraped_at)
            }
            for r in rows
        ]
    finally:
        session.close()
    return {"total": len(jobs), "jobs": jobs}


@router.get("/jobs/match/{student_id}")
async def match_jobs_to_student(student_id: int):

    session = get_connection()

    try:
        student = session.execute(
            text(
                "SELECT skills FROM students WHERE id = :id"
            ),
            {"id": student_id}
        ).fetchone()

        if not student:
            return {
                "error": "Student not found"
            }

        student_skills = json.loads(
            student.skills or "[]"
        )

        rows = session.execute(
            text("""
                SELECT *
                FROM job_listings
                ORDER BY scraped_at DESC
                LIMIT 50
            """)
        ).fetchall()

    finally:
        session.close()

    results = []

    for r in rows:

        job_skills = (
            json.loads(r.skills)
            if r.skills
            else []
        )

        student_set = {
            s.lower().strip()
            for s in student_skills
        }

        job_set = {
            s.lower().strip()
            for s in job_skills
        }

        matched = len(
            student_set.intersection(job_set)
        )

        match_pct = int(
            (matched / max(len(job_set), 1)) * 100
        )

        results.append({
            "id": r.id,
            "title": r.title,
            "company": r.company,
            "location": r.location,
            "skills": job_skills,
            "salary": r.salary,
            "source": r.source,
            "url": r.url,
            "match_percent": match_pct
        })

    results.sort(
        key=lambda x: x["match_percent"],
        reverse=True
    )

    return {
        "student_id": student_id,
        "student_skills": student_skills,
        "matched_jobs": results[:10],
        "total": len(results)
    }
@router.get("/stats")
async def get_job_stats():

    session = get_connection()

    try:
        total_jobs = session.execute(
            text("SELECT COUNT(*) FROM job_listings")
        ).scalar()

        source_rows = session.execute(
            text("""
                SELECT source, COUNT(*) as count
                FROM job_listings
                GROUP BY source
            """)
        ).fetchall()

        by_source = {
            row.source: row.count
            for row in source_rows
        }

        return {
            "total_jobs": total_jobs,
            "by_source": by_source
        }

    finally:
        session.close()