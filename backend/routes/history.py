"""
Scan history API routes.
Handles listing and deleting user's scan history.
"""

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from schemas.scan import ScanResponse
from schemas.user import MessageResponse
from services.scan_service import get_user_scans, delete_scan
from utils.security import get_current_user

router = APIRouter(prefix="/api/history", tags=["Scan History"])


@router.get("", response_model=List[ScanResponse])
async def get_scan_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all scans for the authenticated user, most recent first."""
    return await get_user_scans(db, current_user.id)


@router.delete("/{scan_id}", response_model=MessageResponse)
async def delete_scan_record(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a scan and its results from history."""
    await delete_scan(db, scan_id, current_user.id)
    return MessageResponse(message="Scan deleted successfully")
