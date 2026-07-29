"""
ScanResult database model.
Stores the detailed results of a security scan as JSON fields.
"""

from sqlalchemy import Column, ForeignKey, Integer, JSON
from sqlalchemy.orm import relationship

from database.connection import Base


class ScanResult(Base):
    """Detailed scan result data stored as structured JSON."""

    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scan_id = Column(Integer, ForeignKey("scans.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Security check results (stored as JSON for flexibility)
    https_status = Column(JSON, nullable=True)       # {available, redirect, hsts}
    ssl_details = Column(JSON, nullable=True)         # {issuer, valid_from, valid_to, days_remaining, is_valid}
    security_headers = Column(JSON, nullable=True)    # {header_name: {present, value}}
    cookies = Column(JSON, nullable=True)             # [{name, secure, httponly, samesite}]
    robots_txt = Column(JSON, nullable=True)          # {exists, content_snippet}
    sitemap = Column(JSON, nullable=True)             # {exists, url}
    technologies = Column(JSON, nullable=True)        # ["React", "Nginx", ...]
    recommendations = Column(JSON, nullable=True)     # ["Enable HTTPS", ...]

    # Relationships
    scan = relationship("Scan", back_populates="result")

    def __repr__(self):
        return f"<ScanResult(id={self.id}, scan_id={self.scan_id})>"
