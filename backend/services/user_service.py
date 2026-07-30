"""
User service layer.
Handles user profile management business logic.
"""

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from schemas.user import UserUpdate, ChangePassword
from utils.security import hash_password, verify_password


async def get_profile(user: User) -> User:
    """Return the user profile. User is already loaded by dependency."""
    return user


async def update_profile(db: AsyncSession, user: User, data: UserUpdate) -> User:
    """
    Update user profile fields.

    Args:
        db: Database session.
        user: Current authenticated user.
        data: Fields to update.

    Returns:
        Updated User object.
        
    Raises:
        HTTPException 400 if email is already in use by another user.
    """
    if data.name is not None:
        user.name = data.name
        
    if data.email is not None and data.email != user.email:
        # Check if email already exists
        result = await db.execute(select(User).where(User.email == data.email))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already in use",
            )
        user.email = data.email

    await db.commit()
    await db.refresh(user)

    return user


async def change_password(
    db: AsyncSession, user: User, data: ChangePassword
) -> None:
    """
    Change user password after verifying old password.

    Args:
        db: Database session.
        user: Current authenticated user.
        data: Old and new passwords.

    Raises:
        HTTPException 400 if old password is incorrect.
    """
    if not verify_password(data.old_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    user.password_hash = hash_password(data.new_password)
    await db.commit()


async def deactivate_account(db: AsyncSession, user: User) -> None:
    """
    Soft-delete a user account by setting is_active to False.
    
    Args:
        db: Database session.
        user: Current authenticated user.
    """
    user.is_active = False
    await db.commit()
