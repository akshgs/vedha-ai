from fastapi import FastAPI
from modules.auth import router as auth_router
app=FastAPI(title="vedha_ai",version='1.0.0')

app.include_router(auth_router,prefix='/api/auth',tags=['Auth'])

@app.get('/')
def home():
    return{"message":"vedha_AI is live","Status":"OK"}

@app.get('/health')
def health():
    return{"message":"vedha_AI ","version":"1.0.0"}
