"""
Scan history API routes.
Handles listing and deleting user's scan history.
"""

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from schemas.scan import ScanResponse
from schemas.pagination import PaginatedResponse
from schemas.user import MessageResponse
from services.scan_service import get_user_scans, delete_scan
from utils.security import get_current_user

router = APIRouter(prefix="/api/history", tags=["Scan History"])


@router.get("", response_model=PaginatedResponse[ScanResponse])
async def get_scan_history(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all scans for the authenticated user, most recent first, with pagination."""
    skip = (page - 1) * size
    return await get_user_scans(db, current_user.id, skip=skip, limit=size)


@router.delete("/{scan_id}", response_model=MessageResponse)
async def delete_scan_record(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a scan and its results from history."""
    await delete_scan(db, scan_id, current_user.id)
    return MessageResponse(message="Scan deleted successfully")
