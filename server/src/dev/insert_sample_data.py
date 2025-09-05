import json
from sqlmodel import Session
from src.models import VocaCreate, SentenceCreate
from src.services.voca import create_voca
from src.services.sentence import create_sentence

def get_sample_data():
    with open("src/dev/sample_data.json", "r") as f:
        sample_json = f.read()
        return json.loads(sample_json)

def insert_sample_data(session: Session):
    data = get_sample_data()
    voca_creates = data["VocaCreate"]
    sentence_creates = data["SentenceCreate"]

    for voca_data in voca_creates:
        create_voca(session, voca_in=VocaCreate(**voca_data))

    for sentence_data in sentence_creates:
        create_sentence(session, sentence_in=SentenceCreate(**sentence_data))
