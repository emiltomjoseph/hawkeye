"""
Scan service layer.
Handles scan creation, retrieval, and history management.
"""

import logging
from typing import List

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database.connection import async_session

from models.scan import Scan
from models.scan_result import ScanResult
from scanner.engine import run_scan

logger = logging.getLogger(__name__)


async def create_scan_record(db: AsyncSession, user_id: int, url: str) -> Scan:
    """
    Create a new Scan record with 'scanning' status.
    The actual scan will be processed in the background.

    Args:
        db: Database session.
        user_id: ID of the user initiating the scan.
        url: Target URL to scan.

    Returns:
        The created Scan object.
    """
    # Create scan record
    scan = Scan(user_id=user_id, url=url, status="scanning")
    db.add(scan)
    await db.commit()
    await db.refresh(scan)
    return scan


async def process_scan_background(scan_id: int, url: str) -> None:
    """
    Execute a security scan in the background.
    Creates its own database session to persist results.

    Args:
        scan_id: ID of the scan record.
        url: Target URL to scan.
    """
    async with async_session() as db:
        try:
            # Fetch scan record to ensure it exists
            result = await db.execute(select(Scan).where(Scan.id == scan_id))
            scan = result.scalar_one_or_none()
            
            if not scan:
                logger.error(f"Background task failed: Scan {scan_id} not found.")
                return

            # Run the scanner engine
            logger.info(f"Background: Starting scan for URL: {url} (ID: {scan_id})")
            scan_data = await run_scan(url)

            # Store scan results
            scan_result = ScanResult(
                scan_id=scan.id,
                https_status=scan_data.get("https_status"),
                ssl_details=scan_data.get("ssl_details"),
                security_headers=scan_data.get("security_headers"),
                cookies=scan_data.get("cookies"),
                robots_txt=scan_data.get("robots_txt"),
                sitemap=scan_data.get("sitemap"),
                technologies=scan_data.get("technologies"),
                recommendations=scan_data.get("recommendations"),
            )
            db.add(scan_result)

            # Update scan with score and status
            scan.security_score = scan_data.get("security_score", 0)
            scan.status = "completed"

            await db.commit()
            logger.info(f"Background: Scan completed for URL: {url} | Score: {scan.security_score}")

        except Exception as e:
            logger.error(f"Background: Scan failed for URL: {url} | Error: {str(e)}")
            # Try to update status to failed
            try:
                result = await db.execute(select(Scan).where(Scan.id == scan_id))
                scan = result.scalar_one_or_none()
                if scan:
                    scan.status = "failed"
                    await db.commit()
            except Exception as inner_e:
                logger.error(f"Failed to update scan status: {str(inner_e)}")


async def get_scan(db: AsyncSession, scan_id: int, user_id: int) -> Scan:
    """
    Get a specific scan with its results.

    Args:
        db: Database session.
        scan_id: ID of the scan to retrieve.
        user_id: ID of the authenticated user (for ownership check).

    Returns:
        Scan object with loaded result.

    Raises:
        HTTPException 404 if scan not found or doesn't belong to user.
    """
    result = await db.execute(
        select(Scan)
        .options(selectinload(Scan.result))
        .where(Scan.id == scan_id, Scan.user_id == user_id)
    )
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found",
        )

    return scan


async def get_user_scans(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 20) -> dict:
    """
    Get all scans for a user with pagination.

    Args:
        db: Database session.
        user_id: ID of the user.
        skip: Number of records to skip.
        limit: Maximum number of records to return.

    Returns:
        Dict with items and total count.
    """
    # Get total count
    from sqlalchemy import func
    count_result = await db.execute(
        select(func.count(Scan.id)).where(Scan.user_id == user_id)
    )
    total = count_result.scalar_one()

    # Get paginated items
    result = await db.execute(
        select(Scan)
        .where(Scan.user_id == user_id)
        .order_by(Scan.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    items = list(result.scalars().all())
    
    return {
        "items": items,
        "total": total,
        "page": (skip // limit) + 1 if limit > 0 else 1,
        "size": limit,
        "pages": (total + limit - 1) // limit if limit > 0 else 1
    }


async def delete_scan(db: AsyncSession, scan_id: int, user_id: int) -> None:
    """
    Delete a scan and its results.

    Args:
        db: Database session.
        scan_id: ID of the scan to delete.
        user_id: ID of the authenticated user (for ownership check).

    Raises:
        HTTPException 404 if scan not found or doesn't belong to user.
    """
    result = await db.execute(
        select(Scan).where(Scan.id == scan_id, Scan.user_id == user_id)
    )
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found",
        )

    await db.delete(scan)
    await db.commit()
