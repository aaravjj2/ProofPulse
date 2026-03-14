"""Analysis router — text, image, URL, and scenario endpoints."""

from __future__ import annotations

import asyncio
import base64
import time
import uuid

import structlog
from fastapi import APIRouter, HTTPException, UploadFile, File

from ..config import settings
from ..db import repository
from ..models import (
    AnalysisResponse,
    TextAnalysisRequest,
    URLAnalysisRequest,
    ScenarioAnalysisRequest,
)
from ..prompts.templates import text_prompt, image_prompt, url_prompt, scenario_prompt
from ..services.llm_analyzer import analyze_content
from ..services.ocr import extract_text_from_image
from ..services.url_scanner import analyze_url

logger = structlog.get_logger()
router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/webp", "image/gif"}


@router.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    """Analyze text content for scam/fraud indicators."""
    start = time.time()
    analysis_id = str(uuid.uuid4())

    prompt = text_prompt(request.text, request.context)
    result = await analyze_content(prompt)

    latency = int((time.time() - start) * 1000)
    result["latency_ms"] = latency

    await repository.save_analysis(
        analysis_id=analysis_id,
        input_type="text",
        raw_input=request.text[:500],
        extracted_text=None,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        verdict=result["verdict"],
        evidence=result["evidence"],
        recommendations=result["recommendations"],
        next_steps=result["next_steps"],
        confidence=result["confidence"],
        model_used=result["model_used"],
        latency_ms=latency,
    )

    return AnalysisResponse(
        analysis_id=analysis_id,
        input_type="text",
        **{k: v for k, v in result.items() if k not in ("model_used", "latency_ms")},
        model_used=result["model_used"],
        latency_ms=latency,
    )


@router.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """Analyze a screenshot for scam indicators via OCR."""
    start = time.time()
    analysis_id = str(uuid.uuid4())

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type: {file.content_type}. Use PNG, JPEG, WebP, or GIF.",
        )

    contents = await file.read()
    max_bytes = settings.max_image_size_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"Image too large. Maximum size is {settings.max_image_size_mb}MB.",
        )

    extracted_text, ocr_confidence = await extract_text_from_image(contents)
    if not extracted_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from image.")

    prompt = image_prompt(extracted_text)
    result = await analyze_content(prompt)
    latency = int((time.time() - start) * 1000)
    result["latency_ms"] = latency

    await repository.save_analysis(
        analysis_id=analysis_id,
        input_type="image",
        raw_input=None,
        extracted_text=extracted_text,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        verdict=result["verdict"],
        evidence=result["evidence"],
        recommendations=result["recommendations"],
        next_steps=result["next_steps"],
        confidence=result["confidence"],
        model_used=result["model_used"],
        latency_ms=latency,
    )

    return AnalysisResponse(
        analysis_id=analysis_id,
        input_type="image",
        **{k: v for k, v in result.items() if k not in ("model_used", "latency_ms")},
        model_used=result["model_used"],
        latency_ms=latency,
    )


@router.post("/analyze/url", response_model=AnalysisResponse)
async def analyze_url_endpoint(request: URLAnalysisRequest):
    """Analyze a URL for phishing indicators."""
    start = time.time()
    analysis_id = str(uuid.uuid4())

    url_signals = await analyze_url(request.url)
    prompt = url_prompt(request.url, url_signals)
    result = await analyze_content(prompt)

    # Merge URL scanner score with LLM score
    url_risk = url_signals.get("risk_score", 0)
    if url_risk > result["risk_score"]:
        result["risk_score"] = min(100, (result["risk_score"] + url_risk) // 2 + url_risk // 4)
        result["risk_level"] = _score_to_level(result["risk_score"])

    latency = int((time.time() - start) * 1000)
    result["latency_ms"] = latency

    await repository.save_analysis(
        analysis_id=analysis_id,
        input_type="url",
        raw_input=request.url,
        extracted_text=None,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        verdict=result["verdict"],
        evidence=result["evidence"],
        recommendations=result["recommendations"],
        next_steps=result["next_steps"],
        confidence=result["confidence"],
        model_used=result["model_used"],
        latency_ms=latency,
    )

    return AnalysisResponse(
        analysis_id=analysis_id,
        input_type="url",
        **{k: v for k, v in result.items() if k not in ("model_used", "latency_ms")},
        model_used=result["model_used"],
        latency_ms=latency,
    )


@router.post("/analyze/scenario", response_model=AnalysisResponse)
async def analyze_scenario(request: ScenarioAnalysisRequest):
    """Analyze a multi-input scenario."""
    start = time.time()
    analysis_id = str(uuid.uuid4())

    # Run applicable services concurrently
    tasks = []
    ocr_text = None
    url_signals = None

    if request.image_base64:
        image_bytes = base64.b64decode(request.image_base64)
        tasks.append(("ocr", extract_text_from_image(image_bytes)))

    if request.url:
        tasks.append(("url", analyze_url(request.url)))

    results = {}
    if tasks:
        gathered = await asyncio.gather(*(t[1] for t in tasks), return_exceptions=True)
        for (label, _), result in zip(tasks, gathered):
            if not isinstance(result, Exception):
                results[label] = result

    if "ocr" in results:
        ocr_text, _ = results["ocr"]
    if "url" in results:
        url_signals = results["url"]

    prompt = scenario_prompt(request.text, request.url, ocr_text, request.context)
    result = await analyze_content(prompt)

    # Merge URL signals if available
    if url_signals:
        url_risk = url_signals.get("risk_score", 0)
        if url_risk > 30:
            result["risk_score"] = min(100, max(result["risk_score"], url_risk))
            result["risk_level"] = _score_to_level(result["risk_score"])

    latency = int((time.time() - start) * 1000)
    result["latency_ms"] = latency

    raw_input = request.text or request.url or ""

    await repository.save_analysis(
        analysis_id=analysis_id,
        input_type="scenario",
        raw_input=raw_input[:500] if raw_input else None,
        extracted_text=ocr_text,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        verdict=result["verdict"],
        evidence=result["evidence"],
        recommendations=result["recommendations"],
        next_steps=result["next_steps"],
        confidence=result["confidence"],
        model_used=result["model_used"],
        latency_ms=latency,
    )

    return AnalysisResponse(
        analysis_id=analysis_id,
        input_type="scenario",
        **{k: v for k, v in result.items() if k not in ("model_used", "latency_ms")},
        model_used=result["model_used"],
        latency_ms=latency,
    )


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
