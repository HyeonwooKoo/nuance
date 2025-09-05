import uuid
from sqlmodel import Field, SQLModel, Relationship
from .associations import Studying, Seen

class UserBase(SQLModel):
    gmail: str = Field(unique=True, index=True)
    name: str
    is_superuser: bool = False

class UserCreate(UserBase):
    pass

class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    studying_vocas: list["Voca"] = Relationship(back_populates="studying_users", link_model=Studying)
    seen_sentences: list["Sentence"] = Relationship(back_populates="seen_by_users", link_model=Seen)


