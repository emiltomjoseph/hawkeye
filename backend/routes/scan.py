"""
Scan API routes.
Handles scan submission and result retrieval.
"""

from fastapi import APIRouter, Depends, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from middleware.rate_limiter import limiter
from models.user import User
from schemas.scan import ScanRequest, ScanDetailResponse
from services.scan_service import create_scan_record, get_scan, process_scan_background
from utils.security import get_current_user

router = APIRouter(prefix="/api/scan", tags=["Scanner"])


@router.post("", response_model=ScanDetailResponse, status_code=202)
@limiter.limit("5/minute")
async def submit_scan(
    request: Request,
    scan_data: ScanRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Submit a new security scan.

    Provide a valid URL to scan. The scanner will analyze:
    - HTTPS configuration
    - SSL certificate
    - Security headers
    - Cookie security
    - robots.txt and sitemap.xml
    - Technology stack

    Returns the scan record immediately with 'scanning' status.
    The client should poll GET /api/scan/{id} for completion.
    """
    scan = await create_scan_record(db, current_user.id, str(scan_data.url))
    
    # Enqueue background processing
    background_tasks.add_task(process_scan_background, scan.id, str(scan_data.url))
    
    return await get_scan(db, scan.id, current_user.id)


@router.get("/{scan_id}", response_model=ScanDetailResponse)
async def get_scan_details(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get detailed results of a specific scan."""
    return await get_scan(db, scan_id, current_user.id)
