from sqlmodel import SQLModel, Field


class SentenceBase(SQLModel):
    text: str


class SentenceCreate(SentenceBase):
    term: str


class SentencePublic(SentenceBase):
    term: str


class Sentence(SentenceBase, table=True):
    __tablename__ = "sentences"

    id: int | None = Field(default=None, primary_key=True)
    word_id: int | None = Field(default=None, foreign_key="words.id")
