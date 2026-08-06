from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, UserResponse
from app.security.jwt import get_current_user
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", status_code=201, response_model=AuthResponse)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        repository = UserRepository(db)
        service = AuthService(repository)

        return service.register(data)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post("/login", response_model=AuthResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    try:
        repository = UserRepository(db)
        service = AuthService(repository)

        return service.login(
            data.email,
            data.password,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user=Depends(get_current_user),
):
    return current_user