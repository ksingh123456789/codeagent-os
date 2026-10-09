import asyncio
from app.db.session import engine
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.future import select
from app.models.domain import User

async def main():
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with async_session() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}, Token: {u.invite_token}")

if __name__ == "__main__":
    asyncio.run(main())
