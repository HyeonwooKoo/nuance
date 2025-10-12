import uuid
from sqlmodel import Field, SQLModel


class ReviewStat(SQLModel, table=True):
    __tablename__ = "review_stats"
    
    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True)
    word_id: int = Field(foreign_key="words.id", primary_key=True)

class ReviewLog(SQLModel, table=True):
    __tablename__ = "review_logs"
    
    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True)
    sentence_id: int = Field(foreign_key="sentences.id", primary_key=True)