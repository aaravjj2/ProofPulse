"""SQLite database service for analysis history and feedback."""

from __future__ import annotations

import json
import os
import aiosqlite
from datetime import datetime

from ..types.analysis import AnalysisResponse, HistoryEntry, RiskLabel, ThreatCategory

DB_PATH = os.getenv("DATABASE_PATH", "proofpulse.db")


async def _get_db() -> aiosqlite.Connection:
    db = await aiosqlite.connect(DB_PATH)
    await db.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            input_type TEXT NOT NULL DEFAULT 'text',
            risk_score INTEGER NOT NULL,
            risk_label TEXT NOT NULL,
            category TEXT NOT NULL,
            confidence REAL NOT NULL,
            flags TEXT NOT NULL DEFAULT '[]',
            evidence TEXT NOT NULL DEFAULT '[]',
            explanation TEXT NOT NULL DEFAULT '',
            next_steps TEXT NOT NULL DEFAULT '[]',
            safe_reply TEXT,
            normalized_text TEXT,
            ocr_text TEXT,
            ocr_confidence REAL,
            timestamp TEXT NOT NULL
        )
    """)
    await db.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            analysis_id TEXT NOT NULL,
            rating TEXT NOT NULL,
            note TEXT,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (analysis_id) REFERENCES analyses(id)
        )
    """)
    await db.commit()
    return db


async def save_analysis(result: AnalysisResponse) -> None:
    """Persist an analysis result to the database."""
    db = await _get_db()
    try:
        input_type = "image" if result.ocr_text is not None else "text"
        if result.normalized_text and result.normalized_text.startswith(("http://", "https://", "www.")):
            input_type = "url"

        await db.execute(
            """INSERT OR REPLACE INTO analyses
               (id, input_type, risk_score, risk_label, category, confidence,
                flags, evidence, explanation, next_steps, safe_reply,
                normalized_text, ocr_text, ocr_confidence, timestamp)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                result.id,
                input_type,
                result.risk_score,
                result.risk_label.value,
                result.category.value,
                result.confidence,
                json.dumps(result.flags),
                json.dumps([e.model_dump() for e in result.evidence]),
                result.explanation,
                json.dumps(result.next_steps),
                result.safe_reply,
                result.normalized_text,
                result.ocr_text,
                result.ocr_confidence,
                result.timestamp.isoformat(),
            ),
        )
        await db.commit()
    finally:
        await db.close()


async def get_history(limit: int = 10) -> list[HistoryEntry]:
    """Retrieve recent analysis history."""
    db = await _get_db()
    try:
        cursor = await db.execute(
            """SELECT id, input_type, category, risk_score, risk_label, timestamp, explanation
               FROM analyses ORDER BY timestamp DESC LIMIT ?""",
            (limit,),
        )
        rows = await cursor.fetchall()
        return [
            HistoryEntry(
                id=row[0],
                input_type=row[1],
                category=ThreatCategory(row[2]),
                risk_score=row[3],
                risk_label=RiskLabel(row[4]),
                timestamp=datetime.fromisoformat(row[5]),
                summary=row[6][:120] if row[6] else "",
            )
            for row in rows
        ]
    finally:
        await db.close()


async def save_feedback(analysis_id: str, rating: str, note: str | None) -> None:
    """Save user feedback for an analysis."""
    db = await _get_db()
    try:
        await db.execute(
            """INSERT INTO feedback (analysis_id, rating, note, timestamp)
               VALUES (?, ?, ?, ?)""",
            (analysis_id, rating, note, datetime.utcnow().isoformat()),
        )
        await db.commit()
    finally:
        await db.close()
