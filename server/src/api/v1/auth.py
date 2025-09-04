from fastapi import APIRouter

from src.models.auth import AuthCode
from src.models.user import User
from src.services.google_auth import get_google_user_info
from src.core.security import create_app_jwt

router = APIRouter()


@router.post("/google")
def google_auth(auth_code: AuthCode):
    user_info = get_google_user_info(auth_code=auth_code.code)

    # Here you would typically find or create a user in your database
    # For this example, we'll just use the info from Google

    token = create_app_jwt(user_info)

    return {"token": token, "user": User(**user_info)}
