"""LLM service for AI-powered analysis explanation."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class LLMAnalysisResult:
    explanation: str
    next_steps: list[str]
    safe_reply: str | None
    additional_flags: list[str]
    confidence_adjustment: float
    category_suggestion: str


SYSTEM_PROMPT = """You are ProofPulse, an AI scam detection assistant. You analyze suspicious messages,
screenshots, and links to help users identify threats.

Given a message and preliminary analysis data, provide:
1. A clear, evidence-based explanation of why this is or isn't suspicious
2. Specific next steps the user should take
3. A safe reply template if the message seems like a scam
4. Any additional red flags you notice
5. Your confidence level (0.0-1.0)
6. A threat category

Respond ONLY with valid JSON in this exact format:
{
  "explanation": "string",
  "next_steps": ["string"],
  "safe_reply": "string or null",
  "additional_flags": ["string"],
  "confidence": 0.85,
  "category": "phishing|job_scam|payment_scam|impersonation|misinformation|safe"
}"""


async def get_llm_analysis(
    text: str,
    heuristic_score: int,
    heuristic_flags: list[str],
    source: str = "other",
) -> LLMAnalysisResult:
    """Get LLM-powered analysis of the text."""
    api_key = os.getenv("OPENAI_API_KEY", "")

    if not api_key or api_key == "your-openai-api-key-here":
        return _fallback_analysis(text, heuristic_score, heuristic_flags)

    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=api_key)

        user_prompt = f"""Analyze this message for scam/threat indicators:

Message: "{text}"
Source type: {source}
Preliminary heuristic score: {heuristic_score}/100
Detected flags: {', '.join(heuristic_flags) if heuristic_flags else 'none'}

Provide your analysis as JSON."""

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=800,
        )

        content = response.choices[0].message.content or "{}"
        # Strip markdown code fences if present
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        data = json.loads(content)

        return LLMAnalysisResult(
            explanation=data.get("explanation", ""),
            next_steps=data.get("next_steps", []),
            safe_reply=data.get("safe_reply"),
            additional_flags=data.get("additional_flags", []),
            confidence_adjustment=float(data.get("confidence", 0.7)),
            category_suggestion=data.get("category", "unknown"),
        )

    except Exception as e:
        logger.error(f"LLM analysis failed: {e}")
        return _fallback_analysis(text, heuristic_score, heuristic_flags)


def _fallback_analysis(
    text: str,
    heuristic_score: int,
    heuristic_flags: list[str],
) -> LLMAnalysisResult:
    """Provide rule-based analysis when LLM is unavailable."""
    if heuristic_score >= 60:
        explanation = (
            "This message contains multiple indicators commonly associated with scams or phishing attempts. "
            f"Detected signals include: {', '.join(heuristic_flags[:5])}. "
            "Exercise extreme caution and do not share personal information or click any links."
        )
        next_steps = [
            "Do not click any links in this message",
            "Do not share personal or financial information",
            "Contact the supposed sender through official channels to verify",
            "Report this message as spam or phishing",
            "Block the sender if possible",
        ]
        safe_reply = "I will verify this through the official channel before proceeding."
        category = "phishing"
    elif heuristic_score >= 30:
        explanation = (
            "This message shows some suspicious patterns that warrant caution. "
            f"Noted signals: {', '.join(heuristic_flags[:3])}. "
            "While it may be legitimate, verify through official channels before acting."
        )
        next_steps = [
            "Verify the sender's identity through official channels",
            "Do not act urgently — take time to verify",
            "Check the sender's email/phone against official contact info",
        ]
        safe_reply = "Thanks for reaching out. Let me verify this through your official website first."
        category = "social_engineering"
    else:
        explanation = (
            "This message does not show strong scam indicators based on our analysis. "
            "However, always exercise standard caution with unsolicited messages."
        )
        next_steps = [
            "Standard caution with any unsolicited message",
            "Verify sender identity if requesting any action",
        ]
        safe_reply = None
        category = "safe"

    return LLMAnalysisResult(
        explanation=explanation,
        next_steps=next_steps,
        safe_reply=safe_reply,
        additional_flags=[],
        confidence_adjustment=0.6 if heuristic_score < 30 else 0.75,
        category_suggestion=category,
    )
