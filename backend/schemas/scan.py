"""
Pydantic schemas for scan-related request/response validation.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, HttpUrl


# --- Request Schemas ---

class ScanRequest(BaseModel):
    """Schema for initiating a new scan."""
    url: HttpUrl = Field(..., examples=["https://example.com"])


# --- Response Schemas ---

class ScanResponse(BaseModel):
    """Schema for scan list/summary response."""
    id: int
    url: str
    security_score: Optional[int] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    scan_duration: Optional[float] = None

    model_config = {"from_attributes": True}


class ScanResultSchema(BaseModel):
    """Schema for detailed scan result data."""
    id: int
    scan_id: int
    https_status: Optional[Dict[str, Any]] = None
    ssl_details: Optional[Dict[str, Any]] = None
    security_headers: Optional[Dict[str, Any]] = None
    cookies: Optional[List[Dict[str, Any]]] = None
    robots_txt: Optional[Dict[str, Any]] = None
    sitemap: Optional[Dict[str, Any]] = None
    technologies: Optional[List[str]] = None
    recommendations: Optional[List[str]] = None

    model_config = {"from_attributes": True}


class ScanDetailResponse(BaseModel):
    """Schema for full scan detail including results."""
    id: int
    url: str
    security_score: Optional[int] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    scan_duration: Optional[float] = None
    result: Optional[ScanResultSchema] = None

    model_config = {"from_attributes": True}
