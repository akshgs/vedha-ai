from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.security.jwt import get_current_user
from app.database.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    try:
        repository = UserRepository(db)
        service = AuthService(repository)

        return service.register(data)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    try:
        repository = UserRepository(db)
        service = AuthService(repository)

        return service.login(
            data.email,
            data.password
        )

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
from app.security.jwt import get_current_user


@router.get("/me")
def get_me(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repository = UserRepository(db)

    user = repository.get_by_id(
        int(current_user["sub"])
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "status": user.status,
    }