import uuid
from sqlmodel import Field, SQLModel

class UserBase(SQLModel):
    gmail: str = Field(unique=True, index=True)
    name: str
    is_superuser: bool = False

class UserCreate(UserBase):
    pass

class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    
