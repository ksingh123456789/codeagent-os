import asyncio
import sys
import subprocess
import time
import requests

sys.path.append(r'd:\codeagent-os---multi-tenant-ai-coding-infrastructure\backend')

def main():
    # Start uvicorn
    proc = subprocess.Popen([sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8001"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=r'd:\codeagent-os---multi-tenant-ai-coding-infrastructure\backend')
    
    # Wait until server is up
    for _ in range(30):
        try:
            r = requests.get("http://localhost:8001/api/v1/health")
            if r.status_code == 200:
                break
        except:
            time.sleep(1)
            
    print("Server is up!")
    
    # Now make the POST request
    url = "http://localhost:8001/api/v1/tenant/developers"
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTIxMzQ5MTksInN1YiI6IjQifQ.dTi1M3t4LlUTZ5MpLJvOv_GbVDGXkcyl1DkNVYX-jVY",
        "Content-Type": "application/json"
    }
    data = {
        "name": "Kuldeep Singh",
        "email": "ksingh@seasiainfotech.com",
        "role": "Developer"
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print("Request failed:", e)
        
    proc.terminate()
    stdout, stderr = proc.communicate()
    print("STDOUT:\n", stdout.decode())
    print("STDERR:\n", stderr.decode())

if __name__ == '__main__':
    main()
