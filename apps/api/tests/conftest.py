"""Test configuration and fixtures."""

from __future__ import annotations

import os
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch, MagicMock
from src.db.connection import set_db_path
from src.db.migrate import run_migrations

# Use a test database
TEST_DB = "test_proofpulse.db"

MOCK_LLM_RESPONSE = {
    "risk_score": 85,
    "risk_level": "CRITICAL",
    "verdict": "This is a phishing attempt designed to steal credentials.",
    "confidence": 0.93,
    "evidence": [
        {"label": "Suspicious domain", "value": "fakepaypal.ru", "weight": 0.9, "flag": "red"},
        {"label": "Urgency language", "value": "act immediately", "weight": 0.8, "flag": "red"},
    ],
    "recommendations": ["Do not click any links", "Report as phishing"],
    "next_steps": ["Delete the message", "Report to FTC"],
    "reasoning_chain": "Clear phishing indicators present.",
    "model_used": "gpt-4o",
    "latency_ms": 1200,
}


@pytest.fixture(autouse=True)
def _setup_test_db():
    """Use test database for all tests, clean up after."""
    set_db_path(TEST_DB)
    yield
    if os.path.exists(TEST_DB):
        os.remove(TEST_DB)


@pytest_asyncio.fixture
async def client():
    """Async test client with migrations applied."""
    await run_migrations()
    from src.main import app
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.fixture
def mock_llm():
    """Mock the LLM analyze_content function."""
    with patch("src.routers.analyze.analyze_content", new_callable=AsyncMock) as mock:
        mock.return_value = MOCK_LLM_RESPONSE.copy()
        yield mock
