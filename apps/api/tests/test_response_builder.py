"""Tests for the response builder service."""

import pytest
from apps.api.src.services.response_builder.builder import build_response
from apps.api.src.types.analysis import Evidence, RiskLabel, ThreatCategory


class TestBuildResponse:
    def test_basic_response(self):
        result = build_response(
            analysis_id="test-123",
            risk_score=75,
            risk_label=RiskLabel.HIGH,
            category_hint="phishing",
            confidence=0.85,
            flags=["urgent action", "credential request"],
            evidence=[
                Evidence(type="phrase", value="verify now", reason="urgency"),
            ],
            explanation="This is suspicious.",
            next_steps=["Don't click links"],
        )
        assert result.id == "test-123"
        assert result.risk_score == 75
        assert result.risk_label == RiskLabel.HIGH
        assert result.category == ThreatCategory.PHISHING
        assert result.confidence == 0.85
        assert len(result.flags) == 2
        assert len(result.evidence) == 1
        assert result.explanation == "This is suspicious."

    def test_deduplicates_flags(self):
        result = build_response(
            analysis_id="test-456",
            risk_score=50,
            risk_label=RiskLabel.MEDIUM,
            category_hint="safe",
            confidence=0.6,
            flags=["urgency", "urgency", "credential request", "urgency"],
            evidence=[],
            explanation="Test",
            next_steps=[],
        )
        assert len(result.flags) == 2
        assert result.flags == ["urgency", "credential request"]

    def test_truncates_flags_to_8(self):
        flags = [f"flag_{i}" for i in range(15)]
        result = build_response(
            analysis_id="test-789",
            risk_score=80,
            risk_label=RiskLabel.HIGH,
            category_hint="phishing",
            confidence=0.9,
            flags=flags,
            evidence=[],
            explanation="Test",
            next_steps=[],
        )
        assert len(result.flags) <= 8

    def test_truncates_evidence_to_10(self):
        evidence = [
            Evidence(type="test", value=f"val_{i}", reason=f"reason_{i}")
            for i in range(15)
        ]
        result = build_response(
            analysis_id="test-101",
            risk_score=60,
            risk_label=RiskLabel.MEDIUM,
            category_hint="phishing",
            confidence=0.7,
            flags=[],
            evidence=evidence,
            explanation="Test",
            next_steps=[],
        )
        assert len(result.evidence) <= 10

    def test_unknown_category(self):
        result = build_response(
            analysis_id="test-unknown",
            risk_score=30,
            risk_label=RiskLabel.LOW,
            category_hint="nonexistent_category",
            confidence=0.5,
            flags=[],
            evidence=[],
            explanation="Test",
            next_steps=[],
        )
        assert result.category == ThreatCategory.UNKNOWN

    def test_ocr_fields(self):
        result = build_response(
            analysis_id="test-ocr",
            risk_score=40,
            risk_label=RiskLabel.MEDIUM,
            category_hint="phishing",
            confidence=0.6,
            flags=[],
            evidence=[],
            explanation="OCR test",
            next_steps=[],
            ocr_text="Extracted text from image",
            ocr_confidence=0.85,
        )
        assert result.ocr_text == "Extracted text from image"
        assert result.ocr_confidence == 0.85

    def test_safe_reply_optional(self):
        result = build_response(
            analysis_id="test-safe",
            risk_score=10,
            risk_label=RiskLabel.SAFE,
            category_hint="safe",
            confidence=0.9,
            flags=[],
            evidence=[],
            explanation="Looks safe.",
            next_steps=[],
        )
        assert result.safe_reply is None

        result_with_reply = build_response(
            analysis_id="test-reply",
            risk_score=70,
            risk_label=RiskLabel.HIGH,
            category_hint="phishing",
            confidence=0.8,
            flags=[],
            evidence=[],
            explanation="Suspicious.",
            next_steps=[],
            safe_reply="I will verify through official channels.",
        )
        assert result_with_reply.safe_reply is not None
