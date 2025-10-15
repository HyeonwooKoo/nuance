from sqlmodel import Session, select
from src.models.sentence import Sentence, SentenceCreate
from src.models.word import Word


def create_sentence(session: Session, *, sentence_in: SentenceCreate) -> Sentence:
    word = session.exec(select(Word).where(Word.term == sentence_in.term)).first()
    if not word:
        raise Exception("Word not found")

    sentence_data = sentence_in.model_dump(exclude={"term"})
    sentence = Sentence(**sentence_data, word_id=word.id)
    session.add(sentence)
    session.commit()
    session.refresh(sentence)
    return sentence
