import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import update
import os

# Update the DATABASE_URL to match config
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/langgraph_db"

async def main():
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    
    async with async_session() as session:
        # Assuming the User model table is 'users'
        from sqlalchemy import text
        # Update user status to ACTIVE and set tokens
        await session.execute(
            text("UPDATE users SET status = 'ACTIVE', github_token = 'mock_token_123', jira_token = 'mock_jira_123' WHERE email = 'ksingh@seasiainfotech.com'")
        )
        await session.commit()
        print("Updated user successfully")

if __name__ == "__main__":
    asyncio.run(main())
