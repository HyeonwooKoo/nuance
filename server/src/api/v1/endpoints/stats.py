from fastapi import APIRouter
from src.api.dep import CurrentUser, SessionDep
from src.services.word import get_word_ids_due_soon

router = APIRouter()


@router.get("/due-soon")
def get_words_due_soon(session: SessionDep, user: CurrentUser) -> list[int]:
    return get_word_ids_due_soon(
        session, user_id=user.id, max_count=20, due_in_minutes=15
    )
