import asyncio
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_user():
    response = client.post(
        "/api/v1/super-admin/users",
        json={
            "name": "api_test",
            "email": "api_test@example.com",
            "role": "SUPER_ADMIN",
            "scope": "root"
        }
    )
    print("Status:", response.status_code)
    print("Response:", response.text)

if __name__ == "__main__":
    test_create_user()
