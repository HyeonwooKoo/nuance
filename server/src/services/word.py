from sqlmodel import Session
from src.models.word import Word, WordCreate


def create_word(session: Session, *, word_in: WordCreate) -> Word:
    word = Word.model_validate(word_in)
    session.add(word)
    session.commit()
    session.refresh(word)
    return word
