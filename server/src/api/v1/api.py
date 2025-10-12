from fastapi import APIRouter

from src.api.v1 import auth
from .endpoints import sentences

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(sentences.router)
