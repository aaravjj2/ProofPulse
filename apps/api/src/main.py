"""ProofPulse API entry point."""

from __future__ import annotations

import uuid
import time
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .db.migrate import run_migrations
from .routers import analyze, health, history, feedback


LOG_LEVELS = {"DEBUG": 0, "INFO": 10, "WARNING": 20, "ERROR": 30, "CRITICAL": 40}

structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.dev.ConsoleRenderer(),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(
        LOG_LEVELS.get(settings.log_level.upper(), 10)
    ),
)

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run migrations on startup."""
    logger.info("startup", environment=settings.environment)
    await run_migrations()
    yield
    logger.info("shutdown")


app = FastAPI(
    title="ProofPulse API",
    description="AI-powered scam and threat analysis API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Latency-Ms"],
)


# Request ID + Logging + Latency middleware
@app.middleware("http")
async def request_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start = time.time()

    logger.info(
        "request_start",
        method=request.method,
        path=request.url.path,
        request_id=request_id,
    )

    try:
        response = await call_next(request)
    except Exception as e:
        logger.error("request_error", error=str(e), request_id=request_id)
        return JSONResponse(
            status_code=500,
            content={
                "code": 500,
                "message": "Internal server error",
                "request_id": request_id,
            },
        )

    latency_ms = int((time.time() - start) * 1000)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Latency-Ms"] = str(latency_ms)

    logger.info(
        "request_end",
        status=response.status_code,
        latency_ms=latency_ms,
        request_id=request_id,
    )

    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = request.headers.get("X-Request-ID", "unknown")
    logger.error("unhandled_exception", error=str(exc), request_id=request_id)
    return JSONResponse(
        status_code=500,
        content={
            "code": 500,
            "message": "An unexpected error occurred",
            "request_id": request_id,
        },
    )


# Mount routers
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(analyze.router, prefix="/api/v1", tags=["analyze"])
app.include_router(history.router, prefix="/api/v1", tags=["history"])
app.include_router(feedback.router, prefix="/api/v1", tags=["feedback"])
