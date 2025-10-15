from sqlmodel import SQLModel, Field, Relationship


class SentenceBase(SQLModel):
    text: str


class SentenceCreate(SentenceBase):
    term: str


class SentencePublic(SentenceBase):
    term: str


class Sentence(SentenceBase, table=True):
    __tablename__ = "sentences"

    id: int | None = Field(default=None, primary_key=True)
    word_id: int = Field(foreign_key="words.id", ondelete="CASCADE")

    word: "Word" = Relationship(back_populates="sentences")
