"""Analysis routes for text, image, URL, and scenario."""

from __future__ import annotations

import uuid
from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from ..types.analysis import (
    TextAnalysisRequest,
    URLAnalysisRequest,
    ScenarioAnalysisRequest,
    AnalysisResponse,
    SourceType,
)
from ..services.pipeline import run_text_analysis, run_image_analysis, run_url_analysis, run_scenario_analysis
from ..services.database import save_analysis

router = APIRouter()


@router.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    analysis_id = str(uuid.uuid4())
    result = await run_text_analysis(analysis_id, request.text, request.source.value)
    await save_analysis(result)
    return result


@router.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_image(
    image: UploadFile = File(...),
    source: str = Form(default="other"),
    locale: str = Form(default="en-US"),
):
    if image.content_type not in ("image/png", "image/jpeg", "image/webp", "image/gif"):
        raise HTTPException(status_code=400, detail="Unsupported image type. Use PNG, JPEG, WebP, or GIF.")

    contents = await image.read()
    max_size = 10 * 1024 * 1024  # 10MB
    if len(contents) > max_size:
        raise HTTPException(status_code=400, detail="Image too large. Max 10MB.")

    analysis_id = str(uuid.uuid4())
    result = await run_image_analysis(analysis_id, contents, source)
    await save_analysis(result)
    return result


@router.post("/analyze/url", response_model=AnalysisResponse)
async def analyze_url(request: URLAnalysisRequest):
    analysis_id = str(uuid.uuid4())
    result = await run_url_analysis(analysis_id, request.url, request.context.value)
    await save_analysis(result)
    return result


@router.post("/analyze/scenario", response_model=AnalysisResponse)
async def analyze_scenario(request: ScenarioAnalysisRequest):
    analysis_id = str(uuid.uuid4())
    result = await run_scenario_analysis(
        analysis_id,
        request.scenario.value,
        request.text,
        request.url,
        request.image_id,
    )
    await save_analysis(result)
    return result
