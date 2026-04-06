from fastapi import FastAPI
app=FastAPI(title="vedha_ai",version='1.0.0')

@app.get('/')
def home():
    return{"message":"vedha_AI is live","Status":"OK"}

@app.get('/health')
def health():
    return{"message":"vedha_AI ","version":"1.0.0"}
