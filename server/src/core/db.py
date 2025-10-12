from sqlmodel import SQLModel, create_engine, Session
from src.core.config import settings
from src.dev.insert_sample_data import insert_sample_data

engine = create_engine(settings.DATABASE_URL)


def init_db():
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        insert_sample_data(session)
