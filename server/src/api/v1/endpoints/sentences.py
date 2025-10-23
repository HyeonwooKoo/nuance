from fastapi import APIRouter
from sqlmodel import select
from sqlmodel import literal
from sqlalchemy.sql.expression import func
from src.api.dep import CurrentUser, SessionDep
from src.models.associations import ReviewStat, ReviewLog
from src.models.sentence import Sentence, SentencePublic
from src.services.word import get_word_ids_due_soon, get_word_ids_unseen

router = APIRouter()


@router.get("/due-soon")
def get_sentences_due_soon(
    session: SessionDep, user: CurrentUser
) -> list[SentencePublic]:
    word_ids = get_word_ids_due_soon(session, user_id=user.id)

    stats_sq = (
        select(ReviewStat)
        .where((ReviewStat.user_id == user.id) & (ReviewStat.word_id.in_(word_ids)))
        .subquery()
    )

    counts_sq = (
        select(
            Sentence.id.label("sentence_id"),
            Sentence.word_id,
            stats_sq.c.due,
            func.count(ReviewLog.id).label("cnt"),
        )
        .select_from(Sentence)
        .where(Sentence.word_id.in_(word_ids))
        .join(
            stats_sq,
            stats_sq.c.word_id == Sentence.word_id,
            isouter=True,
        )
        .join(
            ReviewLog,
            (ReviewLog.review_stat_id == stats_sq.c.id)
            & (ReviewLog.sentence_id == Sentence.id),
            isouter=True,
        )
        .group_by(Sentence.id, Sentence.word_id, stats_sq.c.due)
        .subquery()
    )

    rn = func.row_number().over(
        partition_by=counts_sq.c.word_id,
        order_by=(counts_sq.c.cnt.asc(), func.random()),
    )

    return get_1st_sentences(session, counts_sq, rn)


@router.get("/unseen")
def get_sentences_unseen(
    session: SessionDep, user: CurrentUser
) -> list[SentencePublic]:
    word_ids = get_word_ids_unseen(session, user_id=user.id)

    sq = (
        select(
            Sentence.id.label("sentence_id"),
            Sentence.word_id.label("word_id"),
            literal(None).label("due"),
        )
        .where(Sentence.word_id.in_(word_ids))
        .subquery()
    )

    rn = func.row_number().over(
        partition_by=sq.c.word_id,
        order_by=func.random(),
    )

    return get_1st_sentences(session, sq, rn)


def get_1st_sentences(session: SessionDep, sq, rn_expr) -> list[SentencePublic]:
    winners_sq = (
        select(
            sq.c.sentence_id,
            sq.c.word_id,
            sq.c.due,
            rn_expr.label("rn"),
        )
    ).subquery()

    winners_stmt = (
        select(Sentence, winners_sq.c.due)
        .join(winners_sq, winners_sq.c.sentence_id == Sentence.id)
        .where(winners_sq.c.rn == 1)
        .order_by(winners_sq.c.due, func.random())
    )

    rows = session.exec(winners_stmt).all()
    return [
        SentencePublic.model_validate(sentence, update={"due": due})
        for (sentence, due) in rows
    ]
