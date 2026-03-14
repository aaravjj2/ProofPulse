"""Tests for feedback endpoint."""

import pytest



@pytest.mark.asyncio
async def test_submit_feedback(client, mock_llm):
    # First create an analysis
    create_resp = await client.post(
        "/api/v1/analyze/text",
        json={"text": "Suspicious message for feedback test"},
    )
    analysis_id = create_resp.json()["analysis_id"]

    # Submit feedback
    response = await client.post(
        "/api/v1/feedback",
        json={"analysis_id": analysis_id, "rating": 5, "comment": "Spot on!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "feedback_id" in data


@pytest.mark.asyncio
async def test_feedback_with_scam_flag(client, mock_llm):
    create_resp = await client.post(
        "/api/v1/analyze/text",
        json={"text": "Test for feedback"},
    )
    analysis_id = create_resp.json()["analysis_id"]

    response = await client.post(
        "/api/v1/feedback",
        json={
            "analysis_id": analysis_id,
            "rating": 4,
            "was_actually_scam": True,
        },
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_feedback_invalid_rating_too_low(client):
    response = await client.post(
        "/api/v1/feedback",
        json={"analysis_id": "test-id", "rating": 0},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_feedback_invalid_rating_too_high(client):
    response = await client.post(
        "/api/v1/feedback",
        json={"analysis_id": "test-id", "rating": 6},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_feedback_missing_analysis_id(client):
    response = await client.post(
        "/api/v1/feedback",
        json={"rating": 3},
    )
    assert response.status_code == 422
