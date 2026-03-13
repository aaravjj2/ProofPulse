"""History route."""

from fastapi import APIRouter

from ..services.database import get_history

router = APIRouter()


@router.get("/history")
async def list_history():
    entries = await get_history()
    return entries
