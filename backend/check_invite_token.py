import asyncio
import sys

sys.path.append(r'd:\codeagent-os---multi-tenant-ai-coding-infrastructure\backend')
from app.db.session import engine
from sqlalchemy import text

async def main():
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT invite_token FROM users WHERE email='ksingh@seasiainfotech.com'"))
        for row in res.fetchall():
            print(row)

if __name__ == '__main__':
    asyncio.run(main())
