from sqlmodel import SQLModel


class AuthCode(SQLModel):
    code: str
