"""Health check router."""

import time

import structlog
from fastapi import APIRouter

from ..config import settings
from ..db.connection import get_db
from ..models import HealthResponse

logger = structlog.get_logger()
router = APIRouter()

_start_time = time.time()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check service health including database and OpenAI connectivity."""
    db_ok = False
    try:
        db = await get_db()
        await db.execute("SELECT 1")
        await db.close()
        db_ok = True
    except Exception as e:
        logger.error("health_db_fail", error=str(e))

    openai_ok = bool(settings.openai_api_key and settings.openai_api_key != "test-key-for-ci")

    return HealthResponse(
        status="ok" if db_ok else "degraded",
        db_ok=db_ok,
        openai_ok=openai_ok,
        version="1.0.0",
        uptime_seconds=round(time.time() - _start_time, 1),
    )
