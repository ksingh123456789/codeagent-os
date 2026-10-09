import asyncio
from app.db.session import engine
from sqlalchemy import text

async def alter_tables():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE companies ADD COLUMN tech_stack VARCHAR"))
            print("Added tech_stack")
        except Exception as e:
            print(e)
            
        try:
            await conn.execute(text("ALTER TABLE companies ADD COLUMN git_provider VARCHAR"))
            print("Added git_provider")
        except Exception as e:
            print(e)
            
        try:
            await conn.execute(text("ALTER TABLE companies ADD COLUMN jira_sync BOOLEAN DEFAULT FALSE"))
            print("Added jira_sync")
        except Exception as e:
            print(e)

if __name__ == "__main__":
    asyncio.run(alter_tables())
