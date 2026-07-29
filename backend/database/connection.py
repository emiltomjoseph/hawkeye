"""
Database connection setup with async SQLAlchemy.
Provides session factory and dependency injection for request-scoped sessions.
"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

settings = get_settings()

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    future=True,
)

# Session factory
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Declarative base class for all ORM models."""
    pass


async def get_db():
    """
    Dependency that provides a request-scoped async database session.
    Automatically closes the session when the request completes.
    """
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_tables():
    """Create all database tables. Used during application startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
