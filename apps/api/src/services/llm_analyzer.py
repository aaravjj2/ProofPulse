"""LLM analysis service using OpenAI."""

from __future__ import annotations

import json
import time

import structlog
from openai import AsyncOpenAI, APIError, RateLimitError

from ..config import settings
from ..prompts.system_prompt import SYSTEM_PROMPT

logger = structlog.get_logger()

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


def set_client(client: AsyncOpenAI | None) -> None:
    """Override client (for testing)."""
    global _client
    _client = client


async def analyze_content(prompt: str) -> dict:
    """Send content to OpenAI for analysis.

    Returns a dict matching the AnalysisResponse schema.
    Retries once on JSON parse failure.
    Handles rate limits with exponential backoff (3 retries).
    Falls back to heuristic analysis if OpenAI is unavailable.
    """
    if not settings.openai_api_key or settings.openai_api_key == "test-key-for-ci":
        logger.info("openai_skipped", reason="no_api_key")
        return _fallback_analysis(prompt)

    start = time.time()
    last_error: Exception | None = None

    for attempt in range(3):
        try:
            client = _get_client()
            response = await client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                max_tokens=settings.openai_max_tokens,
                temperature=settings.openai_temperature,
            )

            raw = response.choices[0].message.content or "{}"
            result = json.loads(raw)
            latency_ms = int((time.time() - start) * 1000)

            return _validate_and_normalize(result, latency_ms, settings.openai_model)

        except (json.JSONDecodeError, KeyError) as e:
            logger.warning("llm_parse_error", attempt=attempt, error=str(e))
            last_error = e
            if attempt == 0:
                continue
            break

        except RateLimitError as e:
            logger.warning("llm_rate_limit", attempt=attempt)
            last_error = e
            import asyncio

            await asyncio.sleep(2**attempt)

        except APIError as e:
            logger.error("llm_api_error", error=str(e))
            last_error = e
            break

        except Exception as e:
            logger.error("llm_unexpected_error", error=str(e))
            last_error = e
            break

    logger.warning("llm_fallback", reason=str(last_error))
    return _fallback_analysis(prompt)


def _validate_and_normalize(result: dict, latency_ms: int, model: str) -> dict:
    """Validate and normalize the LLM response."""
    # Clamp risk score
    score = max(0, min(100, int(result.get("risk_score", 50))))

    # Enforce risk level consistency
    level = result.get("risk_level", "MEDIUM")
    valid_levels = {"SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"}
    if level not in valid_levels:
        level = _score_to_level(score)
    else:
        expected = _score_to_level(score)
        if level != expected:
            level = expected

    # Validate evidence items
    evidence = []
    for item in result.get("evidence", []):
        if isinstance(item, dict) and "label" in item and "value" in item:
            evidence.append(
                {
                    "label": str(item["label"]),
                    "value": str(item["value"]),
                    "weight": max(0.0, min(1.0, float(item.get("weight", 0.5)))),
                    "flag": (
                        item.get("flag", "yellow")
                        if item.get("flag") in ("red", "yellow", "green")
                        else "yellow"
                    ),
                }
            )

    # Clamp confidence
    confidence = max(0.0, min(1.0, float(result.get("confidence", 0.7))))

    return {
        "risk_score": score,
        "risk_level": level,
        "verdict": str(result.get("verdict", "Analysis complete.")),
        "confidence": confidence,
        "evidence": evidence,
        "recommendations": [str(r) for r in result.get("recommendations", [])],
        "next_steps": [str(s) for s in result.get("next_steps", [])],
        "model_used": model,
        "latency_ms": latency_ms,
    }


def _score_to_level(score: int) -> str:
    if score <= 20:
        return "SAFE"
    if score <= 40:
        return "LOW"
    if score <= 60:
        return "MEDIUM"
    if score <= 80:
        return "HIGH"
    return "CRITICAL"


def _fallback_analysis(prompt: str) -> dict:
    """Rule-based fallback when OpenAI is unavailable."""
    text = prompt.lower()
    score = 0
    evidence = []

    # Simple heuristic scoring
    urgency_words = [
        "urgent",
        "immediately",
        "act now",
        "expires",
        "suspended",
        "locked",
    ]
    for word in urgency_words:
        if word in text:
            score += 15
            evidence.append(
                {
                    "label": "Urgency language",
                    "value": f"Contains '{word}' — a common pressure tactic",
                    "weight": 0.7,
                    "flag": "red",
                }
            )

    financial_words = [
        "password",
        "ssn",
        "credit card",
        "bank account",
        "wire transfer",
        "gift card",
        "bitcoin",
    ]
    for word in financial_words:
        if word in text:
            score += 20
            evidence.append(
                {
                    "label": "Credential/financial request",
                    "value": f"Requests '{word}' — a high-risk indicator",
                    "weight": 0.85,
                    "flag": "red",
                }
            )

    suspicious_links = [".tk", ".ru/", ".xyz/", "verify-account", "amaz0n", "paypa1"]
    for link in suspicious_links:
        if link in text:
            score += 20
            evidence.append(
                {
                    "label": "Suspicious link pattern",
                    "value": f"Contains '{link}' — commonly used in phishing",
                    "weight": 0.9,
                    "flag": "red",
                }
            )

    safe_indicators = ["unsubscribe", "privacy policy", "terms of service"]
    for indicator in safe_indicators:
        if indicator in text:
            score -= 10
            evidence.append(
                {
                    "label": "Legitimacy signal",
                    "value": f"Contains '{indicator}'",
                    "weight": 0.3,
                    "flag": "green",
                }
            )

    score = max(0, min(100, score))
    level = _score_to_level(score)

    if not evidence:
        evidence.append(
            {
                "label": "No clear indicators",
                "value": "No strong scam or legitimacy signals detected",
                "weight": 0.3,
                "flag": "yellow" if score > 20 else "green",
            }
        )

    recommendations = []
    if score >= 60:
        recommendations = [
            "Do not click any links in this message",
            "Do not provide any personal information",
            "Report this message as spam/phishing",
        ]
    elif score >= 30:
        recommendations = [
            "Verify the sender through official channels",
            "Do not click links until verified",
        ]
    else:
        recommendations = ["This appears safe, but always stay cautious"]

    next_steps = []
    if score >= 60:
        next_steps = ["Delete the message", "Block the sender", "Report to authorities"]
    elif score >= 30:
        next_steps = ["Contact the sender through official channels to verify"]
    else:
        next_steps = ["No immediate action required"]

    confidence = min(0.6 + len(evidence) * 0.05, 0.85) if evidence else 0.5

    return {
        "risk_score": score,
        "risk_level": level,
        "verdict": _generate_verdict(score, level),
        "confidence": round(confidence, 2),
        "evidence": evidence[:8],
        "recommendations": recommendations,
        "next_steps": next_steps,
        "model_used": "heuristic-fallback",
        "latency_ms": 0,
    }


def _generate_verdict(score: int, level: str) -> str:
    if level == "CRITICAL":
        return "This content shows strong scam/phishing patterns. Do not engage."
    if level == "HIGH":
        return (
            "This content contains multiple scam indicators. Exercise extreme caution."
        )
    if level == "MEDIUM":
        return "This content has some suspicious elements. Verify before taking action."
    if level == "LOW":
        return "Minor concerns detected. Likely legitimate but worth verifying."
    return "This content appears safe with no suspicious signals detected."
