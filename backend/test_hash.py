from app.core.security import verify_password
hash_str = "$2b$12$evJMTHu/M/C9XIC/yX5XVehnGn66oCLEK6oQ14fV6ObkeQLLeEIlu"
print("Verify:", verify_password("admin123", hash_str))
