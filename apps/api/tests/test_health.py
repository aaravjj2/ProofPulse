"""Tests for health endpoint."""

import pytest


@pytest.mark.asyncio
async def test_health_returns_200(client):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("ok", "degraded")
    assert "db_ok" in data
    assert "openai_ok" in data
    assert "version" in data
    assert "uptime_seconds" in data


@pytest.mark.asyncio
async def test_health_checks_db(client):
    response = await client.get("/api/v1/health")
    data = response.json()
    assert data["db_ok"] is True


@pytest.mark.asyncio
async def test_health_version(client):
    response = await client.get("/api/v1/health")
    data = response.json()
    assert data["version"] == "1.0.0"
