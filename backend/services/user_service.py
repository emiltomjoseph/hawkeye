"""
User service layer.
Handles user profile management business logic.
"""

from fastapi import HTTPException, status
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
    """
    if data.name is not None:
        user.name = data.name

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
