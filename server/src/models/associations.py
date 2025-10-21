import uuid
import enum
from sqlmodel import Field, SQLModel, UniqueConstraint, func
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
    __table_args__ = (UniqueConstraint("user_id", "word_id", name="uq_user_word"),)

    id: int | None = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", ondelete="CASCADE", index=True)
    word_id: int = Field(foreign_key="words.id", ondelete="CASCADE", index=True)
    state: State
    step: int | None
    stability: float
    difficulty: float
    due: datetime
    last_reviewed_at: datetime


class ReviewLog(SQLModel, table=True):
    __tablename__ = "review_logs"

    id: int | None = Field(default=None, primary_key=True)
    review_stat_id: int = Field(
        foreign_key="review_stats.id", ondelete="CASCADE", index=True
    )
    sentence_id: int = Field(foreign_key="sentences.id", ondelete="CASCADE")
    rating: Rating
    reviewed_at: datetime = Field(default=func.now())
    duration_ms: int | None
