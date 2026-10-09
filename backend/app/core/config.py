from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Code Agent Platform"
    API_V1_STR: str = "/api/v1"
    
    # DB (using the langgraph_db as requested)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/langgraph_db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Security
    SECRET_KEY: str = "SUPER_SECRET_CHANGE_ME_IN_PRODUCTION"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # Email Integration (Nodemailer style, but using FastAPI-Mail)
    MAIL_USERNAME: str = "your_email@example.com"
    MAIL_PASSWORD: str = "your_app_password"
    MAIL_FROM: str = "your_email@example.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.example.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    # GitHub OAuth
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
