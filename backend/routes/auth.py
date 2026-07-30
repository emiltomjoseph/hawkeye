"""
Authentication API routes.
Handles user registration, login, and token refresh.
"""

from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.user import UserRegister, UserLogin, UserProfile, Token
from services.auth_service import register_user, authenticate_user, refresh_user_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserProfile, status_code=201)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """
    Register a new user account.

    - **name**: User's display name (2-100 characters)
    - **email**: Valid email address (must be unique)
    - **password**: Password (min length and complexity determined by policy)
    """
    user = await register_user(db, user_data)
    return user


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Login with email and password to receive JWT access and refresh tokens.

    Use the returned access token in the Authorization header:
    `Authorization: Bearer <token>`
    """
    token = await authenticate_user(db, login_data)
    return token


@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a new access token using a valid refresh token.
    """
    token = await refresh_user_token(db, refresh_token)
    return token
