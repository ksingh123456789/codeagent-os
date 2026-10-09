import asyncio
from datetime import datetime
import sys

sys.path.append(r'd:\codeagent-os---multi-tenant-ai-coding-infrastructure\backend')
from app.schemas.tenant_admin import DeveloperCreatedResponse

def test():
    response_dict = {
        "id": 1,
        "name": "Kuldeep",
        "email": "ksingh@seasiainfotech.com",
        "role": "Developer",
        "status": "Invited",
        "created_at": datetime.utcnow(),
        "github_token": None,
        "jira_token": None,
        "temporary_password": "mypassword"
    }
    
    try:
        obj = DeveloperCreatedResponse(**response_dict)
        print("Success:", obj)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test()
