-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    analysis_id TEXT NOT NULL REFERENCES analyses(id),
    created_at TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    user_comment TEXT,
    was_actually_scam INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_feedback_analysis_id ON feedback(analysis_id);
