import asyncio
import sys
import os

sys.path.append(r'd:\codeagent-os---multi-tenant-ai-coding-infrastructure\backend')

from app.db.session import SessionLocal
from sqlalchemy import text

async def main():
    async with SessionLocal() as db:
        res = await db.execute(text('SELECT id, name, email, status, role FROM users;'))
        for row in res.fetchall():
            print(row)

if __name__ == '__main__':
    asyncio.run(main())
