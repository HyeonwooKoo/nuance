from sqlmodel import SQLModel, Field, Relationship

from src.models.word import WordBase


class SentenceBase(SQLModel):
    text: str


class SentenceCreate(SentenceBase):
    word_id: int | None = None
    term: str | None = None


class SentencePublic(SentenceBase):
    word: WordBase


class Sentence(SentenceBase, table=True):
    __tablename__ = "sentences"

    id: int | None = Field(default=None, primary_key=True)
    word_id: int = Field(foreign_key="words.id", ondelete="CASCADE")

    word: "Word" = Relationship(back_populates="sentences")
