import uuid
import datetime as dt

from sqlmodel import Session, select
from sqlalchemy.sql.expression import func
from src.models.associations import ReviewStat
from src.models.word import Word, WordCreate


def create_word(session: Session, *, word_in: WordCreate) -> Word:
    word = Word.model_validate(word_in)
    session.add(word)
    session.commit()
    session.refresh(word)
    return word


def get_word_ids_due_soon(
    session: Session,
    *,
    user_id: uuid.UUID,
    max_count: int = 20,
    due_in_minutes: int = 15,
) -> list[int]:
    return session.exec(
        select(ReviewStat.word_id)
        .where(ReviewStat.user_id == user_id)
        .where(
            ReviewStat.due
            <= dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=due_in_minutes)
        )
        .order_by(ReviewStat.due)
        .limit(max_count)
    ).all()


def get_word_ids_unseen(
    session: Session, *, user_id: uuid.UUID, max_count: int = 20
) -> list[int]:
    return session.exec(
        select(Word.id)
        .outerjoin(
            ReviewStat,
            (ReviewStat.word_id == Word.id) & (ReviewStat.user_id == user_id),
        )
        .where(ReviewStat.id.is_(None))
        .order_by(func.random())
        .limit(max_count)
    ).all()
