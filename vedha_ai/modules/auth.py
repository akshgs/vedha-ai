from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from utils.db import get_connection
import hashlib

router=APIRouter()
def hash_password(password:str)->str:
    return hashlib.sha256(password.encode()).hexdigest()

class RegisterRequest(BaseModel):
    name:str
    email:str
    password:str
    goal:str='Student'

@router.post("/register")
def register(data: RegisterRequest):
    conn=get_connection()
    cur=conn.cursor()
    existing=cur.execute("SELECT * FROM students WHERE email=?",(data.email,)
                         ).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400,detail="Email already registered")

    cur.execute("""INSERT INTO students 
   (name, email, password, goal) 
   VALUES (?, ?, ?, ?)""",
   (data.name, data.email, 
    hash_password(data.password), 
    data.goal)
)
    conn.commit()
    conn.close()

    return{"message":"Account created!",
           "name":data.name,
           "email":data.email}

class LoginRequest(BaseModel):
    email:str
    password:str
@router.post("/login")
def login(data:LoginRequest):
    conn=get_connection()
    cur=conn.cursor()
    user=cur.execute("SELECT * FROM students WHERE email=?",(data.email,)
                     ).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=400,detail="Email not found!")
    if user['password']!=hash_password(data.password):
        conn.close()
        raise HTTPException(status_code=400,detail="Incorrect password!")
    conn.close()
    return{
        "message":"login sucessful",
        "user":{
            "id":user['id'],
            "name":user['name'],
            "email":user['email'],
            "goal":user['goal']
        }
    }