from sqlmodel import Session, select
from src.models.sentence import Sentence, SentenceCreate
from src.models.word import Word


def create_sentence(session: Session, *, sentence_in: SentenceCreate) -> Sentence:
    word_id = sentence_in.word_id
    if word_id is None:
        if not sentence_in.term:
            raise Exception("Either word_id or term must be provided")

        word = session.exec(select(Word).where(Word.term == sentence_in.term)).first()
        if not word:
            raise Exception("Word not found")
        word_id = word.id

    sentence = Sentence(text=sentence_in.text, word_id=word_id)
    session.add(sentence)
    session.commit()
    session.refresh(sentence)
    return sentence
