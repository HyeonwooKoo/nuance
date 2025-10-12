from fastapi import APIRouter
from sqlmodel import select
from sqlalchemy.sql.expression import func
from src.api.dep import SessionDep, OptionalCurrentUser
from src.models.voca import Voca
from src.models.sentence import Sentence, SentencePublic

router = APIRouter()


@router.get("/random")
def get_random_sentences(
    session: SessionDep, user: OptionalCurrentUser
) -> list[SentencePublic]:
    if user:
        return []

    random_vocas = session.exec(select(Voca).order_by(func.random()).limit(20)).all()

    sentences = []
    for voca in random_vocas:
        random_sentence = session.exec(
            select(Sentence)
            .where(Sentence.voca_id == voca.id)
            .order_by(func.random())
            .limit(1)
        ).first()

        sentences.append(random_sentence)

    return [SentencePublic(text=s.text, voca=s.voca.word) for s in sentences]
