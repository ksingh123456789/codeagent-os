import requests

url = "http://localhost:8000/api/v1/tenant/developers"
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTIxMzQ5MTksInN1YiI6IjQifQ.dTi1M3t4LlUTZ5MpLJvOv_GbVDGXkcyl1DkNVYX-jVY",
    "Content-Type": "application/json"
}
data = {
    "name": "New User",
    "email": "newuser@example.com",
    "role": "Developer"
}

response = requests.post(url, headers=headers, json=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
