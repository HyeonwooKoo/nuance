import jwt
from google_auth_oauthlib.flow import Flow
from oauthlib.oauth2 import OAuth2Error

from src.core.config import settings
from src.core.exceptions import GoogleAuthError


def get_google_user_info(auth_code: str) -> dict:
    try:
        client_config = {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.REDIRECT_URI],
            }
        }

        flow = Flow.from_client_config(
            client_config=client_config,
            scopes=[
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
                "openid",
            ],
            redirect_uri=settings.REDIRECT_URI,
        )

        flow.fetch_token(code=auth_code)
        creds = flow.credentials
        id_token = creds.id_token

        token_payload = jwt.decode(id_token, options={"verify_signature": False})

        user_info = {
            "email": token_payload.get("email"),
            "name": token_payload.get("name"),
            "picture": token_payload.get("picture"),
        }
        return user_info

    except OAuth2Error as e:
        error_details = e.description or str(e)
        raise GoogleAuthError(detail=f"Google OAuth Error: {error_details}")
