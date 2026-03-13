"""Tests for Pydantic models / types."""

import pytest
from pydantic import ValidationError
from apps.api.src.types.analysis import (
    TextAnalysisRequest,
    URLAnalysisRequest,
    AnalysisResponse,
    FeedbackRequest,
    Evidence,
    RiskLabel,
    ThreatCategory,
    SourceType,
    FeedbackRating,
)


class TestTextAnalysisRequest:
    def test_valid_request(self):
        req = TextAnalysisRequest(text="Hello world", source="email")
        assert req.text == "Hello world"
        assert req.source == SourceType.EMAIL

    def test_strips_whitespace(self):
        req = TextAnalysisRequest(text="  Hello  ")
        assert req.text == "Hello"

    def test_rejects_empty_text(self):
        with pytest.raises(ValidationError):
            TextAnalysisRequest(text="")

    def test_rejects_whitespace_only(self):
        with pytest.raises(ValidationError):
            TextAnalysisRequest(text="   ")

    def test_default_source(self):
        req = TextAnalysisRequest(text="Test")
        assert req.source == SourceType.OTHER

    def test_default_locale(self):
        req = TextAnalysisRequest(text="Test")
        assert req.locale == "en-US"


class TestURLAnalysisRequest:
    def test_valid_url(self):
        req = URLAnalysisRequest(url="https://example.com")
        assert req.url == "https://example.com"

    def test_www_url(self):
        req = URLAnalysisRequest(url="www.example.com")
        assert req.url == "www.example.com"

    def test_rejects_invalid_url(self):
        with pytest.raises(ValidationError):
            URLAnalysisRequest(url="not-a-url")

    def test_rejects_empty_url(self):
        with pytest.raises(ValidationError):
            URLAnalysisRequest(url="")


class TestAnalysisResponse:
    def test_valid_response(self):
        resp = AnalysisResponse(
            id="abc-123",
            risk_score=50,
            risk_label=RiskLabel.MEDIUM,
            category=ThreatCategory.PHISHING,
            confidence=0.75,
            flags=["flag1"],
            evidence=[Evidence(type="phrase", value="test", reason="test")],
            explanation="Test explanation",
            next_steps=["Step 1"],
        )
        assert resp.risk_score == 50
        assert resp.risk_label == RiskLabel.MEDIUM

    def test_score_range_validation(self):
        with pytest.raises(ValidationError):
            AnalysisResponse(
                id="test",
                risk_score=101,
                risk_label=RiskLabel.CRITICAL,
                category=ThreatCategory.PHISHING,
                confidence=0.5,
            )

    def test_confidence_range(self):
        with pytest.raises(ValidationError):
            AnalysisResponse(
                id="test",
                risk_score=50,
                risk_label=RiskLabel.MEDIUM,
                category=ThreatCategory.PHISHING,
                confidence=1.5,
            )


class TestFeedbackRequest:
    def test_valid_feedback(self):
        req = FeedbackRequest(analysis_id="abc", rating="accurate")
        assert req.rating == FeedbackRating.ACCURATE

    def test_with_note(self):
        req = FeedbackRequest(analysis_id="abc", rating="inaccurate", note="Got it wrong")
        assert req.note == "Got it wrong"

    def test_rejects_empty_id(self):
        with pytest.raises(ValidationError):
            FeedbackRequest(analysis_id="", rating="accurate")
