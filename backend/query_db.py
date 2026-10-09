import asyncio
import asyncpg

async def main():
    conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/langgraph_db')
    steps = await conn.fetch('SELECT * FROM execution_files')
    print("Execution files:", steps)
    await conn.close()

if __name__ == "__main__":
    asyncio.run(main())
