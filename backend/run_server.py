import platform
platform._wmi_query = lambda *args: ('10', 1, 1, 0, 0)
platform._win32_ver = lambda *args: ('10', '', '', False)

import uvicorn
if __name__ == "__main__":
    uvicorn.run('app.main:app', port=8000, host='127.0.0.1', ws='websockets', reload=True)
