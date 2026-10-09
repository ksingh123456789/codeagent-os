import asyncio
from app.db.session import AsyncSessionLocal
from sqlalchemy.future import select
from app.models.domain import User, Execution
from app.core.security import create_access_token

async def test():
    async with AsyncSessionLocal() as db:
        token = create_access_token(subject=11)
        print(f"Token for user 11 (kuldeep): {token}")

if __name__ == "__main__":
    asyncio.run(test())
