"""Routes package exports."""

from routes.auth import router as auth_router
from routes.user import router as user_router
from routes.scan import router as scan_router
from routes.history import router as history_router
from routes.report import router as report_router

__all__ = [
    "auth_router", "user_router", "scan_router",
    "history_router", "report_router",
]
