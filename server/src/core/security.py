import jwt
from .config import settings

def create_app_jwt(user_info: dict) -> str:
    app_jwt_payload = {
        "sub": user_info["email"],
        "name": user_info["name"],
    }
    token = jwt.encode(app_jwt_payload, settings.JWT_SECRET, algorithm="HS256")
    return token
