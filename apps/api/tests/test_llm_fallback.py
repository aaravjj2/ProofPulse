"""Tests for the LLM analyzer fallback logic."""

import pytest
from apps.api.src.services.llm.analyzer import _fallback_analysis


class TestFallbackAnalysis:
    def test_high_score_returns_phishing_category(self):
        result = _fallback_analysis(
            "Urgent verify your account",
            70,
            ["urgency", "credential request"],
        )
        assert result.category_suggestion == "phishing"
        assert "scam" in result.explanation.lower() or "phishing" in result.explanation.lower()
        assert len(result.next_steps) >= 3
        assert result.safe_reply is not None

    def test_medium_score_returns_caution(self):
        result = _fallback_analysis(
            "Please confirm your details",
            40,
            ["verification demand"],
        )
        assert result.category_suggestion == "social_engineering"
        assert "caution" in result.explanation.lower() or "suspicious" in result.explanation.lower()
        assert result.safe_reply is not None

    def test_low_score_returns_safe(self):
        result = _fallback_analysis(
            "Hey, want to grab lunch?",
            5,
            [],
        )
        assert result.category_suggestion == "safe"
        assert result.safe_reply is None

    def test_confidence_varies_by_score(self):
        low = _fallback_analysis("Hello", 10, [])
        high = _fallback_analysis("URGENT!", 70, ["urgency"])
        assert low.confidence_adjustment < high.confidence_adjustment

    def test_flags_in_explanation(self):
        result = _fallback_analysis(
            "Test",
            65,
            ["urgency", "credential request", "click bait"],
        )
        assert "urgency" in result.explanation.lower() or "credential" in result.explanation.lower()
