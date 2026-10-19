import asyncio

from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context
from app.config import settings
from app.models import Base

target_metadata = Base.metadata


def run(connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def main() -> None:
    engine = create_async_engine(settings.database_url)
    async with engine.connect() as conn:
        await conn.run_sync(run)
    await engine.dispose()


asyncio.run(main())
