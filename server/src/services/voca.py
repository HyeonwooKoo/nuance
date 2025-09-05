from sqlmodel import Session
from src.models.voca import Voca, VocaCreate


def create_voca(session: Session, *, voca_in: VocaCreate) -> Voca:
    voca = Voca.model_validate(voca_in)
    session.add(voca)
    session.commit()
    session.refresh(voca)
    return voca
