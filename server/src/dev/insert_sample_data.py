import json
from sqlmodel import Session
from src.models import WordCreate, SentenceCreate
from src.services.word import create_word
from src.services.sentence import create_sentence


def get_sample_data():
    with open("src/dev/sample_data.json", "r") as f:
        sample_json = f.read()
        return json.loads(sample_json)


def insert_sample_data(session: Session):
    data = get_sample_data()
    word_creates = data["WordCreate"]
    sentence_creates = data["SentenceCreate"]

    for word_data in word_creates:
        create_word(session, word_in=WordCreate(**word_data))

    for sentence_data in sentence_creates:
        create_sentence(session, sentence_in=SentenceCreate(**sentence_data))
