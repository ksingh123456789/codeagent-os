from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class DeveloperCreate(BaseModel):
    name: str
    email: EmailStr
    role: str

class DeveloperUpdate(BaseModel):
    role: Optional[str] = None
    status: Optional[str] = None

class DeveloperResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    created_at: datetime
    github_token: Optional[str] = None
    jira_token: Optional[str] = None
    
    class Config:
        from_attributes = True

class DeveloperCreatedResponse(DeveloperResponse):
    temporary_password: str

class SettingsUpdate(BaseModel):
    name: Optional[str] = None
    admin_email: Optional[str] = None
