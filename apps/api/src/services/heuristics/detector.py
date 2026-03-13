"""Heuristic-based scam detection service.

Uses pattern matching and rule-based scoring to detect scam signals
without requiring LLM calls. This is the first layer of analysis.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from ...types.analysis import Evidence


@dataclass(frozen=True)
class HeuristicResult:
    score: int
    flags: list[str]
    evidence: list[Evidence]
    category_hint: str


# Patterns that indicate phishing / scam language
URGENCY_PATTERNS = [
    (r"\b(urgent|immediately|right\s+now|act\s+fast|don.t\s+delay|expires?\s+today)\b", "urgent action pressure"),
    (r"\b(verify\s+(your|now)|confirm\s+(your|now)|validate\s+(your|now))\b", "verification demand"),
    (r"\b(account\s+(?:\w+\s+)*(suspend|lock|restrict|clos|terminat|compromis)\w*)\b", "account threat"),
    (r"\b(click\s+(here|below|this\s+link|now))\b", "click bait directive"),
    (r"\b(limited\s+time|last\s+chance|final\s+warning|final\s+notice)\b", "scarcity pressure"),
]

CREDENTIAL_PATTERNS = [
    (r"\b(password|login|credential|ssn|social\s+security|bank\s+account)\b", "credential request"),
    (r"\b(credit\s+card|debit\s+card|card\s+number|cvv|pin\s+number)\b", "financial data request"),
    (r"\b(wire\s+transfer|western\s+union|money\s+gram|bitcoin|crypto)\b", "unusual payment method"),
]

JOB_SCAM_PATTERNS = [
    (r"\b(no\s+experience\s+(needed|required)|work\s+from\s+home)\b", "too-good-to-be-true offer"),
    (r"\b(guaranteed\s+(income|salary|pay)|earn\s+\$?\d+.*(per|a)\s+(day|hour|week))\b", "unrealistic pay promise"),
    (r"\b(upfront\s+(fee|payment|cost)|pay\s+(to\s+)?start|training\s+fee)\b", "upfront fee request"),
    (r"\b(immediate\s+(hire|start|hiring)|hired\s+(immediately|instantly|today))\b", "instant hire claim"),
]

PAYMENT_SCAM_PATTERNS = [
    (r"\b(payment\s+\w*\s*(pending|processing|failed)|transaction\s+\w*\s*(failed|pending))\b", "fake payment status"),
    (r"\b(refund|overpayment|excess\s+payment)\b", "refund/overpayment scam"),
    (r"\b(gift\s+cards?|prepaid\s+cards?|itunes\s+cards?|google\s+play\s+cards?)\b", "gift card payment request"),
    (r"\b(zelle|venmo|cashapp|cash\s+app)\b", "P2P payment mention"),
]

IMPERSONATION_PATTERNS = [
    (r"\b(official\s+notice|government\s+agency|irs|fbi|dhs)\b", "authority impersonation"),
    (r"\b(customer\s+service|support\s+team|helpdesk|tech\s+support)\b", "support impersonation"),
    (r"\b(ceo|cfo|manager|director)\s+(has|wants|needs|asked)\b", "executive impersonation"),
]

SAFETY_SIGNALS = [
    (r"\b(unsubscribe|opt.out|manage\s+preferences)\b", "has unsubscribe option"),
    (r"\b(privacy\s+policy|terms\s+of\s+service)\b", "references legal docs"),
]


def analyze_text_heuristics(text: str) -> HeuristicResult:
    """Run heuristic pattern matching on input text."""
    lower_text = text.lower()
    score = 0
    flags: list[str] = []
    evidence: list[Evidence] = []
    category_scores: dict[str, int] = {
        "phishing": 0,
        "job_scam": 0,
        "payment_scam": 0,
        "impersonation": 0,
        "safe": 0,
    }

    def check_patterns(
        patterns: list[tuple[str, str]],
        evidence_type: str,
        category: str,
        weight: int = 10,
    ):
        nonlocal score
        for pattern, reason in patterns:
            matches = re.findall(pattern, lower_text, re.IGNORECASE)
            if matches:
                match_value = matches[0] if isinstance(matches[0], str) else matches[0][0]
                score += weight
                category_scores[category] += weight
                if reason not in flags:
                    flags.append(reason)
                evidence.append(Evidence(
                    type=evidence_type,
                    value=match_value.strip(),
                    reason=reason,
                ))

    check_patterns(URGENCY_PATTERNS, "phrase", "phishing", 12)
    check_patterns(CREDENTIAL_PATTERNS, "pattern", "phishing", 15)
    check_patterns(JOB_SCAM_PATTERNS, "pattern", "job_scam", 14)
    check_patterns(PAYMENT_SCAM_PATTERNS, "pattern", "payment_scam", 13)
    check_patterns(IMPERSONATION_PATTERNS, "pattern", "impersonation", 11)

    # Safety signals reduce score
    for pattern, reason in SAFETY_SIGNALS:
        if re.search(pattern, lower_text, re.IGNORECASE):
            score = max(0, score - 5)
            category_scores["safe"] += 5

    # Check for suspicious formatting
    if text.count("!") > 3:
        score += 5
        flags.append("excessive exclamation marks")

    all_caps_words = len(re.findall(r"\b[A-Z]{3,}\b", text))
    if all_caps_words > 2:
        score += 5
        flags.append("excessive capitalization")

    score = min(score, 100)

    top_category = max(category_scores, key=lambda k: category_scores[k])
    if category_scores[top_category] == 0:
        top_category = "safe"

    return HeuristicResult(
        score=score,
        flags=flags,
        evidence=evidence,
        category_hint=top_category,
    )
