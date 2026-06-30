from datetime import datetime

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterRequest
from app.security.jwt import create_access_token
from app.security.password import hash_password, verify_password


class AuthService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def register(self, data: RegisterRequest):

        existing = self.repository.get_by_email(data.email)

        if existing:
            raise ValueError("Email already exists.")

        user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
            role=data.role,
        )

        user = self.repository.create(user)

        token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
                "role": user.role,
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }

    def login(self, email: str, password: str):

        user = self.repository.get_by_email(email)

        if not user:
            raise ValueError("Invalid email or password.")

        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password.")

        user.last_login = datetime.utcnow()

        self.repository.update(user)

        token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
                "role": user.role,
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }