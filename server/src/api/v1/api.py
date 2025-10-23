from fastapi import APIRouter

from src.api.v1 import auth
from .endpoints import sentences, review, stats

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(sentences.router, prefix="/sentences", tags=["sentences"])
api_router.include_router(review.router, prefix="/sentences", tags=["sentences"])
api_router.include_router(stats.router, prefix="/words", tags=["words"])
