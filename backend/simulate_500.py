import asyncio
import os
import sys
import requests

sys.path.append(r'd:\codeagent-os---multi-tenant-ai-coding-infrastructure\backend')
from app.db.session import engine
from sqlalchemy import text

async def main():
    async with engine.connect() as conn:
        await conn.execute(text("UPDATE users SET status='REVOKED' WHERE email='ksingh@seasiainfotech.com'"))
        await conn.commit()
        print("Status changed to REVOKED")

    # Now make the POST request
    url = "http://localhost:8000/api/v1/tenant/developers"
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTIxMzQ5MTksInN1YiI6IjQifQ.dTi1M3t4LlUTZ5MpLJvOv_GbVDGXkcyl1DkNVYX-jVY",
        "Content-Type": "application/json"
    }
    data = {
        "name": "Kuldeep Singh",
        "email": "ksingh@seasiainfotech.com",
        "role": "Developer"
    }
    response = requests.post(url, headers=headers, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == '__main__':
    asyncio.run(main())
