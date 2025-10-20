from sqlmodel import Field, SQLModel, Relationship
import enum


class CEFRLevel(str, enum.Enum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"


class WordBase(SQLModel):
    term: str = Field(index=True)
    definition: str
    part_of_speech: str
    cefr: CEFRLevel
    pronunciation: str


class WordCreate(WordBase):
    pass


class Word(WordBase, table=True):
    __tablename__ = "words"

    id: int | None = Field(default=None, primary_key=True)

    sentences: list["Sentence"] = Relationship(back_populates="word")
