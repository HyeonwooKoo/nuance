from fastapi import APIRouter

from src.models.auth import AuthCode
from src.models.user import UserCreate
from src.services.google_auth import get_google_user_info
from src.core.security import create_app_jwt
from src.api.dep import SessionDep
from src.services.user import get_user_by_email, create_user

router = APIRouter()


@router.post("/google")
def google_auth(session: SessionDep, auth_code: AuthCode):
    user_info = get_google_user_info(auth_code=auth_code.code)

    user = get_user_by_email(session, email=user_info["email"])
    if not user:
        user_in = UserCreate(
            email=user_info["email"],
            name=user_info.get("name", ""),
        )
        user = create_user(session, user_in=user_in)

    token = create_app_jwt(user_info)

    return {"token": token, "user": user}
