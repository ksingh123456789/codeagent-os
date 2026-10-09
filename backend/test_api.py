import asyncio
from app.core.security import create_access_token
import urllib.request
import json

def test_api():
    token = create_access_token(subject="1")
    
    url = "http://localhost:8000/api/v1/super-admin/users"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    data = {
        "name": "Cristy rutter real",
        "email": "cristyreal@yopmail.com",
        "role": "CUSTOM_ADMIN",
        "scope": "Custom: Manage Companies, Manage License Plans, Manage Global Settings"
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            print("Status:", response.status)
            print("Response:", response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("HTTPError:", e.code)
        print("Response:", e.read().decode('utf-8'))
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_api()
