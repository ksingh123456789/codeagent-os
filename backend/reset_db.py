import asyncio
from app.db.session import engine
from sqlalchemy.ext.asyncio import async_sessionmaker
from app.models.base import Base
from app.models.domain import User, Company, Role, License, CompanyLicense, Execution, ExecutionEvent, PullRequest, AuditLog, PasswordResetToken, OAuthAccount, Notification
from app.core.security import get_password_hash

async def reset_and_seed():
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
        
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with async_session() as session:
        # Seed Super Admin
        admin_user = User(
            name="Super Admin",
            email="admin@example.com",
            password_hash=get_password_hash("admin123"),
            role="SUPER_ADMIN",
            status="ACTIVE"
        )
        session.add(admin_user)
        
        # Seed a default Company
        company = Company(
            name="Acme Corp",
            domain="acme.com",
            status="ACTIVE"
        )
        session.add(company)
        
        await session.commit()
        print("Successfully seeded Super Admin and Acme Corp!")

asyncio.run(reset_and_seed())
