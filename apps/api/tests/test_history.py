"""Tests for history endpoints."""

import pytest



@pytest.mark.asyncio
async def test_history_empty(client):
    response = await client.get("/api/v1/history")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["page"] == 1


@pytest.mark.asyncio
async def test_history_after_analysis(client, mock_llm):
    await client.post(
        "/api/v1/analyze/text",
        json={"text": "Test scam message for history"},
    )
    response = await client.get("/api/v1/history")
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    item = data["items"][0]
    assert "analysis_id" in item
    assert "created_at" in item
    assert item["input_type"] == "text"


@pytest.mark.asyncio
async def test_history_pagination(client, mock_llm):
    for i in range(5):
        await client.post(
            "/api/v1/analyze/text",
            json={"text": f"Test message {i}"},
        )
    response = await client.get("/api/v1/history?page=1&per_page=2")
    data = response.json()
    assert len(data["items"]) == 2
    assert data["total"] == 5
    assert data["page"] == 1


@pytest.mark.asyncio
async def test_history_get_single(client, mock_llm):
    # Create an analysis
    create_resp = await client.post(
        "/api/v1/analyze/text",
        json={"text": "Phishing test message"},
    )
    analysis_id = create_resp.json()["analysis_id"]

    # Retrieve it
    response = await client.get(f"/api/v1/history/{analysis_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["analysis_id"] == analysis_id


@pytest.mark.asyncio
async def test_history_not_found(client):
    response = await client.get("/api/v1/history/nonexistent-id")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_stats_empty(client):
    response = await client.get("/api/v1/history/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_analyses"] == 0
    assert data["avg_risk_score"] == 0.0


@pytest.mark.asyncio
async def test_stats_after_analyses(client, mock_llm):
    await client.post("/api/v1/analyze/text", json={"text": "Test 1"})
    await client.post("/api/v1/analyze/text", json={"text": "Test 2"})
    response = await client.get("/api/v1/history/stats")
    data = response.json()
    assert data["total_analyses"] == 2
