"""Risk scoring service that combines heuristic and LLM signals."""

from __future__ import annotations

from ...types.analysis import RiskLabel


def calculate_risk_score(heuristic_score: int, llm_confidence: float) -> int:
    """Combine heuristic score with LLM confidence for final risk score.

    Heuristic score is weighted at 60%, LLM at 40%, to keep the system
    rules-first with LLM as augmentation.
    """
    llm_score_component = llm_confidence * 100
    combined = int(heuristic_score * 0.6 + llm_score_component * 0.4)
    return max(0, min(100, combined))


def get_risk_label(score: int) -> RiskLabel:
    """Map score to risk bucket label."""
    if score <= 15:
        return RiskLabel.SAFE
    if score <= 35:
        return RiskLabel.LOW
    if score <= 60:
        return RiskLabel.MEDIUM
    if score <= 80:
        return RiskLabel.HIGH
    return RiskLabel.CRITICAL


def calculate_confidence(
    heuristic_flag_count: int,
    llm_confidence: float,
    has_url_signals: bool = False,
) -> float:
    """Calculate overall confidence based on multiple signals."""
    base = 0.5

    # More heuristic flags = more confidence in detection
    flag_boost = min(heuristic_flag_count * 0.05, 0.25)

    # LLM confidence contribution
    llm_boost = llm_confidence * 0.2

    # URL signals add confidence
    url_boost = 0.05 if has_url_signals else 0.0

    confidence = base + flag_boost + llm_boost + url_boost
    return round(min(confidence, 0.99), 2)
