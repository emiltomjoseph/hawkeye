"""
Report API routes.
Handles PDF report generation and download.
"""

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from database import get_db
from models.user import User
from models.scan import Scan
from fastapi import HTTPException, status
from services.report_service import generate_pdf_report
from utils.security import get_current_user

router = APIRouter(prefix="/api/report", tags=["Reports"])


@router.get("/{scan_id}")
async def download_report(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Download a PDF security report for a completed scan.

    Returns a PDF file with:
    - Scan metadata (URL, date, status)
    - Security score and grade
    - Detailed findings for each check
    - Actionable recommendations
    """
    # Fetch scan with results
    result = await db.execute(
        select(Scan)
        .options(selectinload(Scan.result))
        .where(Scan.id == scan_id, Scan.user_id == current_user.id)
    )
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found",
        )

    if scan.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report is only available for completed scans",
        )

    if not scan.result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan results not found",
        )

    # Generate PDF
    pdf_bytes = generate_pdf_report(scan, scan.result)

    # Return as downloadable PDF
    filename = f"hawkeye_report_{scan.id}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
        },
    )
