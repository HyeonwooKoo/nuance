
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from src.core.config import settings

engine = create_async_engine(settings.DATABASE_URL)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)