"""
Authentication service layer.
Handles user registration, login, and token refreshment business logic.
"""

from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from schemas.user import UserRegister, UserLogin, Token
from utils.security import (
    hash_password, verify_password, 
    create_access_token, create_refresh_token, verify_refresh_token
)


async def register_user(db: AsyncSession, user_data: UserRegister) -> User:
    """
    Register a new user.

    Args:
        db: Database session.
        user_data: Registration data (name, email, password).

    Returns:
        The newly created User object.

    Raises:
        HTTPException 400 if email already exists.
    """
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


async def authenticate_user(db: AsyncSession, login_data: UserLogin) -> Token:
    """
    Authenticate a user and return JWT access and refresh tokens.

    Args:
        db: Database session.
        login_data: Login credentials (email, password).

    Returns:
        Token object with access_token, refresh_token, and token_type.

    Raises:
        HTTPException 401 if credentials are invalid.
    """
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    # Update last login
    user.last_login = datetime.now(timezone.utc)
    await db.commit()

    # Create JWT tokens with user ID as subject
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return Token(
        access_token=access_token, 
        refresh_token=refresh_token,
        token_type="bearer"
    )


async def refresh_user_token(db: AsyncSession, refresh_token: str) -> Token:
    """
    Generate new access and refresh tokens using a valid refresh token.
    
    Args:
        db: Database session.
        refresh_token: The refresh token string.
        
    Returns:
        Token object with new access_token, refresh_token, and token_type.
    """
    user_id_str = verify_refresh_token(refresh_token)
    
    result = await db.execute(select(User).where(User.id == int(user_id_str)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
        
    # Create new JWT tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return Token(
        access_token=access_token, 
        refresh_token=new_refresh_token,
        token_type="bearer"
    )
