import asyncio
import base64
import httpx
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from app.models.domain import User
from app.core.config import settings

async def main():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    
    async with async_session() as db:
        # Assuming user ID 7 from the JWT in their curl: "sub":"7"
        result = await db.execute(select(User).where(User.id == 7))
        current_user = result.scalars().first()
        
        if not current_user:
            print("User 7 not found in DB")
            return
            
        print(f"User Jira Domain: {current_user.jira_domain}")
        print(f"User Jira Email: {current_user.jira_email}")
        print(f"User Jira Token Prefix: {current_user.jira_token[:5] if current_user.jira_token else 'None'}...")
        
        if not current_user.jira_domain or not current_user.jira_token:
            print("Missing Jira credentials")
            return
            
        auth_string = f"{current_user.jira_email}:{current_user.jira_token}"
        auth_encoded = base64.b64encode(auth_string.encode('ascii')).decode('ascii')
        domain = current_user.jira_domain.replace("https://", "").replace("http://", "")
        
        # Test 1: Get projects
        print("\n--- Testing Projects ---")
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://{domain}/rest/api/3/project", 
                headers={"Authorization": f"Basic {auth_encoded}", "Accept": "application/json"}
            )
            print(f"Projects Status: {resp.status_code}")
            if resp.status_code == 200:
                projects = resp.json()
                print(f"Found {len(projects)} projects:")
                for p in projects:
                    print(f" - {p.get('key')}: {p.get('name')}")
            else:
                print(f"Error: {resp.text}")
                
        # Test 2: Search Tickets
        print("\n--- Testing Tickets Search ---")
        jql = "project = 'SCRUM' AND statusCategory != Done"
        print(f"Querying JQL: {jql}")
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"https://{domain}/rest/api/3/search/jql", 
                json={"jql": jql, "maxResults": 20, "fields": ["summary", "description", "status", "priority", "assignee"]},
                headers={"Authorization": f"Basic {auth_encoded}", "Accept": "application/json"}
            )
            print(f"Search Status: {resp.status_code}")
            if resp.status_code == 200:
                data = resp.json()
                print("Raw JSON response keys:", data.keys())
                if 'values' in data:
                    issues = data['values']
                elif 'issues' in data:
                    issues = data['issues']
                else:
                    issues = []
                print(f"Found {len(issues)} issues. First issue:")
                if issues:
                    print(issues[0])
            else:
                print(f"Error: {resp.text}")

if __name__ == "__main__":
    asyncio.run(main())
