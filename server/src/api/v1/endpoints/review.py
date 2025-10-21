from fastapi import APIRouter
from src.api.dep import SessionDep, CurrentUser
from src.models.associations import Rating
from src.services import review as review_service

router = APIRouter()


@router.post("/{sentence_id}/review")
def review_sentence(
    session: SessionDep,
    user: CurrentUser,
    sentence_id: int,
    rating: Rating,
):
    return review_service.review(
        db=session,
        user_id=user.id,
        sentence_id=sentence_id,
        rating=rating,
    )
