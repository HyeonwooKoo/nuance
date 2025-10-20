import uuid
import enum
from sqlmodel import Field, SQLModel
from datetime import datetime


class State(enum.IntEnum):
    Learning = 1
    Review = 2
    Relearning = 3


class Rating(enum.IntEnum):
    Again = 1
    Hard = 2
    Good = 3
    Easy = 4


class ReviewStat(SQLModel, table=True):
    __tablename__ = "review_stats"

    id: int | None = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(
        foreign_key="users.id", primary_key=True, ondelete="CASCADE"
    )
    word_id: int = Field(foreign_key="words.id", primary_key=True, ondelete="CASCADE")
    state: State
    step: int
    stability: float
    difficulty: float
    due: datetime
    last_reviewed_at: datetime


class ReviewLog(SQLModel, table=True):
    __tablename__ = "review_logs"

    id: int | None = Field(default=None, primary_key=True)
    review_stat_id: int = Field(
        foreign_key="review_stats.id", primary_key=True, ondelete="CASCADE"
    )
    sentence_id: int = Field(
        foreign_key="sentences.id", primary_key=True, ondelete="CASCADE"
    )
    rating: Rating
    reviewed_at: datetime = Field(default_factory=datetime)
    duration_ms: int
