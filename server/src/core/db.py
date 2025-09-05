
from sqlmodel import SQLModel, create_engine
from src.core.config import settings

engine = create_engine(settings.DATABASE_URL)

def init_db():
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)