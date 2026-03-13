"""Tests for scoring service."""

import pytest
from apps.api.src.services.scoring.scorer import (
    calculate_risk_score,
    get_risk_label,
    calculate_confidence,
)
from apps.api.src.types.analysis import RiskLabel


class TestCalculateRiskScore:
    def test_zero_inputs(self):
        assert calculate_risk_score(0, 0.0) == 0

    def test_max_inputs(self):
        score = calculate_risk_score(100, 1.0)
        assert score == 100

    def test_weighted_combination(self):
        # 50 * 0.6 + (0.8 * 100) * 0.4 = 30 + 32 = 62
        assert calculate_risk_score(50, 0.8) == 62

    def test_clamped_to_100(self):
        assert calculate_risk_score(100, 1.0) <= 100

    def test_clamped_to_0(self):
        assert calculate_risk_score(0, 0.0) >= 0


class TestGetRiskLabel:
    def test_safe(self):
        assert get_risk_label(0) == RiskLabel.SAFE
        assert get_risk_label(15) == RiskLabel.SAFE

    def test_low(self):
        assert get_risk_label(16) == RiskLabel.LOW
        assert get_risk_label(35) == RiskLabel.LOW

    def test_medium(self):
        assert get_risk_label(36) == RiskLabel.MEDIUM
        assert get_risk_label(60) == RiskLabel.MEDIUM

    def test_high(self):
        assert get_risk_label(61) == RiskLabel.HIGH
        assert get_risk_label(80) == RiskLabel.HIGH

    def test_critical(self):
        assert get_risk_label(81) == RiskLabel.CRITICAL
        assert get_risk_label(100) == RiskLabel.CRITICAL


class TestCalculateConfidence:
    def test_base_confidence(self):
        conf = calculate_confidence(0, 0.0)
        assert conf == 0.5

    def test_flags_boost(self):
        conf = calculate_confidence(5, 0.0)
        assert conf > 0.5

    def test_llm_boost(self):
        conf = calculate_confidence(0, 0.9)
        assert conf > 0.5

    def test_url_boost(self):
        conf_no_url = calculate_confidence(3, 0.7)
        conf_with_url = calculate_confidence(3, 0.7, has_url_signals=True)
        assert conf_with_url > conf_no_url

    def test_capped_at_099(self):
        conf = calculate_confidence(20, 1.0, has_url_signals=True)
        assert conf <= 0.99

    def test_returns_float(self):
        conf = calculate_confidence(3, 0.5)
        assert isinstance(conf, float)
