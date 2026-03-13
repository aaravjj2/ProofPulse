"""Tests for the analysis pipeline."""

import pytest
from apps.api.src.services.pipeline import (
    run_text_analysis,
    run_url_analysis,
    run_scenario_analysis,
)


class TestTextPipeline:
    @pytest.mark.asyncio
    async def test_phishing_text_high_risk(self):
        result = await run_text_analysis(
            "test-1",
            "URGENT: Your account is locked! Verify your password now! Click here immediately!",
            "sms",
        )
        assert result.risk_score > 30
        assert len(result.flags) >= 2
        assert result.explanation != ""
        assert len(result.next_steps) > 0

    @pytest.mark.asyncio
    async def test_safe_text_low_risk(self):
        result = await run_text_analysis(
            "test-2",
            "Hey, how are you? Want to grab coffee tomorrow?",
            "chat",
        )
        assert result.risk_score < 40

    @pytest.mark.asyncio
    async def test_job_scam_detection(self):
        result = await run_text_analysis(
            "test-3",
            "No experience needed! Earn $50/hour working from home. Pay the $99 training fee to start. Hired immediately!",
            "email",
        )
        assert result.risk_score > 30
        assert len(result.flags) >= 2

    @pytest.mark.asyncio
    async def test_returns_valid_id(self):
        result = await run_text_analysis("my-id", "Test message", "other")
        assert result.id == "my-id"


class TestURLPipeline:
    @pytest.mark.asyncio
    async def test_suspicious_url(self):
        result = await run_url_analysis(
            "url-1",
            "https://secure-chase-verify.tk/login",
            "banking",
        )
        assert result.risk_score > 20
        assert len(result.flags) >= 1

    @pytest.mark.asyncio
    async def test_safe_url(self):
        result = await run_url_analysis(
            "url-2",
            "https://github.com",
            "other",
        )
        assert result.risk_score < 40


class TestScenarioPipeline:
    @pytest.mark.asyncio
    async def test_text_and_url_combined(self):
        result = await run_scenario_analysis(
            "scenario-1",
            "phishing",
            text="Verify your bank account now!",
            url="https://fake-bank.tk/verify",
        )
        assert result.risk_score > 20
        assert len(result.flags) >= 1

    @pytest.mark.asyncio
    async def test_text_only_scenario(self):
        result = await run_scenario_analysis(
            "scenario-2",
            "job_scam",
            text="No experience needed! Earn $100/day!",
        )
        assert result.risk_score > 20
