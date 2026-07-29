"""
Pydantic schemas for user-related request/response validation.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# --- Request Schemas ---

class UserRegister(BaseModel):
    """Schema for user registration request."""
    name: str = Field(..., min_length=2, max_length=100, examples=["John Doe"])
    email: EmailStr = Field(..., examples=["john@example.com"])
    password: str = Field(..., min_length=6, max_length=128, examples=["securepassword123"])


class UserLogin(BaseModel):
    """Schema for user login request."""
    email: EmailStr = Field(..., examples=["john@example.com"])
    password: str = Field(..., examples=["securepassword123"])


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)


class ChangePassword(BaseModel):
    """Schema for changing password."""
    old_password: str = Field(..., min_length=6, max_length=128)
    new_password: str = Field(..., min_length=6, max_length=128)


# --- Response Schemas ---

class UserProfile(BaseModel):
    """Schema for user profile response."""
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
