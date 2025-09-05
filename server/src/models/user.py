from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    __tablename__ = "users"

    email: str = Field(primary_key=True, index=True)
    name: str
    picture: str
