import asyncio
from app.db.session import engine
from sqlalchemy.ext.asyncio import async_sessionmaker
from app.models.domain import License
from sqlalchemy.future import select

async def seed_licenses():
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with async_session() as session:
        result = await session.execute(select(License))
        existing = result.scalars().all()
        if not existing:
            licenses = [
                License(
                    name="20 Dev Starter",
                    description="Ideal for small teams",
                    badge="Standard",
                    developer_limit=20,
                    agent_concurrency=5,
                    infrastructure_strategy="shared",
                    monthly_price=199,
                    billing_period="mo"
                ),
                License(
                    name="50 Dev Scale",
                    description="For growing engineering orgs",
                    badge="Popular",
                    developer_limit=50,
                    agent_concurrency=15,
                    infrastructure_strategy="dedicated_rq",
                    monthly_price=399,
                    billing_period="mo"
                ),
                License(
                    name="Enterprise 100+",
                    description="Unlimited custom SLA",
                    badge="Custom SLA",
                    developer_limit=100,
                    agent_concurrency=30,
                    infrastructure_strategy="dedicated_k8s",
                    monthly_price=699,
                    billing_period="mo base"
                )
            ]
            session.add_all(licenses)
            await session.commit()
            print("Seeded licenses!")
        else:
            print("Licenses already exist!")

asyncio.run(seed_licenses())
