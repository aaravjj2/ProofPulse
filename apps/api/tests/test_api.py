"""Integration tests for the API endpoints."""

import pytest
from httpx import AsyncClient, ASGITransport
from apps.api.src.main import app


@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


class TestHealthEndpoint:
    @pytest.mark.asyncio
    async def test_health_returns_ok(self, client):
        async with client as c:
            response = await c.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestTextAnalysis:
    @pytest.mark.asyncio
    async def test_analyze_phishing_text(self, client):
        async with client as c:
            response = await c.post(
                "/api/v1/analyze/text",
                json={
                    "text": "URGENT: Your bank account has been locked. Verify your identity immediately!",
                    "source": "sms",
                },
            )
        assert response.status_code == 200
        data = response.json()
        assert "risk_score" in data
        assert "risk_label" in data
        assert "flags" in data
        assert data["risk_score"] > 30
        assert len(data["flags"]) > 0

    @pytest.mark.asyncio
    async def test_analyze_safe_text(self, client):
        async with client as c:
            response = await c.post(
                "/api/v1/analyze/text",
                json={
                    "text": "Hey, want to grab lunch this week? Let me know!",
                    "source": "chat",
                },
            )
        assert response.status_code == 200
        data = response.json()
        assert data["risk_score"] < 30

    @pytest.mark.asyncio
    async def test_empty_text_rejected(self, client):
        async with client as c:
            response = await c.post(
                "/api/v1/analyze/text",
                json={"text": ""},
            )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_response_schema(self, client):
        async with client as c:
            response = await c.post(
                "/api/v1/analyze/text",
                json={"text": "Click here to verify your password immediately!"},
            )
        data = response.json()
        required_keys = ["id", "risk_score", "risk_label", "category", "confidence",
                         "flags", "evidence", "explanation", "next_steps"]
        for key in required_keys:
            assert key in data, f"Missing key: {key}"
        assert isinstance(data["flags"], list)
        assert isinstance(data["evidence"], list)
        assert isinstance(data["next_steps"], list)
        assert 0 <= data["risk_score"] <= 100
        assert 0.0 <= data["confidence"] <= 1.0


class TestURLAnalysis:
    @pytest.mark.asyncio
    async def test_analyze_suspicious_url(self, client):
        async with client as c:
            response = await c.post(
                "/api/v1/analyze/url",
                json={"url": "https://secure-bankofamerica-login.tk/verify-account"},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["risk_score"] > 20
        assert len(data["flags"]) > 0

    @pytest.mark.asyncio
    async def test_analyze_safe_url(self, client):
        async with client as c:
            response = await c.post(
                "/api/v1/analyze/url",
                json={"url": "https://github.com/user/repo"},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["risk_score"] < 30

    @pytest.mark.asyncio
    async def test_invalid_url_rejected(self, client):
        async with client as c:
            response = await c.post(
                "/api/v1/analyze/url",
                json={"url": "not-a-url"},
            )
        assert response.status_code == 422


class TestHistoryEndpoint:
    @pytest.mark.asyncio
    async def test_history_returns_list(self, client):
        async with client as c:
            response = await c.get("/api/v1/history")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestFeedbackEndpoint:
    @pytest.mark.asyncio
    async def test_submit_feedback(self, client):
        # First, create an analysis
        async with client as c:
            analysis = await c.post(
                "/api/v1/analyze/text",
                json={"text": "Test message for feedback"},
            )
            analysis_id = analysis.json()["id"]

            response = await c.post(
                "/api/v1/feedback",
                json={
                    "analysis_id": analysis_id,
                    "rating": "accurate",
                    "note": "Spot on!",
                },
            )
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
