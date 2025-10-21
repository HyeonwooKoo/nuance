import uuid
import datetime as dt

import fsrs
from sqlmodel import Session, select

from src.models.associations import Rating, ReviewLog, ReviewStat
from src.models.sentence import Sentence


def review(
    db: Session,
    *,
    user_id: uuid.UUID,
    sentence_id: int,
    rating: Rating,
) -> ReviewStat:
    sentence = db.exec(select(Sentence).where(Sentence.id == sentence_id)).one()
    card = instantiate_card(db, user_id=user_id, word_id=sentence.word_id)
    is_new = card.last_review is None

    card, log = fsrs.Scheduler().review_card(card, rating=rating)
    review_stat = update_review_stat(
        db, is_new=is_new, card=card, user_id=user_id, word_id=sentence.word_id
    )
    log.card_id = review_stat.id
    create_review_log(db, log=log, sentence_id=sentence_id)
    return review_stat


def instantiate_card(
    db: Session,
    *,
    user_id: uuid.UUID,
    word_id: int,
) -> fsrs.Card:
    review_stat = db.exec(
        select(ReviewStat).where(
            ReviewStat.user_id == user_id, ReviewStat.word_id == word_id
        )
    ).one_or_none()

    if review_stat is None:
        return fsrs.Card(card_id=0)  # to prevent sleep
    else:
        card_dict = review_stat.model_dump(
            include={"state", "step", "stability", "difficulty", "due"}
        )
        card_dict["card_id"] = review_stat.id
        card_dict["last_review"] = _timezoned(review_stat.last_reviewed_at)
        return fsrs.Card(**card_dict)


def update_review_stat(
    db: Session, *, is_new: bool, card: fsrs.Card, user_id: uuid.UUID, word_id: int
) -> ReviewStat:
    if is_new:
        review_stat = ReviewStat.model_validate(
            card,
            update={
                "user_id": user_id,
                "word_id": word_id,
                "last_reviewed_at": card.last_review,
            },
        )
    else:
        review_stat = db.exec(
            select(ReviewStat).where(
                ReviewStat.user_id == user_id, ReviewStat.word_id == word_id
            )
        ).one()
        review_stat.sqlmodel_update(
            card.to_dict(), update={"last_reviewed_at": card.last_review}
        )

    db.add(review_stat)
    db.commit()
    db.refresh(review_stat)
    return review_stat


def create_review_log(db: Session, *, log: fsrs.ReviewLog, sentence_id: int):
    review_log = ReviewLog.model_validate(
        log,
        update={
            "review_stat_id": log.card_id,
            "sentence_id": sentence_id,
            "reviewed_at": log.review_datetime,
            "duration_ms": log.review_duration,
        },
    )
    db.add(review_log)
    db.commit()


def _timezoned(dt_obj: dt.datetime) -> dt.datetime:
    if dt_obj.tzinfo is None:
        return dt_obj.replace(tzinfo=dt.timezone.utc)
    return dt_obj
