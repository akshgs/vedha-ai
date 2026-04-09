from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.auth         import router as auth_router
from modules.skill_gap    import router as skills_router
from modules.chatbot      import router as chat_router
from modules.leaderboard  import router as leaderboard_router
from modules.mentor_match import router as opportunities_router

app = FastAPI(title="Vedha AI", version="1.0.0")

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

@app.get("/")
def home():
    return {"message": "Vedha AI is live!"}