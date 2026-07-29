"""
User profile API routes.
Handles profile viewing, updating, and password changes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from schemas.user import UserProfile, UserUpdate, ChangePassword, MessageResponse
from services.user_service import get_profile, update_profile, change_password
from utils.security import get_current_user

router = APIRouter(prefix="/api/user", tags=["User"])


@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get the authenticated user's profile."""
    return await get_profile(current_user)


@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update the authenticated user's profile (name)."""
    return await update_profile(db, current_user, data)


@router.put("/change-password", response_model=MessageResponse)
async def change_user_password(
    data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Change the authenticated user's password.

    Requires the current password for verification.
    """
    await change_password(db, current_user, data)
    return MessageResponse(message="Password changed successfully")
