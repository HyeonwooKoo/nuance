from sqlmodel import SQLModel


class AuthCode(SQLModel):
    code: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str