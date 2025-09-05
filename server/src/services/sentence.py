from sqlmodel import Session, select
from src.models.sentence import Sentence, SentenceCreate
from src.models.voca import Voca


def create_sentence(session: Session, *, sentence_in: SentenceCreate) -> Sentence:
    voca = session.exec(select(Voca).where(Voca.word == sentence_in.voca)).first()
    if not voca:
        raise Exception("Voca not found")

    sentence_data = sentence_in.model_dump(exclude={"voca"})
    sentence = Sentence(**sentence_data, voca=voca)
    session.add(sentence)
    session.commit()
    session.refresh(sentence)
    return sentence
