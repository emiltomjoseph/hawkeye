"""
Pydantic schemas for user-related request/response validation.
"""

import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator
from app.config import get_settings

settings = get_settings()


# --- Request Schemas ---

class UserRegister(BaseModel):
    """Schema for user registration request."""
    name: str = Field(..., min_length=2, max_length=100, examples=["John Doe"])
    email: EmailStr = Field(..., examples=["john@example.com"])
    password: str = Field(..., min_length=settings.password_min_length, max_length=128, examples=["SecurePass123!"])

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if settings.password_require_uppercase and not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if settings.password_require_digit and not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v


class UserLogin(BaseModel):
    """Schema for user login request."""
    email: EmailStr = Field(..., examples=["john@example.com"])
    password: str = Field(..., examples=["SecurePass123!"])


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = Field(None)


class ChangePassword(BaseModel):
    """Schema for changing password."""
    old_password: str = Field(..., min_length=6, max_length=128)
    new_password: str = Field(..., min_length=settings.password_min_length, max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if settings.password_require_uppercase and not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if settings.password_require_digit and not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v


# --- Response Schemas ---

class UserProfile(BaseModel):
    """Schema for user profile response."""
    id: int
    name: str
    email: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
