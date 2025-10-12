from src.models.user import User, UserCreate
from sqlmodel import Session, select


def get_user_by_gmail(session: Session, *, gmail: str) -> User | None:
    statement = select(User).where(User.gmail == gmail)
    user = session.exec(statement).first()
    return user


def create_user(session: Session, *, user_in: UserCreate) -> User:
    db_user = User.model_validate(user_in)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
