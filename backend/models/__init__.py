"""Models package — import all models so Base.metadata can discover them."""

from models.user import User
from models.scan import Scan
from models.scan_result import ScanResult

__all__ = ["User", "Scan", "ScanResult"]
