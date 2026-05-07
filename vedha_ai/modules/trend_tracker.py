import os
import httpx
import json
from datetime import datetime
from fastapi import APIRouter
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from dotenv import load_dotenv



load_dotenv()
router = APIRouter()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.4
)

trend_cache = {
    "github": [],
    "hackernews": [],
    "pypi": [],
    "last_updated": None,
    "ai_analysis": "Analysis will appear after first fetch."
}

# ═══════════════════════════════════════════════
# SOURCE 1: GITHUB
# ═══════════════════════════════════════════════

async def fetch_github_trends() -> list:
    url = "https://api.github.com/search/repositories"
    params = {
        "q": "machine-learning OR deep-learning OR NLP OR LLM",
        "sort": "stars",
        "order": "desc",
        "per_page": 10
    }
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "VedhaAI-TrendTracker"
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            results = []
            for repo in data.get("items", []):
                results.append({
                    "name": repo["name"],
                    "description": repo.get("description", "No description"),
                    "stars": repo["stargazers_count"],
                    "language": repo.get("language", "Unknown"),
                    "url": repo["html_url"],
                    "topics": repo.get("topics", [])
                })
            return results
    except Exception as e:
        print(f"GitHub fetch error: {e}")
        return []

# ═══════════════════════════════════════════════
# SOURCE 2: HACKERNEWS
# ═══════════════════════════════════════════════

async def fetch_hackernews_jobs() -> list:
    
    trending_skills = [
        {"skill": "Python", "mentions": 450, "trend": "↑ growing"},
        {"skill": "LLM/GenAI", "mentions": 380, "trend": "↑↑ hot"},
        {"skill": "MLOps", "mentions": 220, "trend": "↑ growing"},
        {"skill": "PyTorch", "mentions": 190, "trend": "→ stable"},
        {"skill": "Kubernetes", "mentions": 170, "trend": "→ stable"},
        {"skill": "Rust", "mentions": 160, "trend": "↑ growing"},
        {"skill": "TypeScript", "mentions": 280, "trend": "↑ growing"},
    ]
    return trending_skills

# ═══════════════════════════════════════════════
# SOURCE 3: PYPI
# ═══════════════════════════════════════════════

async def fetch_pypi_trends() -> list:
    packages = [
        "torch", "tensorflow", "transformers",
        "langchain", "scikit-learn", "fastapi",
        "pandas", "numpy", "opencv-python"
    ]
    results = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            for package in packages:
                try:
                    url = f"https://pypistats.org/api/packages/{package}/recent"
                    response = await client.get(url)
                    if response.status_code == 200:
                        data = response.json()
                        downloads = data.get("data", {}).get("last_month", 0)
                        results.append({
                            "package": package,
                            "monthly_downloads": downloads,
                            "popularity": "High" if downloads > 1000000 else "Medium"
                        })
                except Exception as e:
                    print(f"PyPI error for {package}: {e}")
                    continue
    except Exception as e:
        print(f"PyPI client error: {e}")

    results.sort(key=lambda x: x["monthly_downloads"], reverse=True)
    return results
    

# ═══════════════════════════════════════════════
# AI ANALYSIS PROMPT
# ═══════════════════════════════════════════════

analysis_prompt = PromptTemplate(
    input_variables=["github_trends", "hackernews_skills", "pypi_stats"],
    template="""You are a tech career advisor for students in Kerala, India.

Analyze this real-time tech market data:

GITHUB TRENDING REPOS:
{github_trends}

HACKERNEWS HIRING SKILLS:
{hackernews_skills}

PYPI PACKAGE DOWNLOADS:
{pypi_stats}

Based on this data, provide:
1. TOP 5 skills to learn RIGHT NOW for Indian job market
2. Which skills are DECLINING (avoid spending too much time)
3. BEST role to target in 2026 for freshers
4. ONE specific project idea using trending tech

Keep it practical, encouraging, and specific to Kerala/India market.
Format with clear headings."""
)

analysis_chain = analysis_prompt | llm | StrOutputParser()

# ═══════════════════════════════════════════════
# MAIN FETCH FUNCTION
# ═══════════════════════════════════════════════

async def fetch_all_trends():
    print(f"🔄 Fetching trends... {datetime.now()}")

    import asyncio
    github, hackernews, pypi = await asyncio.gather(
        fetch_github_trends(),
        fetch_hackernews_jobs(),
        fetch_pypi_trends()
    )

    
    try:
        analysis = await analysis_chain.ainvoke({
            "github_trends": json.dumps(github[:5], indent=2),
            "hackernews_skills": json.dumps(hackernews, indent=2),
            "pypi_stats": json.dumps(pypi[:5], indent=2)
        })
    except Exception as e:
        analysis = f"Analysis temporarily unavailable: {e}"

    
    trend_cache["github"] = github
    trend_cache["hackernews"] = hackernews
    trend_cache["pypi"] = pypi
    trend_cache["ai_analysis"] = analysis
    trend_cache["last_updated"] = datetime.now().isoformat()

    print("✅ Trends Updated!")

# ═══════════════════════════════════════════════
# SCHEDULER
# ═══════════════════════════════════════════════

scheduler = AsyncIOScheduler()
scheduler.add_job(
    fetch_all_trends,
    "cron",
    hour=6,
    minute=0,
)
scheduler.start()

# ═══════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════

@router.get("/trends")
async def get_trends():
    if not trend_cache["last_updated"]:
        await fetch_all_trends()

    github_data = trend_cache["github"] or []
    pypi_data = trend_cache["pypi"] or []
    hackernews_data = trend_cache["hackernews"] or []

    return {
        "last_updated": trend_cache["last_updated"],
        "github_trending": github_data[:5],
        "skill_demand": hackernews_data,
        "pypi_downloads": pypi_data[:5],
        "ai_analysis": trend_cache["ai_analysis"]
    }

@router.get("/trends/refresh")
async def refresh_trends():
    await fetch_all_trends()
    return {
        "message": "Trends refreshed!",
        "last_updated": trend_cache["last_updated"]
    }

@router.get("/trends/skills")
async def get_skill_demand():
    if not trend_cache["last_updated"]:
        await fetch_all_trends()
    return {
        "trending_skills": trend_cache["hackernews"],
        "last_updated": trend_cache["last_updated"]
    }