"""
Authentication API routes.
Handles user registration and login.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.user import UserRegister, UserLogin, UserProfile, Token, MessageResponse
from services.auth_service import register_user, authenticate_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserProfile, status_code=201)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """
    Register a new user account.

    - **name**: User's display name (2-100 characters)
    - **email**: Valid email address (must be unique)
    - **password**: Password (6-128 characters)
    """
    user = await register_user(db, user_data)
    return user


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Login with email and password to receive a JWT access token.

    Use the returned token in the Authorization header:
    `Authorization: Bearer <token>`
    """
    token = await authenticate_user(db, login_data)
    return token
