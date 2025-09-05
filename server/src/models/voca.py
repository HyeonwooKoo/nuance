from sqlmodel import Field, Relationship, SQLModel
import enum
from .associations import Studying

class CEFRLevel(str, enum.Enum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"

class VocaBase(SQLModel):
    word: str = Field(unique=True, index=True)
    meaning: str
    cefr: CEFRLevel

class VocaCreate(VocaBase):
    pass

class Voca(VocaBase, table=True):
    __tablename__ = "vocas"

    id: int | None = Field(default=None, primary_key=True)

    sentences: list["Sentence"] = Relationship(back_populates="voca")
    studying_users: list["User"] = Relationship(back_populates="studying_vocas", link_model=Studying)

