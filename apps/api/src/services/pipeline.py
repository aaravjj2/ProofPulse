"""Analysis pipeline orchestrator.

Coordinates heuristic detection, OCR, URL analysis, LLM explanation,
scoring, and response building into a single analysis flow.
"""

from __future__ import annotations

from typing import Optional

from ..types.analysis import AnalysisResponse
from .heuristics.detector import analyze_text_heuristics
from .llm.analyzer import get_llm_analysis
from .ocr.extractor import extract_text_from_image, clean_ocr_text
from .url_analysis.analyzer import analyze_url
from .scoring.scorer import calculate_risk_score, get_risk_label, calculate_confidence
from .response_builder.builder import build_response


async def run_text_analysis(
    analysis_id: str,
    text: str,
    source: str = "other",
) -> AnalysisResponse:
    """Full analysis pipeline for text input."""
    # Step 1: Heuristic analysis
    heuristic = analyze_text_heuristics(text)

    # Step 2: LLM analysis
    llm_result = await get_llm_analysis(
        text, heuristic.score, heuristic.flags, source
    )

    # Step 3: Combine scores
    all_flags = list(heuristic.flags) + llm_result.additional_flags
    risk_score = calculate_risk_score(heuristic.score, llm_result.confidence_adjustment)
    risk_label = get_risk_label(risk_score)
    confidence = calculate_confidence(
        len(heuristic.flags), llm_result.confidence_adjustment
    )

    # Step 4: Determine category
    category = (
        llm_result.category_suggestion
        if llm_result.category_suggestion != "unknown"
        else heuristic.category_hint
    )

    return build_response(
        analysis_id=analysis_id,
        risk_score=risk_score,
        risk_label=risk_label,
        category_hint=category,
        confidence=confidence,
        flags=all_flags,
        evidence=list(heuristic.evidence),
        explanation=llm_result.explanation,
        next_steps=llm_result.next_steps,
        safe_reply=llm_result.safe_reply,
        normalized_text=text,
    )


async def run_image_analysis(
    analysis_id: str,
    image_bytes: bytes,
    source: str = "other",
) -> AnalysisResponse:
    """Full analysis pipeline for image input with OCR."""
    # Step 1: OCR extraction
    ocr_result = await extract_text_from_image(image_bytes)
    cleaned_text = clean_ocr_text(ocr_result.text) if ocr_result.text else ""

    if not cleaned_text:
        return build_response(
            analysis_id=analysis_id,
            risk_score=0,
            risk_label=get_risk_label(0),
            category_hint="unknown",
            confidence=0.3,
            flags=["no text extracted from image"],
            evidence=[],
            explanation="Could not extract readable text from the image. "
            "Try uploading a clearer screenshot or paste the text directly.",
            next_steps=["Try pasting the text manually", "Upload a higher quality image"],
            ocr_text="",
            ocr_confidence=0.0,
        )

    # Step 2: Run text analysis on extracted text
    result = await run_text_analysis(analysis_id, cleaned_text, source)

    # Step 3: Attach OCR metadata
    return build_response(
        analysis_id=result.id,
        risk_score=result.risk_score,
        risk_label=result.risk_label,
        category_hint=result.category.value,
        confidence=result.confidence,
        flags=list(result.flags),
        evidence=list(result.evidence),
        explanation=result.explanation,
        next_steps=list(result.next_steps),
        safe_reply=result.safe_reply,
        normalized_text=cleaned_text,
        ocr_text=ocr_result.text,
        ocr_confidence=ocr_result.confidence,
    )


async def run_url_analysis(
    analysis_id: str,
    url: str,
    context: str = "other",
) -> AnalysisResponse:
    """Full analysis pipeline for URL input."""
    # Step 1: URL pattern analysis
    url_result = analyze_url(url, context)

    # Step 2: LLM analysis of the URL
    url_description = f"URL: {url} (domain: {url_result.domain})"
    llm_result = await get_llm_analysis(
        url_description, url_result.score, url_result.flags, "url"
    )

    # Step 3: Combine
    all_flags = list(url_result.flags) + llm_result.additional_flags
    risk_score = calculate_risk_score(url_result.score, llm_result.confidence_adjustment)
    risk_label = get_risk_label(risk_score)
    confidence = calculate_confidence(
        len(url_result.flags),
        llm_result.confidence_adjustment,
        has_url_signals=True,
    )

    category = (
        llm_result.category_suggestion
        if llm_result.category_suggestion != "unknown"
        else "phishing" if url_result.is_suspicious else "safe"
    )

    return build_response(
        analysis_id=analysis_id,
        risk_score=risk_score,
        risk_label=risk_label,
        category_hint=category,
        confidence=confidence,
        flags=all_flags,
        evidence=list(url_result.evidence),
        explanation=llm_result.explanation,
        next_steps=llm_result.next_steps,
        safe_reply=llm_result.safe_reply,
        normalized_text=url,
    )


async def run_scenario_analysis(
    analysis_id: str,
    scenario: str,
    text: Optional[str] = None,
    url: Optional[str] = None,
    image_id: Optional[str] = None,
) -> AnalysisResponse:
    """Multi-signal scenario analysis combining text and URL."""
    combined_text = ""
    combined_flags: list[str] = []
    combined_evidence = []
    combined_score = 0

    if text:
        heuristic = analyze_text_heuristics(text)
        combined_score += heuristic.score
        combined_flags.extend(heuristic.flags)
        combined_evidence.extend(heuristic.evidence)
        combined_text = text

    if url:
        url_result = analyze_url(url)
        combined_score += url_result.score
        combined_flags.extend(url_result.flags)
        combined_evidence.extend(url_result.evidence)
        combined_text += f"\nURL: {url}"

    combined_score = min(combined_score, 100)

    llm_result = await get_llm_analysis(
        combined_text or f"Scenario: {scenario}",
        combined_score,
        combined_flags,
        scenario,
    )

    all_flags = combined_flags + llm_result.additional_flags
    risk_score = calculate_risk_score(combined_score, llm_result.confidence_adjustment)
    risk_label = get_risk_label(risk_score)
    confidence = calculate_confidence(
        len(combined_flags),
        llm_result.confidence_adjustment,
        has_url_signals=url is not None,
    )

    category = (
        llm_result.category_suggestion
        if llm_result.category_suggestion != "unknown"
        else scenario
    )

    return build_response(
        analysis_id=analysis_id,
        risk_score=risk_score,
        risk_label=risk_label,
        category_hint=category,
        confidence=confidence,
        flags=all_flags,
        evidence=combined_evidence,
        explanation=llm_result.explanation,
        next_steps=llm_result.next_steps,
        safe_reply=llm_result.safe_reply,
        normalized_text=combined_text,
    )
