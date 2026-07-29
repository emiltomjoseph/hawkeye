"""
HawkEye - Web Security Assessment Platform
Main application entry point.

Start with: uvicorn main:app --reload
Swagger UI: http://localhost:8000/docs
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings
from database import create_tables
from middleware.cors import setup_cors
from middleware.rate_limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Import all models so they are registered with Base.metadata
import models  # noqa: F401

from routes import auth_router, user_router, scan_router, history_router, report_router

settings = get_settings()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager — runs startup and shutdown logic."""
    # Startup
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    await create_tables()
    logger.info("Database tables created successfully")
    yield
    # Shutdown
    logger.info(f"Shutting down {settings.app_name}")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description=(
        "HawkEye is a web security assessment platform that analyzes "
        "websites for common security weaknesses and provides actionable "
        "recommendations. Scan any public website and receive a detailed "
        "security report with scoring."
    ),
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Setup Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Setup CORS
setup_cors(app)

# Include API routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(scan_router)
app.include_router(history_router)
app.include_router(report_router)


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """API health check endpoint."""
    return {"status": "healthy"}
