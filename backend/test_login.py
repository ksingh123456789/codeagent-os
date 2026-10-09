import asyncio
from app.api.auth import LoginRequest, login
from app.db.session import engine
from sqlalchemy.ext.asyncio import async_sessionmaker
from fastapi import HTTPException
from sqlalchemy.future import select
from app.models.domain import User
from app.core.security import get_password_hash

async def test():
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with async_session() as session:
        result = await session.execute(select(User).where(User.email == "andrewrutter@yopmail.com"))
        user = result.scalars().first()
        if user:
            user.password_hash = get_password_hash("0BVqLVf1N#*9")
            await session.commit()
            print("Password updated successfully!")
        else:
            print("User not found")

asyncio.run(test())
