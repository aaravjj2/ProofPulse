"""Feedback route."""

from fastapi import APIRouter

from ..types.analysis import FeedbackRequest
from ..services.database import save_feedback

router = APIRouter()


@router.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    await save_feedback(request.analysis_id, request.rating.value, request.note)
    return {"status": "ok", "analysis_id": request.analysis_id}
