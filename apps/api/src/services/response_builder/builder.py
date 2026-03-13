"""Response builder service that assembles final AnalysisResponse."""

from __future__ import annotations

from datetime import datetime

from ...types.analysis import (
    AnalysisResponse,
    Evidence,
    RiskLabel,
    ThreatCategory,
)


CATEGORY_MAP = {
    "phishing": ThreatCategory.PHISHING,
    "job_scam": ThreatCategory.JOB_SCAM,
    "payment_scam": ThreatCategory.PAYMENT_SCAM,
    "impersonation": ThreatCategory.IMPERSONATION,
    "misinformation": ThreatCategory.MISINFORMATION,
    "malware": ThreatCategory.MALWARE,
    "social_engineering": ThreatCategory.SOCIAL_ENGINEERING,
    "safe": ThreatCategory.SAFE,
}


def build_response(
    analysis_id: str,
    risk_score: int,
    risk_label: RiskLabel,
    category_hint: str,
    confidence: float,
    flags: list[str],
    evidence: list[Evidence],
    explanation: str,
    next_steps: list[str],
    safe_reply: str | None = None,
    normalized_text: str | None = None,
    ocr_text: str | None = None,
    ocr_confidence: float | None = None,
) -> AnalysisResponse:
    """Build the final analysis response, deduplicating flags."""
    # Deduplicate flags while preserving order
    seen_flags: set[str] = set()
    unique_flags: list[str] = []
    for flag in flags:
        if flag not in seen_flags:
            seen_flags.add(flag)
            unique_flags.append(flag)

    category = CATEGORY_MAP.get(category_hint, ThreatCategory.UNKNOWN)

    return AnalysisResponse(
        id=analysis_id,
        risk_score=risk_score,
        risk_label=risk_label,
        category=category,
        confidence=confidence,
        flags=unique_flags[:8],
        evidence=evidence[:10],
        explanation=explanation,
        next_steps=next_steps[:6],
        safe_reply=safe_reply,
        normalized_text=normalized_text,
        ocr_text=ocr_text,
        ocr_confidence=ocr_confidence,
        timestamp=datetime.utcnow(),
    )
