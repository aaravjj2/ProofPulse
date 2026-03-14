"""Tests for Pydantic models."""

import pytest
from pydantic import ValidationError
from src.models import (
    TextAnalysisRequest,
    URLAnalysisRequest,
    ScenarioAnalysisRequest,
    FeedbackRequest,
    EvidenceItem,
    AnalysisResponse,
)


class TestTextAnalysisRequest:
    def test_valid_request(self):
        req = TextAnalysisRequest(text="Test message")
        assert req.text == "Test message"

    def test_strips_whitespace(self):
        req = TextAnalysisRequest(text="  hello  ")
        assert req.text == "hello"

    def test_rejects_empty(self):
        with pytest.raises(ValidationError):
            TextAnalysisRequest(text="")

    def test_rejects_whitespace_only(self):
        with pytest.raises(ValidationError):
            TextAnalysisRequest(text="   ")

    def test_default_context(self):
        req = TextAnalysisRequest(text="Test")
        assert req.context is None

    def test_with_context(self):
        req = TextAnalysisRequest(text="Test", context="Via SMS")
        assert req.context == "Via SMS"


class TestURLAnalysisRequest:
    def test_valid_http(self):
        req = URLAnalysisRequest(url="https://example.com")
        assert req.url == "https://example.com"

    def test_valid_http_unsecure(self):
        req = URLAnalysisRequest(url="http://example.com")
        assert req.url == "http://example.com"

    def test_rejects_invalid(self):
        with pytest.raises(ValidationError):
            URLAnalysisRequest(url="not-a-url")

    def test_rejects_ftp(self):
        with pytest.raises(ValidationError):
            URLAnalysisRequest(url="ftp://example.com")

    def test_default_follow_redirects(self):
        req = URLAnalysisRequest(url="https://example.com")
        assert req.follow_redirects is True


class TestScenarioAnalysisRequest:
    def test_text_only(self):
        req = ScenarioAnalysisRequest(text="Test")
        assert req.text == "Test"

    def test_url_only(self):
        req = ScenarioAnalysisRequest(url="https://test.com")
        assert req.url == "https://test.com"

    def test_rejects_empty(self):
        with pytest.raises(ValidationError):
            ScenarioAnalysisRequest()

    def test_combined(self):
        req = ScenarioAnalysisRequest(text="Click here", url="https://phish.tk")
        assert req.text == "Click here"
        assert req.url == "https://phish.tk"


class TestFeedbackRequest:
    def test_valid(self):
        req = FeedbackRequest(analysis_id="test-123", rating=4)
        assert req.rating == 4

    def test_with_comment(self):
        req = FeedbackRequest(analysis_id="test", rating=5, comment="Great!")
        assert req.comment == "Great!"

    def test_rejects_low_rating(self):
        with pytest.raises(ValidationError):
            FeedbackRequest(analysis_id="test", rating=0)

    def test_rejects_high_rating(self):
        with pytest.raises(ValidationError):
            FeedbackRequest(analysis_id="test", rating=6)

    def test_rejects_empty_id(self):
        with pytest.raises(ValidationError):
            FeedbackRequest(analysis_id="", rating=3)


class TestEvidenceItem:
    def test_valid(self):
        item = EvidenceItem(label="Test", value="Details", weight=0.8, flag="red")
        assert item.flag == "red"

    def test_weight_bounds(self):
        with pytest.raises(ValidationError):
            EvidenceItem(label="Test", value="V", weight=1.5, flag="red")

    def test_invalid_flag(self):
        with pytest.raises(ValidationError):
            EvidenceItem(label="Test", value="V", weight=0.5, flag="blue")
