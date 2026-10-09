import asyncio
from app.db.session import AsyncSessionLocal
from app.schemas.super_admin import PlatformUserCreate
from app.services.super_admin import create_platform_user_service
from fastapi import HTTPException

async def test_duplicate():
    async with AsyncSessionLocal() as db:
        data = PlatformUserCreate(
            name="Aron Duplicate",
            email="aron12@yopmail.com",
            role="CUSTOM_ADMIN",
            scope="root"
        )
        try:
            user = await create_platform_user_service(db, data)
            print("Successfully created duplicate?! ID:", user.id)
        except HTTPException as e:
            print("HTTPException caught:", e.detail)
        except Exception as e:
            print("Other Exception caught:", e)

if __name__ == "__main__":
    asyncio.run(test_duplicate())
