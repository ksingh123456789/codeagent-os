import platform
platform._wmi_query = lambda *args: ('10', 1, 1, 0, 0)
platform._win32_ver = lambda *args: ('10', '', '', False)

import asyncio
from app.db.session import engine
from sqlalchemy.ext.asyncio import async_sessionmaker
from app.models.base import Base
from app.models.domain import User, Company, License
from app.core.security import get_password_hash

async def reset_and_seed():
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
        
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with async_session() as session:
        # Seed License Plans
        starter_license = License(
            name="Starter Plan",
            description="Perfect for small teams.",
            badge="Starter",
            developer_limit=5,
            agent_concurrency=2,
            infrastructure_strategy="shared",
            monthly_price=99.0,
            annual_price=990.0
        )
        pro_license = License(
            name="20 Dev Plan",
            description="Great for growing teams.",
            badge="Pro",
            developer_limit=20,
            agent_concurrency=10,
            infrastructure_strategy="dedicated_rq",
            monthly_price=299.0,
            annual_price=2990.0
        )
        enterprise_license = License(
            name="Enterprise 100",
            description="For large organizations.",
            badge="Enterprise",
            developer_limit=100,
            agent_concurrency=50,
            infrastructure_strategy="dedicated_k8s",
            monthly_price=999.0,
            annual_price=9990.0
        )
        session.add_all([starter_license, pro_license, enterprise_license])
        await session.flush()

        # Seed a default Company
        company = Company(
            name="Acme Corp",
            domain="acme.com",
            status="ACTIVE",
            license_id=starter_license.id
        )
        session.add(company)
        await session.flush()

        # Seed Super Admin
        admin_user = User(
            name="Super Admin",
            email="admin@example.com",
            password_hash=get_password_hash("admin123"),
            role="SUPER_ADMIN",
            status="ACTIVE"
        )
        session.add(admin_user)
        
        # Seed Developer
        dev_user = User(
            company_id=company.id,
            name="John Doe",
            email="john.doe@techcorp.com",
            password_hash=get_password_hash("password123"),
            role="DEVELOPER",
            status="ACTIVE"
        )
        session.add(dev_user)
        
        await session.commit()
        print("Successfully seeded Super Admin, John Doe, and Acme Corp!")

if __name__ == "__main__":
    asyncio.run(reset_and_seed())
