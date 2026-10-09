from fastapi import FastAPI
from fastapi.testclient import TestClient
from datetime import datetime
import sys

sys.path.append(r'd:\codeagent-os---multi-tenant-ai-coding-infrastructure\backend')
from app.schemas.tenant_admin import DeveloperCreatedResponse

app = FastAPI()

@app.get("/test", response_model=DeveloperCreatedResponse)
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
    return response_dict

client = TestClient(app)
response = client.get("/test")
print("Status:", response.status_code)
print("Response:", response.text)
