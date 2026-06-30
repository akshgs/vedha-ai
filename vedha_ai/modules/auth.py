# modules/auth.py — Updated for 2026 (PostgreSQL + multi-role)
import os
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy import text
from utils.db import get_connection
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# ═══════════════════════════════════════════════
# SECURITY CONFIGURATION
# ═══════════════════════════════════════════════

SECRET_KEY              = os.getenv("SECRET_KEY", "vedha-ai-secret-2026-change-this")
ALGORITHM               = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24
pwd_context = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto"
)
security    = HTTPBearer()

# Valid user roles
VALID_ROLES = ["student", "company", "employee"]

# ═══════════════════════════════════════════════
# PASSWORD HELPERS
# ═══════════════════════════════════════════════

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# ═══════════════════════════════════════════════
# JWT HELPERS
# ═══════════════════════════════════════════════

def create_token(student_id: int, email: str, role: str = "student") -> str:
    expire  = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {
        "sub":   str(student_id),
        "email": email,
        "role":  role,          # ← multi-user role in token
        "exp":   expire,
        "iat":   datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        payload    = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        student_id = payload.get("sub")
        if not student_id:
            raise HTTPException(status_code=401, detail="Invalid token!")
        return {
            "student_id": int(student_id),
            "email":      payload.get("email"),
            "role":       payload.get("role", "student")
        }
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token expired or invalid! Please login again."
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    return verify_token(credentials.credentials)

# ═══════════════════════════════════════════════
# REQUEST MODELS
# ═══════════════════════════════════════════════

class RegisterRequest(BaseModel):
    name:     str
    email:    str
    password: str
    goal:     str = "Student"
    role:     str = "student"   # student | company | employee


class LoginRequest(BaseModel):
    email:    str
    password: str

# ═══════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════
@router.post("/register")
def register(data: RegisterRequest):
    # Validation
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

    if data.role not in VALID_ROLES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role! Choose from: {VALID_ROLES}"
        )

    session = get_connection()

    try:
        # Check existing email
        existing = session.execute(
            text("SELECT id FROM students WHERE email = :email"),
            {"email": data.email}
        ).fetchone()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already registered!"
            )

        # Hash password
        hashed = hash_password(data.password)

        # Insert user
        session.execute(
            text("""
                INSERT INTO students
                (name, email, password, goal, role)
                VALUES
                (:name, :email, :password, :goal, :role)
            """),
            {
                "name": data.name,
                "email": data.email,
                "password": hashed,
                "goal": data.goal,
                "role": data.role
            }
        )

        session.commit()

        # Fetch newly created ID
        new_id = session.execute(
            text("SELECT id FROM students WHERE email = :email"),
            {"email": data.email}
        ).scalar()

    except HTTPException:
        session.rollback()
        raise

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )

    finally:
        session.close()

    token = create_token(
        new_id,
        data.email,
        data.role
    )

    return {
        "message": "Account created successfully!",
        "token": token,
        "user": {
            "id": new_id,
            "name": data.name,
            "email": data.email,
            "goal": data.goal,
            "role": data.role
        }
    }