-- URL scan cache table
CREATE TABLE IF NOT EXISTS url_cache (
    id TEXT PRIMARY KEY,
    url_hash TEXT NOT NULL UNIQUE,
    scanned_at TEXT NOT NULL,
    is_safe INTEGER NOT NULL,
    threat_type TEXT,
    raw_result_json TEXT NOT NULL DEFAULT '{}',
    expires_at TEXT NOT NULL
);
