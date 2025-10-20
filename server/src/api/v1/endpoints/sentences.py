from fastapi import APIRouter
from sqlmodel import select
from sqlalchemy.sql.expression import func
from src.api.dep import SessionDep, OptionalCurrentUser
from src.models.word import Word
from src.models.sentence import Sentence, SentencePublic

router = APIRouter()


@router.get("/random")
def get_random_sentences(
    session: SessionDep, user: OptionalCurrentUser
) -> list[SentencePublic]:
    if user:
        return []

    random_words = session.exec(select(Word).order_by(func.random()).limit(20)).all()

    sentences = []
    for word in random_words:
        random_sentence = session.exec(
            select(Sentence).where(Sentence.word_id == word.id).order_by(func.random())
        ).first()
        sentences.append(random_sentence)

    return [SentencePublic(text=s.text, word=s.word) for s in sentences]
