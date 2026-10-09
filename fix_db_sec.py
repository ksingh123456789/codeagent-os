import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import sys

sys.path.append('d:/codeagent-os---multi-tenant-ai-coding-infrastructure/backend')
from app.core.security import encrypt_token

async def fix_db():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5432/langgraph_db')
    async with engine.connect() as conn:
        mock_token = encrypt_token('mock_gh_token_12345')
        query = f"UPDATE users SET github_token = '{mock_token}' WHERE email = 'ksingh@seasiainfotech.com'"
        await conn.execute(text(query))
        await conn.commit()
        print('Updated user token to mock_gh_token_12345 using security.py')
            
asyncio.run(fix_db())
