import os
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from utils.db import get_connection
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# ═══════════════════════════════════════════════
# SECURITY CONFIGURATION
# ═══════════════════════════════════════════════

SECRET_KEY = os.getenv("SECRET_KEY", "vedha-ai-secret-2026-change-this")
# SECRET_KEY: used to sign and verify JWT tokens
# In production, always set a strong random key in .env

ALGORITHM = "HS256"
# HS256 = HMAC SHA-256, the standard JWT signing algorithm

ACCESS_TOKEN_EXPIRE_HOURS = 24
# Token will expire after 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# bcrypt: industry-standard password hashing
# Old: SHA256 — vulnerable to rainbow table attacks
# New: bcrypt — adds random salt + slow hashing = very secure

security = HTTPBearer()
# Expects "Authorization: Bearer <token>" in request headers

# ═══════════════════════════════════════════════
# PASSWORD HELPER FUNCTIONS
# ═══════════════════════════════════════════════

def hash_password(password: str) -> str:
    # Hash a plain-text password using bcrypt
    # bcrypt automatically adds a random salt
    # Same password will produce a different hash each time
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    # Compare plain-text password with stored bcrypt hash
    # Returns True if they match, False otherwise
    return pwd_context.verify(plain, hashed)


# ═══════════════════════════════════════════════
# JWT TOKEN HELPER FUNCTIONS
# ═══════════════════════════════════════════════

def create_token(student_id: int, email: str) -> str:
    # Create a signed JWT token for an authenticated user

    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    # Calculate exact expiry timestamp (now + 24 hours)

    payload = {
        "sub": str(student_id),  # subject: who this token belongs to
        "email": email,
        "exp": expire,           # expiry time, auto-checked by python-jose
        "iat": datetime.utcnow() # issued at time
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    # Combines payload + secret key → signed JWT string
    # Example: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.abc123"
    return token


def verify_token(token: str) -> dict:
    # Decode and verify a JWT token
    # Raises 401 error if token is expired, tampered, or invalid

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Verifies signature and checks expiry automatically

        student_id = payload.get("sub")
        if not student_id:
            raise HTTPException(status_code=401, detail="Invalid token!")

        return {
            "student_id": int(student_id),
            "email": payload.get("email")
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token expired or invalid! Please login again."
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    # FastAPI dependency function for protected endpoints
    # Automatically extracts and verifies the Bearer token from headers
    # Usage: add "current_user: dict = Depends(get_current_user)" to any endpoint
    return verify_token(credentials.credentials)


# ═══════════════════════════════════════════════
# REQUEST MODELS
# ═══════════════════════════════════════════════

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    goal: str = "Student"


class LoginRequest(BaseModel):
    email: str
    password: str


# ═══════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════

@router.post("/register")
def register(data: RegisterRequest):
    # Register a new student account

    # Basic input validation
    if len(data.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters!"
        )
    if "@" not in data.email:
        raise HTTPException(
            status_code=400,
            detail="Invalid email format!"
        )

    conn = get_connection()
    try:
        # Check if email already exists
        existing = conn.execute(
            "SELECT id FROM students WHERE email = ?",
            (data.email,)
        ).fetchone()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already registered!"
            )

        # Hash password with bcrypt before storing
        hashed = hash_password(data.password)

        # Insert new student into database
        cursor = conn.execute(
            """INSERT INTO students
               (name, email, password, goal)
               VALUES (?, ?, ?, ?)""",
            (data.name, data.email, hashed, data.goal)
        )
        conn.commit()
        new_id = cursor.lastrowid
        # lastrowid = auto-generated ID of the new student

    finally:
        conn.close()

    # Generate JWT token immediately after registration
    token = create_token(new_id, data.email)

    return {
        "message": "Account created successfully!",
        "token": token,
        # Frontend should save this token in localStorage
        "user": {
            "id": new_id,
            "name": data.name,
            "email": data.email,
            "goal": data.goal
        }
    }


@router.post("/login")
def login(data: LoginRequest):
    # Authenticate a student and return a JWT token

    conn = get_connection()
    try:
        user = conn.execute(
            "SELECT * FROM students WHERE email = ?",
            (data.email,)
        ).fetchone()
    finally:
        conn.close()

    # Check if email exists
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Email not found!"
        )

    # Verify password using bcrypt (never compare plain text!)
    if not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=400,
            detail="Incorrect password!"
        )

    # Create and return JWT token
    token = create_token(user["id"], user["email"])

    return {
        "message": "Login successful!",
        "token": token,
        # Frontend: send as "Authorization: Bearer <token>" header
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "goal": user["goal"]
        }
    }


@router.get("/me")
def get_my_profile(current_user: dict = Depends(get_current_user)):
    # Protected endpoint — requires valid JWT token
    # Depends(get_current_user) automatically verifies the token
    # Returns the logged-in student's profile

    conn = get_connection()
    try:
        user = conn.execute(
            """SELECT id, name, email, goal, quiz_score, skills
               FROM students WHERE id = ?""",
            (current_user["student_id"],)
        ).fetchone()
    finally:
        conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found!")

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "goal": user["goal"],
        "quiz_score": user["quiz_score"],
        "skills": user["skills"]
    }


@router.post("/refresh")
def refresh_token(current_user: dict = Depends(get_current_user)):
    # Issue a new token before the current one expires
    # Frontend should call this endpoint when token is near expiry

    new_token = create_token(
        current_user["student_id"],
        current_user["email"]
    )
    return {
        "message": "Token refreshed!",
        "token": new_token
    }