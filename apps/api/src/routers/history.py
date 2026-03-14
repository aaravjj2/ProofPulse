"""History router."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..db import repository
from ..models import HistoryResponse, HistoryItem, StatsResponse

router = APIRouter()


@router.get("/history", response_model=HistoryResponse)
async def get_history(page: int = 1, per_page: int = 20, risk_level: str | None = None):
    """Get paginated analysis history."""
    items, total = await repository.get_history(page, per_page, risk_level)
    return HistoryResponse(
        items=[
            HistoryItem(
                analysis_id=item["analysis_id"],
                created_at=item["created_at"],
                input_type=item["input_type"],
                risk_score=item["risk_score"],
                risk_level=item["risk_level"],
                verdict=item["verdict"],
            )
            for item in items
        ],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/history/stats", response_model=StatsResponse)
async def get_stats():
    """Get aggregate analysis statistics."""
    stats = await repository.get_stats()
    return StatsResponse(**stats)


@router.get("/history/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Get a specific analysis by ID."""
    result = await repository.get_analysis(analysis_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return result
