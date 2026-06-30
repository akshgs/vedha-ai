from datetime import datetime, timedelta

from jose import jwt

from app.core.config import settings


ALGORITHM = "HS256"


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
):
    payload = data.copy()

    expire = datetime.utcnow() + (
        expires_delta or timedelta(hours=24)
    )

    payload.update({"exp": expire})

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=ALGORITHM,
    )