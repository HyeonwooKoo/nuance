import uuid
from sqlmodel import Field, SQLModel


class Studying(SQLModel, table=True):
    __tablename__ = "studying"
    
    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True)
    voca_id: int = Field(foreign_key="vocas.id", primary_key=True)

class Seen(SQLModel, table=True):
    __tablename__ = "seen"
    
    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True)
    sentence_id: int = Field(foreign_key="sentences.id", primary_key=True)