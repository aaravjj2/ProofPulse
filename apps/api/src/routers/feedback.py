"""Feedback router."""

from __future__ import annotations

from fastapi import APIRouter

from ..db import repository
from ..models import FeedbackRequest, FeedbackResponse

router = APIRouter()


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(request: FeedbackRequest):
    """Submit user feedback for an analysis."""
    feedback_id = await repository.save_feedback(
        analysis_id=request.analysis_id,
        rating=request.rating,
        comment=request.comment,
        was_actually_scam=request.was_actually_scam,
    )
    return FeedbackResponse(feedback_id=feedback_id)
