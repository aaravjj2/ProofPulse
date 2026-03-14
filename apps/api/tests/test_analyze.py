"""Tests for analysis endpoints."""

import pytest

from conftest import MOCK_LLM_RESPONSE

@pytest.mark.asyncio
async def test_analyze_text_returns_result(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/text",
        json={"text": "URGENT: Your account has been suspended. Click here to verify."},
    )
    assert response.status_code == 200
    data = response.json()
    assert "analysis_id" in data
    assert data["risk_score"] == 85
    assert data["risk_level"] == "CRITICAL"
    assert data["input_type"] == "text"
    assert len(data["evidence"]) > 0
    assert len(data["recommendations"]) > 0


@pytest.mark.asyncio
async def test_analyze_text_with_context(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/text",
        json={"text": "Click here for a prize!", "context": "Received via SMS"},
    )
    assert response.status_code == 200
    mock_llm.assert_called_once()


@pytest.mark.asyncio
async def test_analyze_text_empty_rejected(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/text",
        json={"text": ""},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyze_text_whitespace_only_rejected(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/text",
        json={"text": "   "},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyze_text_response_schema(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/text",
        json={"text": "Test message for analysis"},
    )
    data = response.json()
    required_fields = ["analysis_id", "risk_score", "risk_level", "verdict",
                       "evidence", "recommendations", "next_steps",
                       "confidence", "model_used", "latency_ms", "input_type"]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"


@pytest.mark.asyncio
async def test_analyze_text_has_request_id_header(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/text",
        json={"text": "Test message"},
    )
    assert "x-request-id" in response.headers


@pytest.mark.asyncio
async def test_analyze_url_valid(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/url",
        json={"url": "https://secure-chase-verify.tk/login"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["input_type"] == "url"
    assert "analysis_id" in data


@pytest.mark.asyncio
async def test_analyze_url_invalid_rejected(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/url",
        json={"url": "not-a-url"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyze_url_safe_site(client, mock_llm):
    mock_llm.return_value = {
        **MOCK_LLM_RESPONSE,
        "risk_score": 5,
        "risk_level": "SAFE",
        "verdict": "This appears to be a legitimate website.",
    }
    response = await client.post(
        "/api/v1/analyze/url",
        json={"url": "https://www.google.com"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_analyze_image_no_file_rejected(client, mock_llm):
    response = await client.post("/api/v1/analyze/image")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyze_image_wrong_type_rejected(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/image",
        files={"file": ("test.txt", b"not an image", "text/plain")},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_analyze_scenario_text_only(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/scenario",
        json={"text": "You won a prize! Send your SSN to claim."},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["input_type"] == "scenario"


@pytest.mark.asyncio
async def test_analyze_scenario_url_only(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/scenario",
        json={"url": "https://phishing.tk/login"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_analyze_scenario_no_input_rejected(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/scenario",
        json={},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyze_scenario_combined(client, mock_llm):
    response = await client.post(
        "/api/v1/analyze/scenario",
        json={
            "text": "Verify your account",
            "url": "https://verify-bank.tk",
            "context": "Received via email",
        },
    )
    assert response.status_code == 200
