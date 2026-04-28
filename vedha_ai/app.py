from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from modules.auth import router as auth_router
from modules.skill_gap import router as skills_router
from modules.chatbot import router as chat_router
from modules.leaderboard import router as leaderboard_router
from modules.mentor_match import router as opportunities_router
from modules.quiz import router as quiz_router
from modules.resume_scanner import router as resume_router
from modules.knowledge import router as knowledge_router
from modules.trend_tracker import router as trends_router
from modules.mock_interview import router as interview_router
from utils.vector_store import build_index, load_from_disk
from data.knowledge_base import CAREER_KNOWLEDGE
from modules.leetcode import router as leetcode_router
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting Vedha AI...")
    loaded = load_from_disk()
    if not loaded:
        print("First run - building knowledge base...")
        build_index(CAREER_KNOWLEDGE)
    print("RAG system ready!")
    yield

app = FastAPI(title="Vedha AI", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router,          prefix="/api/auth",          tags=["Auth"])
app.include_router(skills_router,        prefix="/api/skills",        tags=["Skills"])
app.include_router(chat_router,          prefix="/api/chat",          tags=["Chat"])
app.include_router(leaderboard_router,   prefix="/api/leaderboard",   tags=["Leaderboard"])
app.include_router(opportunities_router, prefix="/api/opportunities",  tags=["Opportunities"])
app.include_router(quiz_router,          prefix="/api/quiz",          tags=["Quiz"])
app.include_router(resume_router,        prefix="/api/resume",        tags=["Resume"])
app.include_router(knowledge_router,     prefix="/api/knowledge",     tags=["Knowledge"])
app.include_router(trends_router,        prefix="/api/trends",        tags=["Trends"])
app.include_router(interview_router,     prefix="/api/interview",     tags=["Interview"])
app.include_router(leetcode_router,      prefix="/api/leetcode",      tags=["LeetCode"])
@app.get("/")
def home():
    return {"message": "Vedha AI v3.0 - Free & Open Source!"}