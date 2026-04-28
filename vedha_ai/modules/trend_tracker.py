from fastapi import APIRouter,HTTPException
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import httpx
from datetime import datetime

router = APIRouter()

llm=OllamaLLM(model="llama3.2", temperature=0.7)
router = APIRouter()

# Llama AI setup
llm = OllamaLLM(
    model="llama3.2",
    temperature=0.7
)

# Prompt Template
trend_prompt = PromptTemplate(
    input_variables=["repos"],
    template="""You are a career mentor for Data Science students in Kerala, India.

Here are the trending GitHub repositories this week:
{repos}

Please provide:
1. Top 3 skills that are trending
2. What a DS/ML student should learn this week
3. Two free resources to learn these skills

Keep advice practical and specific for Indian job market."""
)

# Chain = Prompt + LLM
trend_chain = trend_prompt | llm | StrOutputParser()


async def fetch_github_trends():
    url = "https://api.github.com/search/repositories"

    
    params = {
        "q": "created:>2026-01-01 topic:machine-learning",
        "sort": "stars",
        "order": "desc",
        "per_page": 8
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response=await client.get(url,params=params)

            data=response.json()
            repos=[]

            for item in data.get("items", []):
                repos.append({
                "name": item["full_name"],
                "stars": item["stargazers_count"],
                "language": item.get("language", "Unknown"),
                "description": (item.get("description") or "")[:100]
            })
            return repos
    except httpx.RequestError as e:
        return []
    
async def analyze_with_llama(repos: list)-> str:
    if not repos:
        return "No repositories to analyze."
    
    repos_text=""
    for repo in repos[:5]:  # Limit to top 5 for prompt
        repos_text += f"- {repo['name']} ({repo['language']}) ⭐{repo['stars']}\n"
        repos_text += f"  {repo['description']}\n"


        try:
            result = await trend_chain.ainvoke({"repos": repos_text})
            return result
        except Exception as e:
            return f"Analysis error: {str(e)}"
@router.get("/trends")
async def get_trends():
    repos=await fetch_github_trends()
    analysis=await analyze_with_llama(repos)

    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "source": "GitHub API + Llama 3.2 (Free)",
        "trending_repos": repos,
        "ai_analysis": analysis,
        "total": len(repos)
    }
