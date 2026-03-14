"""Tests for LLM analyzer fallback logic and validation."""

import pytest
from src.services.llm_analyzer import (
    _fallback_analysis,
    _score_to_level,
    _validate_and_normalize,
    _generate_verdict,
    analyze_content,
)


class TestFallbackAnalysis:
    def test_high_risk_content(self):
        result = _fallback_analysis("URGENT: Click here to verify your password immediately!")
        assert result["risk_score"] >= 30
        assert result["risk_level"] in ("MEDIUM", "HIGH", "CRITICAL")
        assert len(result["evidence"]) > 0

    def test_safe_content(self):
        result = _fallback_analysis("Hey, want to grab lunch tomorrow?")
        assert result["risk_score"] <= 20
        assert result["risk_level"] == "SAFE"

    def test_financial_request_detected(self):
        result = _fallback_analysis("Please send your credit card number to verify payment")
        assert result["risk_score"] >= 20
        assert any(e["flag"] == "red" for e in result["evidence"])

    def test_safe_indicators_reduce_score(self):
        result = _fallback_analysis("Click here. Unsubscribe from this email. Privacy policy.")
        # The "unsubscribe" and "privacy policy" should reduce score
        safe_evidence = [e for e in result["evidence"] if e["flag"] == "green"]
        assert len(safe_evidence) > 0

    def test_returns_all_required_fields(self):
        result = _fallback_analysis("Test content")
        required = ["risk_score", "risk_level", "verdict", "confidence",
                     "evidence", "recommendations", "next_steps", "model_used", "latency_ms"]
        for field in required:
            assert field in result, f"Missing field: {field}"

    def test_model_used_is_fallback(self):
        result = _fallback_analysis("Test")
        assert result["model_used"] == "heuristic-fallback"


class TestScoreToLevel:
    def test_safe(self):
        assert _score_to_level(10) == "SAFE"

    def test_low(self):
        assert _score_to_level(30) == "LOW"

    def test_medium(self):
        assert _score_to_level(50) == "MEDIUM"

    def test_high(self):
        assert _score_to_level(70) == "HIGH"

    def test_critical(self):
        assert _score_to_level(90) == "CRITICAL"

    def test_boundary_20(self):
        assert _score_to_level(20) == "SAFE"

    def test_boundary_21(self):
        assert _score_to_level(21) == "LOW"

    def test_boundary_80(self):
        assert _score_to_level(80) == "HIGH"

    def test_boundary_81(self):
        assert _score_to_level(81) == "CRITICAL"


class TestValidateAndNormalize:
    def test_clamps_risk_score_high(self):
        result = _validate_and_normalize(
            {"risk_score": 150, "risk_level": "CRITICAL", "verdict": "Bad",
             "confidence": 0.9, "evidence": [], "recommendations": [], "next_steps": []},
            100, "gpt-4o"
        )
        assert result["risk_score"] == 100

    def test_clamps_risk_score_low(self):
        result = _validate_and_normalize(
            {"risk_score": -10, "verdict": "Safe", "confidence": 0.5,
             "evidence": [], "recommendations": [], "next_steps": []},
            50, "gpt-4o"
        )
        assert result["risk_score"] == 0

    def test_enforces_risk_level_consistency(self):
        result = _validate_and_normalize(
            {"risk_score": 90, "risk_level": "SAFE", "verdict": "Bad",
             "confidence": 0.9, "evidence": [], "recommendations": [], "next_steps": []},
            50, "gpt-4o"
        )
        assert result["risk_level"] == "CRITICAL"

    def test_validates_evidence_items(self):
        result = _validate_and_normalize(
            {"risk_score": 50, "verdict": "Test",
             "confidence": 0.7,
             "evidence": [
                 {"label": "Test", "value": "Detail", "weight": 0.8, "flag": "red"},
                 {"invalid": "no label"},
              ],
             "recommendations": ["R1"], "next_steps": ["S1"]},
            50, "gpt-4o"
        )
        assert len(result["evidence"]) == 1

    def test_clamps_confidence(self):
        result = _validate_and_normalize(
            {"risk_score": 50, "verdict": "Test", "confidence": 5.0,
             "evidence": [], "recommendations": [], "next_steps": []},
            50, "gpt-4o"
        )
        assert result["confidence"] == 1.0

    def test_invalid_flag_defaults_to_yellow(self):
        result = _validate_and_normalize(
            {"risk_score": 50, "verdict": "Test", "confidence": 0.5,
             "evidence": [{"label": "Test", "value": "V", "weight": 0.5, "flag": "blue"}],
             "recommendations": [], "next_steps": []},
            50, "gpt-4o"
        )
        assert result["evidence"][0]["flag"] == "yellow"

    def test_missing_fields_use_defaults(self):
        result = _validate_and_normalize({}, 50, "gpt-4o")
        assert result["risk_score"] == 50
        assert result["verdict"] == "Analysis complete."
        assert result["model_used"] == "gpt-4o"


class TestGenerateVerdict:
    def test_critical(self):
        verdict = _generate_verdict(95, "CRITICAL")
        assert "scam" in verdict.lower() or "phishing" in verdict.lower()

    def test_high(self):
        verdict = _generate_verdict(70, "HIGH")
        assert "caution" in verdict.lower() or "indicators" in verdict.lower()

    def test_medium(self):
        verdict = _generate_verdict(50, "MEDIUM")
        assert "suspicious" in verdict.lower() or "verify" in verdict.lower()

    def test_low(self):
        verdict = _generate_verdict(30, "LOW")
        assert "minor" in verdict.lower() or "verify" in verdict.lower()

    def test_safe(self):
        verdict = _generate_verdict(5, "SAFE")
        assert "safe" in verdict.lower()


class TestAnalyzeContentFallback:
    @pytest.mark.asyncio
    async def test_fallback_when_no_api_key(self):
        """Without a real API key, analyze_content should use fallback."""
        result = await analyze_content("URGENT: Verify your password now!")
        assert "risk_score" in result
        assert result["model_used"] == "heuristic-fallback"

    @pytest.mark.asyncio
    async def test_fallback_has_suspicious_link(self):
        result = await analyze_content("Click here: amaz0n-secure.verify-account.ru/login")
        assert result["risk_score"] >= 20
