"""
Scan database model.
Represents a security scan initiated by a user for a given URL.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database.connection import Base


class Scan(Base):
    """Security scan record."""

    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String(2048), nullable=False)
    security_score = Column(Integer, nullable=True)
    status = Column(String(20), default="pending", nullable=False)  # pending | scanning | completed | failed
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)
    scan_duration = Column(Float, nullable=True)  # Duration in seconds

    # Relationships
    user = relationship("User", back_populates="scans")
    result = relationship("ScanResult", back_populates="scan", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Scan(id={self.id}, url='{self.url}', status='{self.status}')>"
