import uuid
from sqlmodel import Field, SQLModel

class UserBase(SQLModel):
    gmail: str = Field(unique=True, index=True)
    name: str

class UserCreate(UserBase):
    pass

class User(UserBase, table=True):
    __tablename__ = "users"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
