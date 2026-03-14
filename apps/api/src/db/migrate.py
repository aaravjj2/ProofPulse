"""Database migration runner."""

from __future__ import annotations

import os
import structlog

from .connection import get_db

logger = structlog.get_logger()

MIGRATIONS_DIR = os.path.join(os.path.dirname(__file__), "migrations")


async def run_migrations() -> None:
    """Execute all SQL migration files in order."""
    db = await get_db()
    try:
        migration_files = sorted(
            f for f in os.listdir(MIGRATIONS_DIR) if f.endswith(".sql")
        )
        for filename in migration_files:
            filepath = os.path.join(MIGRATIONS_DIR, filename)
            with open(filepath) as f:
                sql = f.read()
            await db.executescript(sql)
            logger.info("migration_applied", file=filename)
        await db.commit()
    finally:
        await db.close()
