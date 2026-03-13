"""ProofPulse API entry point."""

from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import analyze, health, history, feedback

load_dotenv()

app = FastAPI(
    title="ProofPulse API",
    description="AI-powered scam and threat analysis API",
    version="0.1.0",
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(analyze.router, prefix="/api/v1")
app.include_router(history.router, prefix="/api/v1")
app.include_router(feedback.router, prefix="/api/v1")
