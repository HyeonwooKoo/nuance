from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from src.models.word import WordPublic

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .word import Word


class SentenceBase(SQLModel):
    text: str


class SentenceCreate(SentenceBase):
    word_id: int | None = None
    term: str | None = None


class SentencePublic(SentenceBase):
    id: int
    word: WordPublic
    due: datetime | None = None


class Sentence(SentenceBase, table=True):
    __tablename__ = "sentences"

    id: int | None = Field(default=None, primary_key=True)
    word_id: int = Field(foreign_key="words.id", ondelete="CASCADE")

    word: "Word" = Relationship(back_populates="sentences")
