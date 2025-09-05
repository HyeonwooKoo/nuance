from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from .associations import Seen

class SentenceBase(SQLModel):
    text: str

class SentenceCreate(SentenceBase):
    voca: str

class SentencePublic(SentenceBase):
    voca: str

class Sentence(SentenceBase, table=True):
    __tablename__ = "sentences"

    id: int | None = Field(default=None, primary_key=True)
    
    voca_id: int | None = Field(default=None, foreign_key="vocas.id")
    voca: Optional["Voca"] = Relationship(back_populates="sentences")

    seen_by_users: list["User"] = Relationship(back_populates="seen_sentences", link_model=Seen)