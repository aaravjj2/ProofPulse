-- Initial schema: analyses table
CREATE TABLE IF NOT EXISTS analyses (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    input_type TEXT NOT NULL CHECK(input_type IN ('text', 'image', 'url', 'scenario')),
    raw_input TEXT,
    extracted_text TEXT,
    risk_score INTEGER NOT NULL CHECK(risk_score BETWEEN 0 AND 100),
    risk_level TEXT NOT NULL CHECK(risk_level IN ('SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    verdict TEXT NOT NULL,
    evidence_json TEXT NOT NULL DEFAULT '[]',
    recommendations_json TEXT NOT NULL DEFAULT '[]',
    next_steps_json TEXT NOT NULL DEFAULT '[]',
    confidence REAL NOT NULL DEFAULT 0.0,
    model_used TEXT,
    latency_ms INTEGER,
    ip_hash TEXT,
    deleted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_analyses_risk_level ON analyses(risk_level);
