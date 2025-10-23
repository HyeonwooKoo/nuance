from sqlmodel import select
from fastapi import APIRouter
from src.api.dep import SessionDep, CurrentUser
from src.models.associations import Rating, ReviewStat
from src.models.sentence import Sentence
from src.services.review import instantiate_card, update_review_stat, create_review_log
import fsrs

router = APIRouter()


@router.post("/{sentence_id}/review")
def review_sentence(
    session: SessionDep,
    user: CurrentUser,
    sentence_id: int,
    rating: Rating,
) -> ReviewStat:
    sentence = session.exec(select(Sentence).where(Sentence.id == sentence_id)).one()
    card = instantiate_card(session, user_id=user.id, word_id=sentence.word_id)
    is_new = card.last_review is None

    card, log = fsrs.Scheduler().review_card(card, rating=rating)
    review_stat = update_review_stat(
        session, is_new=is_new, card=card, user_id=user.id, word_id=sentence.word_id
    )
    log.card_id = review_stat.id
    create_review_log(session, log=log, sentence_id=sentence_id)
    return review_stat
