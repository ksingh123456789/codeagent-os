from cryptography.fernet import Fernet
from app.core.config import settings

# In production, this must be a 32 url-safe base64-encoded bytes string
# Generate using: Fernet.generate_key()
# For now, we use a static key derived from SECRET_KEY if needed, or a hardcoded one for dev.
ENCRYPTION_KEY = b'N-Q23-AdfO_p_Gg59H1mG4Dk8i5N2D01yK1s11Fj-E8='
fernet = Fernet(ENCRYPTION_KEY)

def encrypt_token(plain_token: str) -> str:
    if not plain_token:
        return plain_token
    return fernet.encrypt(plain_token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    if not encrypted_token:
        return encrypted_token
    return fernet.decrypt(encrypted_token.encode()).decode()
