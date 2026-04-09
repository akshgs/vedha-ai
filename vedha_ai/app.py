from fastapi import FastAPI
from modules.auth      import router as auth_router
from modules.skill_gap import router as skills_router
from modules.chatbot   import router as chat_router
from modules.leaderboard import router as leaderboard_router

app = FastAPI(title="vedha_ai", version='1.0.0')

app.include_router(auth_router, prefix='/api/auth', tags=['Auth'])
app.include_router(skills_router, prefix="/api/skills", tags=["Skills"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(leaderboard_router,  prefix="/api/leaderboard", tags=["Leaderboard"])


@app.get("/")
def home():
    return {"message": "Vedha AI is live!"}

@app.get('/health')
def health():
    return {"message": "vedha_AI", "version": "1.0.0"}