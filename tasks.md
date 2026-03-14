# ProofPulse — Master Task List
> AI-powered scam detection: messages, screenshots, links, emails. Evidence-first risk analysis with explainable scores and safe next steps.
> **Stack:** Next.js 14 · TypeScript · Tailwind CSS · FastAPI · Python · Tesseract OCR · OpenAI API · SQLite · Playwright

---

## STATUS LEGEND
- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `[!]` Blocked

---

## 0. REPO & MONOREPO SETUP

### 0.1 Root Scaffold
- [ ] 0.1.1 Confirm monorepo root has `apps/` and `packages/` dirs
- [ ] 0.1.2 Create root `package.json` with workspaces: `["apps/*", "packages/*"]`
- [ ] 0.1.3 Create root `.gitignore` covering Python, Node, env files, OS files
- [ ] 0.1.4 Create root `.editorconfig` (indent_size=2, charset=utf-8, trim_trailing_whitespace=true)
- [ ] 0.1.5 Create root `turbo.json` (or `nx.json`) for monorepo task orchestration
- [ ] 0.1.6 Create root `Makefile` with targets: `dev`, `build`, `test`, `lint`, `format`, `docker-up`
- [ ] 0.1.7 Create root `docker-compose.yml` with services: `api`, `web`, `db` (future Postgres)
- [ ] 0.1.8 Create root `docker-compose.dev.yml` with hot-reload overrides
- [ ] 0.1.9 Add `.env.example` at repo root documenting all required env vars
- [ ] 0.1.10 Create `CONTRIBUTING.md` with branch naming, PR template, commit style
- [ ] 0.1.11 Create `CHANGELOG.md` with semantic versioning header
- [ ] 0.1.12 Create `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] 0.1.13 Create `.github/ISSUE_TEMPLATE/bug_report.md`
- [ ] 0.1.14 Create `.github/ISSUE_TEMPLATE/feature_request.md`
- [ ] 0.1.15 Create `.github/workflows/ci.yml` (lint + test on push/PR)
- [ ] 0.1.16 Create `.github/workflows/deploy.yml` (deploy on main merge)
- [ ] 0.1.17 Add `LICENSE` file (MIT)
- [ ] 0.1.18 Add `CODE_OF_CONDUCT.md`
- [ ] 0.1.19 Add `SECURITY.md` with vulnerability disclosure policy
- [ ] 0.1.20 Validate monorepo installs cleanly from root with `npm install`

---

## 1. BACKEND — FastAPI (`apps/api`)

### 1.1 Project Scaffold
- [ ] 1.1.1 Init `apps/api` directory
- [ ] 1.1.2 Create `apps/api/pyproject.toml` with project metadata
- [ ] 1.1.3 Create `apps/api/requirements.txt` (fastapi, uvicorn, openai, pytesseract, Pillow, httpx, pydantic, python-multipart, sqlite-utils, python-dotenv, structlog)
- [ ] 1.1.4 Create `apps/api/requirements-dev.txt` (pytest, pytest-asyncio, httpx, faker, ruff, black, mypy)
- [ ] 1.1.5 Create `apps/api/.env.example` with all required vars
- [ ] 1.1.6 Create `apps/api/Dockerfile` (python:3.11-slim, tesseract install, uvicorn entrypoint)
- [ ] 1.1.7 Create `apps/api/.dockerignore`
- [ ] 1.1.8 Create `apps/api/src/__init__.py`
- [ ] 1.1.9 Create `apps/api/src/main.py` with FastAPI app instantiation
- [ ] 1.1.10 Register all routers in `main.py`
- [ ] 1.1.11 Add CORS middleware (configurable origins via env)
- [ ] 1.1.12 Add request logging middleware (structlog)
- [ ] 1.1.13 Add global exception handler returning JSON error envelope
- [ ] 1.1.14 Add request ID middleware (UUID per request, returned in headers)
- [ ] 1.1.15 Add rate limiting middleware (slowapi or custom token bucket)
- [ ] 1.1.16 Add health check lifespan event (DB connectivity check on startup)
- [ ] 1.1.17 Add graceful shutdown handler
- [ ] 1.1.18 Configure OpenAPI tags and metadata for docs UI
- [ ] 1.1.19 Mount `/api/v1` prefix on all routers
- [ ] 1.1.20 Create `apps/api/src/config.py` with pydantic Settings class

### 1.2 Configuration & Settings
- [ ] 1.2.1 `Settings.openai_api_key: str` — required
- [ ] 1.2.2 `Settings.openai_model: str` — default `gpt-4o`
- [ ] 1.2.3 `Settings.openai_max_tokens: int` — default 1500
- [ ] 1.2.4 `Settings.openai_temperature: float` — default 0.2
- [ ] 1.2.5 `Settings.database_url: str` — default `sqlite:///./proofpulse.db`
- [ ] 1.2.6 `Settings.cors_origins: list[str]` — parsed from comma-separated env
- [ ] 1.2.7 `Settings.rate_limit_per_minute: int` — default 30
- [ ] 1.2.8 `Settings.max_image_size_mb: int` — default 10
- [ ] 1.2.9 `Settings.max_text_length: int` — default 10000
- [ ] 1.2.10 `Settings.tesseract_cmd: str` — default `/usr/bin/tesseract`
- [ ] 1.2.11 `Settings.log_level: str` — default `INFO`
- [ ] 1.2.12 `Settings.environment: str` — `development|staging|production`
- [ ] 1.2.13 `Settings.secret_key: str` — for future auth signing
- [ ] 1.2.14 `Settings.url_scan_timeout_seconds: int` — default 10
- [ ] 1.2.15 Validate settings on startup and crash fast with descriptive error if missing required vars

### 1.3 Database Layer (`src/db/`)
- [ ] 1.3.1 Create `src/db/__init__.py`
- [ ] 1.3.2 Create `src/db/connection.py` — SQLite connection factory using `aiosqlite`
- [ ] 1.3.3 Create `src/db/migrations/` directory
- [ ] 1.3.4 Create `src/db/migrations/001_initial.sql` — analyses table
- [ ] 1.3.5 Create `src/db/migrations/002_feedback.sql` — feedback table
- [ ] 1.3.6 Create `src/db/migrations/003_url_cache.sql` — URL scan cache table
- [ ] 1.3.7 Create `src/db/migrations/004_rate_limits.sql` — rate limit tracking
- [ ] 1.3.8 Create `src/db/migrate.py` — migration runner (reads and applies SQL files in order)
- [ ] 1.3.9 `analyses` table: id, created_at, input_type, raw_input, extracted_text, risk_score, risk_level, verdict, evidence_json, recommendations_json, model_used, latency_ms, ip_hash
- [ ] 1.3.10 `feedback` table: id, analysis_id (FK), created_at, rating (1-5), user_comment, was_actually_scam (bool nullable)
- [ ] 1.3.11 `url_cache` table: id, url_hash, scanned_at, is_safe, threat_type, raw_result_json, expires_at
- [ ] 1.3.12 Create `src/db/repository.py` — typed async CRUD functions for all tables
- [ ] 1.3.13 `repo.create_analysis(payload) -> Analysis`
- [ ] 1.3.14 `repo.get_analysis(id) -> Analysis | None`
- [ ] 1.3.15 `repo.list_analyses(limit, offset, filter_by_risk) -> list[Analysis]`
- [ ] 1.3.16 `repo.create_feedback(payload) -> Feedback`
- [ ] 1.3.17 `repo.get_feedback_for_analysis(analysis_id) -> list[Feedback]`
- [ ] 1.3.18 `repo.get_url_cache(url_hash) -> URLCache | None`
- [ ] 1.3.19 `repo.set_url_cache(payload) -> URLCache`
- [ ] 1.3.20 `repo.get_history_stats() -> HistoryStats` (total scans, avg risk, scam rate)

### 1.4 Pydantic Models (`src/models/`)
- [ ] 1.4.1 Create `src/models/__init__.py`
- [ ] 1.4.2 `TextAnalysisRequest` — text: str (max 10k chars), context: str | None
- [ ] 1.4.3 `ImageAnalysisRequest` — file: UploadFile (validated mime: image/*)
- [ ] 1.4.4 `URLAnalysisRequest` — url: HttpUrl, follow_redirects: bool = True
- [ ] 1.4.5 `ScenarioAnalysisRequest` — text: str | None, url: str | None, image_base64: str | None, context: str | None
- [ ] 1.4.6 `EvidenceItem` — label: str, value: str, weight: float, flag: Literal["red","yellow","green"]
- [ ] 1.4.7 `AnalysisResponse` — analysis_id, risk_score (0-100), risk_level (SAFE/LOW/MEDIUM/HIGH/CRITICAL), verdict, evidence: list[EvidenceItem], recommendations: list[str], next_steps: list[str], confidence: float, model_used, latency_ms, input_type
- [ ] 1.4.8 `FeedbackRequest` — analysis_id, rating (1-5), comment: str | None, was_actually_scam: bool | None
- [ ] 1.4.9 `FeedbackResponse` — id, analysis_id, created_at
- [ ] 1.4.10 `HistoryItem` — id, created_at, input_type, risk_level, risk_score, verdict (truncated)
- [ ] 1.4.11 `HistoryResponse` — items: list[HistoryItem], total, page, per_page
- [ ] 1.4.12 `HealthResponse` — status, db_ok, openai_ok, version, uptime_seconds
- [ ] 1.4.13 `ErrorResponse` — code, message, request_id, timestamp
- [ ] 1.4.14 `StatsResponse` — total_analyses, avg_risk_score, scam_rate_pct, top_risk_types, analyses_by_day (last 7)
- [ ] 1.4.15 All models use `model_config = ConfigDict(str_strip_whitespace=True)`

### 1.5 OCR Service (`src/services/ocr.py`)
- [ ] 1.5.1 Create `src/services/__init__.py`
- [ ] 1.5.2 Create `src/services/ocr.py`
- [ ] 1.5.3 `async def extract_text_from_image(image_bytes: bytes) -> str`
- [ ] 1.5.4 Validate image bytes not empty before passing to Tesseract
- [ ] 1.5.5 Resize image if > max_size (configurable) before OCR
- [ ] 1.5.6 Convert to grayscale before OCR for accuracy
- [ ] 1.5.7 Use `--psm 6` (assume uniform text block) as default Tesseract config
- [ ] 1.5.8 Try `--psm 4` as fallback if initial OCR returns < 10 chars
- [ ] 1.5.9 Strip and normalize whitespace from OCR output
- [ ] 1.5.10 Return empty string (not exception) if no text found
- [ ] 1.5.11 Log OCR latency in ms via structlog
- [ ] 1.5.12 Handle `TesseractNotFoundError` gracefully with descriptive API error
- [ ] 1.5.13 Expose `get_ocr_confidence(image_bytes) -> float` for quality signal
- [ ] 1.5.14 Add `is_image_too_small(image_bytes) -> bool` (flag images < 50x50px)
- [ ] 1.5.15 Add unit tests for OCR service in `tests/test_ocr.py`

### 1.6 URL Analysis Service (`src/services/url_scanner.py`)
- [ ] 1.6.1 Create `src/services/url_scanner.py`
- [ ] 1.6.2 `async def analyze_url(url: str) -> URLAnalysisResult`
- [ ] 1.6.3 Check URL cache first (hash the URL); return cached result if < 24h old
- [ ] 1.6.4 Validate URL scheme is http/https only
- [ ] 1.6.5 Follow redirects (up to 5 hops) and record redirect chain
- [ ] 1.6.6 Extract final destination URL after redirects
- [ ] 1.6.7 Check domain age heuristic (new domains = higher risk signal)
- [ ] 1.6.8 Extract and analyze URL components (scheme, domain, path, query params, fragment)
- [ ] 1.6.9 Flag domains with excessive subdomains (e.g., `amazon.verify.evil.com`)
- [ ] 1.6.10 Flag URL-encoded characters in suspicious positions
- [ ] 1.6.11 Flag homoglyph lookalike domains (e.g., `arnazon.com`)
- [ ] 1.6.12 Flag IP address URLs (e.g., `http://192.168.1.1/login`)
- [ ] 1.6.13 Flag non-standard ports (not 80/443)
- [ ] 1.6.14 Check URL against known phishing patterns (regex list)
- [ ] 1.6.15 Detect URL shortener services (bit.ly, tinyurl, t.co, etc.) and flag
- [ ] 1.6.16 Fetch page title and meta description (with timeout)
- [ ] 1.6.17 Check for login form on destination page (phishing indicator)
- [ ] 1.6.18 Check for mismatched SSL cert domain
- [ ] 1.6.19 Return structured `URLAnalysisResult` with all signals as evidence items
- [ ] 1.6.20 Cache result to DB with 24h TTL
- [ ] 1.6.21 Handle timeout gracefully (return partial result with timeout flag)
- [ ] 1.6.22 Add unit tests in `tests/test_url_scanner.py`

### 1.7 LLM Analysis Service (`src/services/llm_analyzer.py`)
- [ ] 1.7.1 Create `src/services/llm_analyzer.py`
- [ ] 1.7.2 Create `src/prompts/__init__.py`
- [ ] 1.7.3 Create `src/prompts/system_prompt.py` — master system prompt for scam analysis
- [ ] 1.7.4 System prompt defines: role (expert scam analyst), output contract (JSON only), evidence-first reasoning requirement
- [ ] 1.7.5 System prompt specifies JSON schema: `{risk_score, risk_level, verdict, evidence[], recommendations[], next_steps[], confidence, reasoning_chain}`
- [ ] 1.7.6 System prompt includes 3 few-shot examples (low risk, medium risk, high risk)
- [ ] 1.7.7 Create `src/prompts/text_prompt.py` — builds user prompt for text analysis
- [ ] 1.7.8 Create `src/prompts/image_prompt.py` — builds user prompt for OCR-extracted text + image context
- [ ] 1.7.9 Create `src/prompts/url_prompt.py` — builds user prompt incorporating URL signals
- [ ] 1.7.10 Create `src/prompts/scenario_prompt.py` — multi-signal composite prompt
- [ ] 1.7.11 `async def analyze_text(text: str, context: str | None) -> LLMResult`
- [ ] 1.7.12 `async def analyze_image_text(extracted_text: str, ocr_confidence: float) -> LLMResult`
- [ ] 1.7.13 `async def analyze_url_signals(url_result: URLAnalysisResult) -> LLMResult`
- [ ] 1.7.14 `async def analyze_scenario(signals: dict) -> LLMResult`
- [ ] 1.7.15 All functions: call OpenAI with `response_format={"type": "json_object"}`
- [ ] 1.7.16 Parse and validate LLM JSON output against Pydantic model
- [ ] 1.7.17 Fallback: if JSON parse fails, retry once with stricter prompt
- [ ] 1.7.18 Enforce risk_score clamping to 0-100 after LLM response
- [ ] 1.7.19 Enforce risk_level consistency with risk_score (score>75→HIGH/CRITICAL)
- [ ] 1.7.20 Record token usage and latency in result metadata
- [ ] 1.7.21 Handle OpenAI rate limit errors with exponential backoff (3 retries)
- [ ] 1.7.22 Handle OpenAI API errors and map to user-friendly API error responses
- [ ] 1.7.23 Add structured logging of every LLM call (model, tokens, latency, risk_score)
- [ ] 1.7.24 Create `tests/test_llm_analyzer.py` with mocked OpenAI responses
- [ ] 1.7.25 Create `tests/prompts/` with golden test cases for prompt output validation

### 1.8 Analysis Router (`src/routers/analyze.py`)
- [ ] 1.8.1 Create `src/routers/__init__.py`
- [ ] 1.8.2 Create `src/routers/analyze.py`
- [ ] 1.8.3 `POST /api/v1/analyze/text` — accept `TextAnalysisRequest`, return `AnalysisResponse`
- [ ] 1.8.4 Validate text is not empty or whitespace-only
- [ ] 1.8.5 Truncate text > max_length with a warning flag in response
- [ ] 1.8.6 Call `llm_analyzer.analyze_text()`
- [ ] 1.8.7 Persist result to `analyses` table
- [ ] 1.8.8 Return `AnalysisResponse` with DB-assigned `analysis_id`
- [ ] 1.8.9 `POST /api/v1/analyze/image` — accept `multipart/form-data` image upload
- [ ] 1.8.10 Validate file is image mime type
- [ ] 1.8.11 Validate file size ≤ max_image_size_mb
- [ ] 1.8.12 Call `ocr.extract_text_from_image()`
- [ ] 1.8.13 If OCR returns < 20 chars, return error: "Could not extract text from image"
- [ ] 1.8.14 Call `llm_analyzer.analyze_image_text()`
- [ ] 1.8.15 Persist result; return `AnalysisResponse`
- [ ] 1.8.16 `POST /api/v1/analyze/url` — accept `URLAnalysisRequest`
- [ ] 1.8.17 Call `url_scanner.analyze_url()`
- [ ] 1.8.18 Call `llm_analyzer.analyze_url_signals()`
- [ ] 1.8.19 Merge URL scanner signals into evidence list
- [ ] 1.8.20 Persist result; return `AnalysisResponse`
- [ ] 1.8.21 `POST /api/v1/analyze/scenario` — accept `ScenarioAnalysisRequest`
- [ ] 1.8.22 Accept any combination of text, url, image_base64
- [ ] 1.8.23 Reject if all inputs are null
- [ ] 1.8.24 Run applicable sub-analyzers concurrently (`asyncio.gather`)
- [ ] 1.8.25 Merge all signals and call `llm_analyzer.analyze_scenario()`
- [ ] 1.8.26 Persist result; return `AnalysisResponse`
- [ ] 1.8.27 All endpoints: add `X-Request-ID` to response headers
- [ ] 1.8.28 All endpoints: add `X-Latency-Ms` to response headers
- [ ] 1.8.29 All endpoints: return 422 with field-level errors on validation failure
- [ ] 1.8.30 All endpoints: return 429 with `Retry-After` header on rate limit

### 1.9 History Router (`src/routers/history.py`)
- [ ] 1.9.1 Create `src/routers/history.py`
- [ ] 1.9.2 `GET /api/v1/history` — paginated list of past analyses
- [ ] 1.9.3 Query params: `page` (default 1), `per_page` (default 20, max 100), `risk_level` filter, `input_type` filter
- [ ] 1.9.4 Return `HistoryResponse` with pagination metadata
- [ ] 1.9.5 `GET /api/v1/history/{id}` — get single analysis by ID
- [ ] 1.9.6 Return 404 with descriptive message if not found
- [ ] 1.9.7 `DELETE /api/v1/history/{id}` — soft-delete (set deleted_at timestamp)
- [ ] 1.9.8 `DELETE /api/v1/history` — clear all history (require confirmation header)
- [ ] 1.9.9 `GET /api/v1/history/stats` — return `StatsResponse`
- [ ] 1.9.10 Add tests in `tests/test_history.py`

### 1.10 Feedback Router (`src/routers/feedback.py`)
- [ ] 1.10.1 Create `src/routers/feedback.py`
- [ ] 1.10.2 `POST /api/v1/feedback` — accept `FeedbackRequest`, return `FeedbackResponse`
- [ ] 1.10.3 Validate `analysis_id` exists in DB (FK constraint check)
- [ ] 1.10.4 Validate rating is 1-5
- [ ] 1.10.5 Prevent duplicate feedback for same analysis_id (return 409)
- [ ] 1.10.6 Persist to feedback table
- [ ] 1.10.7 Return `FeedbackResponse`
- [ ] 1.10.8 Add tests in `tests/test_feedback.py`

### 1.11 Health Router (`src/routers/health.py`)
- [ ] 1.11.1 Create `src/routers/health.py`
- [ ] 1.11.2 `GET /api/v1/health` — return `HealthResponse`
- [ ] 1.11.3 Check DB: run `SELECT 1` and report ok/fail
- [ ] 1.11.4 Check OpenAI: verify API key is set (don't ping API on every health check)
- [ ] 1.11.5 Report uptime_seconds since process start
- [ ] 1.11.6 Return HTTP 200 if all healthy, HTTP 503 if any critical service is down
- [ ] 1.11.7 `GET /api/v1/health/ready` — Kubernetes readiness probe
- [ ] 1.11.8 `GET /api/v1/health/live` — Kubernetes liveness probe

### 1.12 Backend Tests (`tests/`)
- [ ] 1.12.1 Create `tests/__init__.py`
- [ ] 1.12.2 Create `tests/conftest.py` with pytest fixtures (test client, test DB, mock OpenAI)
- [ ] 1.12.3 Create `tests/fixtures/` directory with sample scam messages (text files)
- [ ] 1.12.4 Create `tests/fixtures/` sample images (legit screenshot, scam screenshot)
- [ ] 1.12.5 Create `tests/fixtures/` sample URLs (legit, phishing, shortener)
- [ ] 1.12.6 `test_text_analysis_happy_path` — valid scam text returns HIGH risk
- [ ] 1.12.7 `test_text_analysis_safe_message` — greeting returns SAFE
- [ ] 1.12.8 `test_text_analysis_empty_input` — returns 422
- [ ] 1.12.9 `test_text_analysis_too_long` — truncates and flags
- [ ] 1.12.10 `test_image_analysis_with_scam_screenshot` — returns HIGH risk
- [ ] 1.12.11 `test_image_analysis_invalid_mime` — returns 422
- [ ] 1.12.12 `test_image_analysis_too_large` — returns 413
- [ ] 1.12.13 `test_image_analysis_blank_image` — returns error about no text
- [ ] 1.12.14 `test_url_analysis_phishing_url` — returns HIGH risk
- [ ] 1.12.15 `test_url_analysis_legitimate_url` — returns SAFE
- [ ] 1.12.16 `test_url_analysis_shortener` — flags as medium risk
- [ ] 1.12.17 `test_scenario_analysis_multi_signal` — all inputs present
- [ ] 1.12.18 `test_scenario_analysis_empty_inputs` — returns 422
- [ ] 1.12.19 `test_history_pagination` — page/per_page work correctly
- [ ] 1.12.20 `test_history_filter_by_risk_level` — filter works
- [ ] 1.12.21 `test_history_single_analysis` — returns correct analysis
- [ ] 1.12.22 `test_history_404` — non-existent ID returns 404
- [ ] 1.12.23 `test_feedback_create` — valid submission succeeds
- [ ] 1.12.24 `test_feedback_duplicate` — second feedback returns 409
- [ ] 1.12.25 `test_feedback_invalid_rating` — out-of-range returns 422
- [ ] 1.12.26 `test_health_ok` — returns 200 and all checks pass
- [ ] 1.12.27 `test_rate_limiting` — 31st request in 1min returns 429
- [ ] 1.12.28 `test_cors_headers` — preflight returns correct CORS headers
- [ ] 1.12.29 `test_request_id_header` — X-Request-ID present in all responses
- [ ] 1.12.30 Run `pytest --cov=src --cov-report=html` and achieve ≥80% coverage

---

## 2. FRONTEND — Next.js 14 (`apps/web`)

### 2.1 Project Scaffold
- [ ] 2.1.1 Init Next.js 14 with `--typescript --tailwind --eslint --app` flags
- [ ] 2.1.2 Install dependencies: `axios`, `react-query`, `react-dropzone`, `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`, `@radix-ui/react-*` (dialog, toast, tooltip, tabs)
- [ ] 2.1.3 Install dev dependencies: `@playwright/test`, `@testing-library/react`, `@testing-library/jest-dom`, `vitest`
- [ ] 2.1.4 Configure `tailwind.config.ts` — custom colors (ProofPulse brand: `#0F172A` bg, `#3B82F6` primary, risk colors)
- [ ] 2.1.5 Define CSS custom properties for risk levels: `--risk-safe`, `--risk-low`, `--risk-medium`, `--risk-high`, `--risk-critical`
- [ ] 2.1.6 Configure `tsconfig.json` with strict mode and path aliases (`@/`)
- [ ] 2.1.7 Configure ESLint with `eslint-config-next` + `@typescript-eslint`
- [ ] 2.1.8 Configure Prettier (printWidth: 100, singleQuote: true, trailingComma: es5)
- [ ] 2.1.9 Create `apps/web/.env.example` (`NEXT_PUBLIC_API_URL`)
- [ ] 2.1.10 Create `apps/web/Dockerfile` (node:20-alpine, multi-stage build)
- [ ] 2.1.11 Configure `next.config.js` with image domains, strict mode
- [ ] 2.1.12 Set up `apps/web/src/lib/api.ts` — typed Axios instance with base URL + interceptors
- [ ] 2.1.13 API interceptor: attach `X-Client-Version` header
- [ ] 2.1.14 API interceptor: log request/response in dev
- [ ] 2.1.15 API interceptor: transform API errors into typed `ApiError` class
- [ ] 2.1.16 Set up `apps/web/src/lib/queryClient.ts` — React Query client config
- [ ] 2.1.17 Wrap `layout.tsx` with `QueryClientProvider` and `Toaster`
- [ ] 2.1.18 Create `apps/web/src/types/api.ts` — TypeScript types mirroring backend Pydantic models
- [ ] 2.1.19 Create `apps/web/src/hooks/` directory
- [ ] 2.1.20 Create `apps/web/src/components/ui/` for base design system components

### 2.2 Design System & UI Components
- [ ] 2.2.1 `components/ui/Button.tsx` — variants: primary, secondary, ghost, danger; sizes: sm, md, lg; loading state
- [ ] 2.2.2 `components/ui/Card.tsx` — base card with optional header, footer, padding variants
- [ ] 2.2.3 `components/ui/Badge.tsx` — risk level badge (SAFE=green, LOW=blue, MEDIUM=yellow, HIGH=orange, CRITICAL=red)
- [ ] 2.2.4 `components/ui/Input.tsx` — text input with label, error state, helper text
- [ ] 2.2.5 `components/ui/Textarea.tsx` — multiline input with character counter
- [ ] 2.2.6 `components/ui/Spinner.tsx` — loading spinner with size variants
- [ ] 2.2.7 `components/ui/ProgressBar.tsx` — animated risk score bar (0-100, color by threshold)
- [ ] 2.2.8 `components/ui/Tabs.tsx` — accessible tab component (wraps Radix)
- [ ] 2.2.9 `components/ui/Toast.tsx` — toast notification (success, error, warning, info)
- [ ] 2.2.10 `components/ui/Modal.tsx` — accessible dialog (wraps Radix)
- [ ] 2.2.11 `components/ui/Tooltip.tsx` — hover tooltip (wraps Radix)
- [ ] 2.2.12 `components/ui/Skeleton.tsx` — loading skeleton for result cards
- [ ] 2.2.13 `components/ui/Accordion.tsx` — collapsible section for evidence items
- [ ] 2.2.14 `components/ui/CopyButton.tsx` — copy-to-clipboard with visual feedback
- [ ] 2.2.15 `components/ui/EmptyState.tsx` — illustrated empty state with CTA
- [ ] 2.2.16 `components/ui/ErrorBoundary.tsx` — React error boundary with fallback UI
- [ ] 2.2.17 `components/ui/Alert.tsx` — inline alert (success, warning, error, info)
- [ ] 2.2.18 `components/ui/Divider.tsx` — horizontal/vertical divider
- [ ] 2.2.19 `components/ui/Avatar.tsx` — initials or icon avatar for history items
- [ ] 2.2.20 All UI components: export types, support `className` prop, use `cn()` utility
- [ ] 2.2.21 All UI components have associated Storybook stories (optional) or vitest snapshots

### 2.3 Layout & Navigation
- [ ] 2.3.1 Create `app/layout.tsx` — root layout with font (Inter), metadata, providers
- [ ] 2.3.2 Set `metadata.title = "ProofPulse — Verify Before You Trust"`
- [ ] 2.3.3 Set `metadata.description` with SEO-optimized description
- [ ] 2.3.4 Set `metadata.openGraph` with OG image, title, description
- [ ] 2.3.5 Create `components/layout/Navbar.tsx` — logo, nav links, theme toggle (future)
- [ ] 2.3.6 Navbar: logo links to `/`; nav items: Analyze, History, About
- [ ] 2.3.7 Navbar: mobile hamburger menu with slide-out drawer
- [ ] 2.3.8 Navbar: active link highlighting based on current route
- [ ] 2.3.9 Create `components/layout/Footer.tsx` — links, version, disclaimer
- [ ] 2.3.10 Footer disclaimer: "ProofPulse is an AI tool. Always verify with official sources."
- [ ] 2.3.11 Create `components/layout/PageContainer.tsx` — max-width wrapper with padding
- [ ] 2.3.12 Create `app/not-found.tsx` — 404 page with link back to home
- [ ] 2.3.13 Create `app/error.tsx` — error boundary page
- [ ] 2.3.14 Create `app/loading.tsx` — global loading page
- [ ] 2.3.15 Add `public/favicon.ico` and `public/logo.svg`

### 2.4 Home Page (`app/page.tsx`)
- [ ] 2.4.1 Hero section: headline "Verify Before You Trust", subheadline about scam detection
- [ ] 2.4.2 Hero: animated risk score demo (CSS animation cycling through risk levels)
- [ ] 2.4.3 Hero: CTA button "Start Analyzing" scrolls to analyzer
- [ ] 2.4.4 Feature highlights section: 3 cards (Text Analysis, Screenshot Analysis, URL Check)
- [ ] 2.4.5 Stats section: "XX+ scams detected" (pulls from `/api/v1/history/stats`)
- [ ] 2.4.6 How It Works section: 3-step illustration (Submit → Analyze → Review)
- [ ] 2.4.7 Inline Analyzer embed below hero (same component as `/analyze` page)
- [ ] 2.4.8 Testimonials / example results section (static, realistic scam examples)
- [ ] 2.4.9 Mobile responsive layout for all home sections
- [ ] 2.4.10 Smooth scroll behavior via CSS

### 2.5 Analyze Page (`app/analyze/page.tsx`)
- [ ] 2.5.1 Create `app/analyze/page.tsx`
- [ ] 2.5.2 Page title: "Analyze — ProofPulse"
- [ ] 2.5.3 Render `<AnalyzerWidget />` full-width
- [ ] 2.5.4 Breadcrumb: Home > Analyze
- [ ] 2.5.5 Sidebar: "What to look for" tips panel (collapsible on mobile)

### 2.6 Analyzer Widget (`components/analyzer/AnalyzerWidget.tsx`)
- [ ] 2.6.1 Create `components/analyzer/AnalyzerWidget.tsx` — top-level container
- [ ] 2.6.2 Tab bar: Text | Screenshot | URL | Scenario
- [ ] 2.6.3 Persist active tab in URL search params (`?tab=text`)
- [ ] 2.6.4 Create `components/analyzer/TextTab.tsx`
- [ ] 2.6.5 TextTab: `<Textarea>` with placeholder examples of scam messages
- [ ] 2.6.6 TextTab: character counter showing current/max (10000)
- [ ] 2.6.7 TextTab: optional "Context" field (where did you receive this?)
- [ ] 2.6.8 TextTab: "Analyze" button, disabled if empty
- [ ] 2.6.9 TextTab: "Clear" button resets textarea
- [ ] 2.6.10 TextTab: example paste buttons ("Try an example scam →")
- [ ] 2.6.11 Create `components/analyzer/ImageTab.tsx`
- [ ] 2.6.12 ImageTab: drag-and-drop zone via `react-dropzone`
- [ ] 2.6.13 ImageTab: click to browse files (accept image/*)
- [ ] 2.6.14 ImageTab: show image preview after selection
- [ ] 2.6.15 ImageTab: show file name, size, type below preview
- [ ] 2.6.16 ImageTab: "Remove" button clears selection
- [ ] 2.6.17 ImageTab: file size validation on client side (show error if > 10MB)
- [ ] 2.6.18 ImageTab: "Analyze" button, disabled if no file selected
- [ ] 2.6.19 Create `components/analyzer/URLTab.tsx`
- [ ] 2.6.20 URLTab: URL input field with paste button
- [ ] 2.6.21 URLTab: client-side URL format validation
- [ ] 2.6.22 URLTab: "Follow redirects" toggle (on by default)
- [ ] 2.6.23 URLTab: show URL preview/favicon if valid URL
- [ ] 2.6.24 URLTab: "Analyze" button
- [ ] 2.6.25 Create `components/analyzer/ScenarioTab.tsx`
- [ ] 2.6.26 ScenarioTab: text input section (collapsible)
- [ ] 2.6.27 ScenarioTab: URL input section (collapsible)
- [ ] 2.6.28 ScenarioTab: image upload section (collapsible)
- [ ] 2.6.29 ScenarioTab: show badge for each active signal ("Text ✓", "URL ✓", "Image ✓")
- [ ] 2.6.30 ScenarioTab: "Analyze All" button, requires at least 1 input
- [ ] 2.6.31 AnalyzerWidget: show `<AnalysisLoadingState />` during API call
- [ ] 2.6.32 AnalyzerWidget: on success, render `<AnalysisResult />` below the input
- [ ] 2.6.33 AnalyzerWidget: on error, show `<Alert type="error">` with error message
- [ ] 2.6.34 AnalyzerWidget: "Analyze Another" button resets to input state

### 2.7 Analysis Loading State (`components/analyzer/AnalysisLoadingState.tsx`)
- [ ] 2.7.1 Create `components/analyzer/AnalysisLoadingState.tsx`
- [ ] 2.7.2 Animated pulsing spinner in brand color
- [ ] 2.7.3 Rotating status messages: "Extracting evidence…", "Analyzing signals…", "Calculating risk score…", "Preparing your report…"
- [ ] 2.7.4 Messages cycle every 1.5s via `useEffect` + `setInterval`
- [ ] 2.7.5 Estimated time remaining progress bar (approximate based on average latency)
- [ ] 2.7.6 "Cancel" button (aborts the request via `AbortController`)

### 2.8 Analysis Result (`components/analyzer/AnalysisResult.tsx`)
- [ ] 2.8.1 Create `components/analyzer/AnalysisResult.tsx`
- [ ] 2.8.2 Risk score donut/radial chart (0–100, animated fill on mount)
- [ ] 2.8.3 Risk level badge (SAFE/LOW/MEDIUM/HIGH/CRITICAL) with color + icon
- [ ] 2.8.4 Verdict text (large, prominent, e.g., "⚠️ This appears to be a phishing attempt")
- [ ] 2.8.5 Confidence indicator ("Analysis confidence: 94%")
- [ ] 2.8.6 Evidence section: collapsible list of `EvidenceItem` components
- [ ] 2.8.7 `EvidenceItem`: flag icon (🔴/🟡/🟢), label, value, weight bar
- [ ] 2.8.8 Evidence items sorted by weight descending
- [ ] 2.8.9 "Show all evidence" / "Show less" toggle if > 5 items
- [ ] 2.8.10 Recommendations section: numbered list with icons
- [ ] 2.8.11 Next Steps section: action buttons ("Report to FTC", "Block Sender", "Copy Evidence")
- [ ] 2.8.12 "Copy Report" button: copies formatted summary to clipboard
- [ ] 2.8.13 "Share Result" button: copies shareable URL with analysis ID
- [ ] 2.8.14 Analysis metadata footer: analysis_id, timestamp, model used, latency
- [ ] 2.8.15 Feedback widget at bottom: "Was this analysis accurate?" with 👍/👎 + star rating
- [ ] 2.8.16 Feedback: optional comment field shown after rating
- [ ] 2.8.17 Feedback: "Submit Feedback" calls `POST /api/v1/feedback`
- [ ] 2.8.18 Feedback: show "Thank you!" state after submission
- [ ] 2.8.19 Animate result card entry with `framer-motion` slide-in
- [ ] 2.8.20 Full mobile responsive layout

### 2.9 History Page (`app/history/page.tsx`)
- [ ] 2.9.1 Create `app/history/page.tsx`
- [ ] 2.9.2 Page title: "History — ProofPulse"
- [ ] 2.9.3 Stats summary bar: total scans, high-risk count, safe count
- [ ] 2.9.4 Filter controls: risk level dropdown, input type filter, date range picker
- [ ] 2.9.5 History list: `<HistoryCard />` for each item
- [ ] 2.9.6 `HistoryCard`: input type icon, timestamp, risk badge, verdict excerpt, "View" button
- [ ] 2.9.7 Click "View" → opens detail modal or navigates to `/history/[id]`
- [ ] 2.9.8 Pagination controls: previous/next, page number, items-per-page selector
- [ ] 2.9.9 Empty state: "No analyses yet. Start by analyzing something suspicious."
- [ ] 2.9.10 "Clear History" button with confirmation modal
- [ ] 2.9.11 "Export CSV" button: downloads history as CSV file
- [ ] 2.9.12 History fetches on mount via `useHistory` hook
- [ ] 2.9.13 Loading skeleton while fetching
- [ ] 2.9.14 Create `app/history/[id]/page.tsx` — individual analysis detail page
- [ ] 2.9.15 Detail page renders `<AnalysisResult />` in read-only mode with full evidence

### 2.10 API Hooks (`src/hooks/`)
- [ ] 2.10.1 `hooks/useTextAnalysis.ts` — mutation hook wrapping `POST /analyze/text`
- [ ] 2.10.2 `hooks/useImageAnalysis.ts` — mutation hook with FormData for file upload
- [ ] 2.10.3 `hooks/useURLAnalysis.ts` — mutation hook wrapping `POST /analyze/url`
- [ ] 2.10.4 `hooks/useScenarioAnalysis.ts` — mutation hook wrapping `POST /analyze/scenario`
- [ ] 2.10.5 `hooks/useHistory.ts` — query hook with page/filter params
- [ ] 2.10.6 `hooks/useAnalysis.ts` — query hook for single analysis by ID
- [ ] 2.10.7 `hooks/useFeedback.ts` — mutation hook for submitting feedback
- [ ] 2.10.8 `hooks/useStats.ts` — query hook for history stats
- [ ] 2.10.9 `hooks/useHealth.ts` — query hook (poll every 30s) for API health
- [ ] 2.10.10 All hooks: expose `isLoading`, `error`, `data` in consistent shape
- [ ] 2.10.11 All mutation hooks: support `onSuccess` and `onError` callbacks
- [ ] 2.10.12 All hooks use `AbortController` for request cancellation on unmount

### 2.11 About Page (`app/about/page.tsx`)
- [ ] 2.11.1 Create `app/about/page.tsx`
- [ ] 2.11.2 Mission statement: why ProofPulse exists
- [ ] 2.11.3 How it works: technical explanation in plain language
- [ ] 2.11.4 Scam statistics section (static, sourced from public data)
- [ ] 2.11.5 FAQ section with accordion (common questions)
- [ ] 2.11.6 Privacy policy section: what data is stored, how long, how to delete
- [ ] 2.11.7 Link to GitHub repository

### 2.12 Frontend Tests (Vitest + Testing Library)
- [ ] 2.12.1 Configure Vitest with jsdom environment
- [ ] 2.12.2 `tests/components/ui/Button.test.tsx` — renders, click, loading, disabled states
- [ ] 2.12.3 `tests/components/ui/Badge.test.tsx` — risk level variants render correctly
- [ ] 2.12.4 `tests/components/ui/ProgressBar.test.tsx` — 0-100 values display correctly
- [ ] 2.12.5 `tests/components/analyzer/TextTab.test.tsx` — input, clear, character count
- [ ] 2.12.6 `tests/components/analyzer/ImageTab.test.tsx` — dropzone, preview, remove
- [ ] 2.12.7 `tests/components/analyzer/URLTab.test.tsx` — validation, submit
- [ ] 2.12.8 `tests/components/analyzer/AnalysisResult.test.tsx` — renders all risk levels
- [ ] 2.12.9 `tests/components/analyzer/AnalysisResult.test.tsx` — evidence sorted by weight
- [ ] 2.12.10 `tests/pages/history.test.tsx` — list renders, pagination, filter
- [ ] 2.12.11 `tests/hooks/useTextAnalysis.test.ts` — success and error states
- [ ] 2.12.12 Achieve ≥70% component test coverage

---

## 3. END-TO-END TESTS — Playwright (`apps/web/e2e/`)

### 3.1 Playwright Setup
- [ ] 3.1.1 Install `@playwright/test` in `apps/web`
- [ ] 3.1.2 Create `apps/web/playwright.config.ts`
- [ ] 3.1.3 Configure base URL: `http://localhost:3000`
- [ ] 3.1.4 Configure workers: 2 in CI, `undefined` locally
- [ ] 3.1.5 Configure retries: 2 in CI, 0 locally
- [ ] 3.1.6 Enable video on failure, screenshot on failure, trace on failure
- [ ] 3.1.7 Configure HTML reporter
- [ ] 3.1.8 Configure browsers: chromium (required), firefox (optional), webkit (optional)
- [ ] 3.1.9 Create `e2e/fixtures/` directory with test data
- [ ] 3.1.10 Create `e2e/fixtures/scam-text.txt` — realistic phishing SMS
- [ ] 3.1.11 Create `e2e/fixtures/scam-screenshot.png` — fake delivery scam screenshot
- [ ] 3.1.12 Create `e2e/fixtures/safe-text.txt` — legitimate message
- [ ] 3.1.13 Create `e2e/helpers/` directory for reusable page objects
- [ ] 3.1.14 Create `e2e/helpers/AnalyzerPage.ts` — Page Object for analyzer widget
- [ ] 3.1.15 Create `e2e/helpers/HistoryPage.ts` — Page Object for history page
- [ ] 3.1.16 Create `e2e/helpers/api-mock.ts` — MSW or Playwright route intercepts for API mocking

### 3.2 Navigation Tests (`e2e/navigation.spec.ts`)
- [ ] 3.2.1 Homepage loads with correct title "ProofPulse — Verify Before You Trust"
- [ ] 3.2.2 Navbar renders logo, "Analyze", "History", "About" links
- [ ] 3.2.3 Clicking "Analyze" navigates to `/analyze`
- [ ] 3.2.4 Clicking "History" navigates to `/history`
- [ ] 3.2.5 Clicking "About" navigates to `/about`
- [ ] 3.2.6 Clicking logo navigates to `/`
- [ ] 3.2.7 404 page renders for `/nonexistent-route`
- [ ] 3.2.8 "Start Analyzing" CTA scrolls to analyzer widget
- [ ] 3.2.9 Footer renders with disclaimer text
- [ ] 3.2.10 Footer links are functional

### 3.3 Text Analysis Tests (`e2e/text-analysis.spec.ts`)
- [ ] 3.3.1 Text tab is active by default on `/analyze`
- [ ] 3.3.2 Textarea placeholder text is visible
- [ ] 3.3.3 Analyze button is disabled when textarea is empty
- [ ] 3.3.4 Typing in textarea enables Analyze button
- [ ] 3.3.5 Character counter updates as user types
- [ ] 3.3.6 Clear button resets textarea and disables Analyze button
- [ ] 3.3.7 "Try an example scam" fills textarea with example text
- [ ] 3.3.8 Submitting triggers loading state with spinner and rotating messages
- [ ] 3.3.9 Cancel button during loading aborts request and resets to input state
- [ ] 3.3.10 Successful analysis shows AnalysisResult component
- [ ] 3.3.11 Risk score donut chart is visible with correct value
- [ ] 3.3.12 Risk level badge renders with correct color class
- [ ] 3.3.13 Verdict text is visible and non-empty
- [ ] 3.3.14 Evidence section is visible with at least 1 item
- [ ] 3.3.15 Recommendations section is visible with at least 1 item
- [ ] 3.3.16 Next Steps section is visible
- [ ] 3.3.17 Analysis ID and timestamp are shown in metadata footer
- [ ] 3.3.18 "Copy Report" copies text to clipboard (check clipboard API)
- [ ] 3.3.19 "Analyze Another" resets to input state
- [ ] 3.3.20 Context field is optional — analyze succeeds without it
- [ ] 3.3.21 Context field value is sent with request (intercept network call)
- [ ] 3.3.22 Submitting with scam text returns HIGH or CRITICAL risk level
- [ ] 3.3.23 Submitting with safe text returns SAFE or LOW risk level
- [ ] 3.3.24 Network error shows error alert with user-friendly message
- [ ] 3.3.25 Very long text (9999 chars) is accepted and analyzed

### 3.4 Image Analysis Tests (`e2e/image-analysis.spec.ts`)
- [ ] 3.4.1 Clicking "Screenshot" tab shows image dropzone
- [ ] 3.4.2 Dropzone shows correct label and icon
- [ ] 3.4.3 Analyze button disabled when no file selected
- [ ] 3.4.4 Upload file via `page.setInputFiles()`
- [ ] 3.4.5 Image preview renders after upload
- [ ] 3.4.6 File name and size display below preview
- [ ] 3.4.7 Remove button clears preview and disables Analyze button
- [ ] 3.4.8 File > 10MB shows client-side error, no API call made
- [ ] 3.4.9 Non-image file (e.g., .pdf) shows validation error
- [ ] 3.4.10 Valid image triggers loading state on Analyze click
- [ ] 3.4.11 Successful analysis shows AnalysisResult
- [ ] 3.4.12 OCR-extracted text is indicated somewhere in result
- [ ] 3.4.13 Drag and drop file onto dropzone (simulate with `page.dispatchEvent`)
- [ ] 3.4.14 Multiple files — only first accepted

### 3.5 URL Analysis Tests (`e2e/url-analysis.spec.ts`)
- [ ] 3.5.1 Clicking "URL" tab shows URL input field
- [ ] 3.5.2 Input placeholder text is visible
- [ ] 3.5.3 Analyze button disabled when field is empty
- [ ] 3.5.4 Typing URL enables Analyze button
- [ ] 3.5.5 Paste button fills input from clipboard
- [ ] 3.5.6 Invalid URL format shows inline validation error
- [ ] 3.5.7 "Follow redirects" toggle is on by default
- [ ] 3.5.8 Toggling "Follow redirects" off sends correct flag in request
- [ ] 3.5.9 Valid URL triggers loading state
- [ ] 3.5.10 Successful analysis shows AnalysisResult
- [ ] 3.5.11 Suspicious URL returns elevated risk level
- [ ] 3.5.12 Redirect chain is shown in evidence (if redirects detected)

### 3.6 Scenario Analysis Tests (`e2e/scenario-analysis.spec.ts`)
- [ ] 3.6.1 Clicking "Scenario" tab shows multi-input layout
- [ ] 3.6.2 All three input sections are collapsible
- [ ] 3.6.3 Analyze button disabled when all inputs are empty
- [ ] 3.6.4 Adding text input enables Analyze button
- [ ] 3.6.5 Signal badges appear as inputs are added
- [ ] 3.6.6 All three inputs can be filled simultaneously
- [ ] 3.6.7 Analyze with all three inputs triggers single API call to `/analyze/scenario`
- [ ] 3.6.8 Result shows combined evidence from all signals
- [ ] 3.6.9 Result confidence is higher for multi-signal vs single-signal

### 3.7 History Page Tests (`e2e/history.spec.ts`)
- [ ] 3.7.1 History page loads at `/history`
- [ ] 3.7.2 Empty state shows when no analyses exist
- [ ] 3.7.3 After analysis, history page shows new entry
- [ ] 3.7.4 History card shows correct input type icon
- [ ] 3.7.5 History card shows risk badge with correct color
- [ ] 3.7.6 History card shows timestamp
- [ ] 3.7.7 History card shows truncated verdict
- [ ] 3.7.8 Clicking "View" opens detail view / modal
- [ ] 3.7.9 Detail view shows full AnalysisResult with evidence
- [ ] 3.7.10 Risk level filter: selecting "HIGH" shows only HIGH/CRITICAL entries
- [ ] 3.7.11 Input type filter: selecting "text" shows only text analyses
- [ ] 3.7.12 Pagination: next/previous buttons navigate pages
- [ ] 3.7.13 Items per page selector changes number of visible cards
- [ ] 3.7.14 Stats bar shows correct total scan count
- [ ] 3.7.15 "Export CSV" downloads a `.csv` file
- [ ] 3.7.16 "Clear History" button shows confirmation modal
- [ ] 3.7.17 Confirming clear removes all entries and shows empty state
- [ ] 3.7.18 Canceling clear leaves entries intact

### 3.8 Feedback Tests (`e2e/feedback.spec.ts`)
- [ ] 3.8.1 Feedback widget visible at bottom of AnalysisResult
- [ ] 3.8.2 "Was this analysis accurate?" prompt is visible
- [ ] 3.8.3 Clicking 👍 shows star rating and optional comment field
- [ ] 3.8.4 Clicking 👎 shows star rating and optional comment field
- [ ] 3.8.5 Selecting star rating enables "Submit Feedback" button
- [ ] 3.8.6 Entering comment and submitting sends feedback to API
- [ ] 3.8.7 After submission: "Thank you!" state shown
- [ ] 3.8.8 Feedback widget is removed/disabled after submission (no double submit)
- [ ] 3.8.9 Submitting without comment succeeds (comment is optional)

### 3.9 Accessibility Tests (`e2e/accessibility.spec.ts`)
- [ ] 3.9.1 Install `@axe-core/playwright`
- [ ] 3.9.2 Home page: zero axe violations
- [ ] 3.9.3 Analyze page: zero axe violations
- [ ] 3.9.4 History page: zero axe violations
- [ ] 3.9.5 Analysis result: zero axe violations
- [ ] 3.9.6 All interactive elements reachable via Tab key
- [ ] 3.9.7 Modal closes on Escape key
- [ ] 3.9.8 Focus is trapped inside modal when open
- [ ] 3.9.9 Focus returns to trigger element after modal closes
- [ ] 3.9.10 All images have non-empty alt text
- [ ] 3.9.11 Color contrast ratio ≥ 4.5:1 for all text (auto-checked by axe)
- [ ] 3.9.12 Risk level information is not conveyed by color alone (icon + text also present)

### 3.10 Responsive Design Tests (`e2e/responsive.spec.ts`)
- [ ] 3.10.1 Configure viewport sizes: mobile (375x667), tablet (768x1024), desktop (1440x900)
- [ ] 3.10.2 Homepage renders correctly on mobile
- [ ] 3.10.3 Navbar collapses to hamburger on mobile
- [ ] 3.10.4 Hamburger opens mobile menu with all nav links
- [ ] 3.10.5 Analyzer widget usable on mobile (tabs, input, result all visible)
- [ ] 3.10.6 History list displays correctly on mobile (no horizontal scroll)
- [ ] 3.10.7 AnalysisResult card readable on mobile (no text overflow)
- [ ] 3.10.8 Evidence list collapsible works on mobile
- [ ] 3.10.9 Tablet layout between mobile/desktop (check mid-breakpoint)
- [ ] 3.10.10 Desktop layout: sidebar visible on analyze page

### 3.11 Performance Tests (`e2e/performance.spec.ts`)
- [ ] 3.11.1 Homepage LCP < 2.5s (use `performance.getEntriesByType`)
- [ ] 3.11.2 Analyze page loads in < 1s (DOMContentLoaded)
- [ ] 3.11.3 Analysis API response < 10s under normal conditions
- [ ] 3.11.4 No layout shift (CLS) on result appearance (use PerformanceObserver)
- [ ] 3.11.5 JS bundle size < 500KB gzipped (check via build output)

### 3.12 Error State Tests (`e2e/error-states.spec.ts`)
- [ ] 3.12.1 API down: shows "Service unavailable" message, not a crash
- [ ] 3.12.2 Network timeout: shows timeout-specific error message
- [ ] 3.12.3 Rate limited (429): shows "Too many requests, please wait" message
- [ ] 3.12.4 Unprocessable input (422): shows field-level validation errors
- [ ] 3.12.5 Server error (500): shows generic "Something went wrong" + retry button
- [ ] 3.12.6 Retry button on error re-submits same request
- [ ] 3.12.7 History page: if API fails to load, shows error state with refresh button
- [ ] 3.12.8 No results found: empty state renders (not a crash)

---

## 4. DEVOPS & DEPLOYMENT

### 4.1 CI/CD Pipeline
- [ ] 4.1.1 GitHub Actions: `ci.yml` triggers on push to any branch and PR to main
- [ ] 4.1.2 CI job: `backend-lint` — run `ruff check` and `black --check`
- [ ] 4.1.3 CI job: `backend-typecheck` — run `mypy src/`
- [ ] 4.1.4 CI job: `backend-test` — run `pytest` with coverage report
- [ ] 4.1.5 CI job: `frontend-lint` — run `eslint` and `tsc --noEmit`
- [ ] 4.1.6 CI job: `frontend-test` — run `vitest run`
- [ ] 4.1.7 CI job: `e2e-test` — start both servers, run Playwright
- [ ] 4.1.8 CI: cache pip dependencies between runs
- [ ] 4.1.9 CI: cache npm/node_modules between runs
- [ ] 4.1.10 CI: upload Playwright HTML report as artifact on failure
- [ ] 4.1.11 CI: upload pytest coverage report as artifact
- [ ] 4.1.12 CI: fail fast if any job fails

### 4.2 Docker & Container
- [ ] 4.2.1 Backend Dockerfile: multi-stage (build → runtime)
- [ ] 4.2.2 Backend image: install tesseract-ocr system package
- [ ] 4.2.3 Backend image: non-root user
- [ ] 4.2.4 Frontend Dockerfile: multi-stage (deps → builder → runner)
- [ ] 4.2.5 Frontend image: `npm run build` in builder stage
- [ ] 4.2.6 Frontend image: standalone Next.js output in runner stage
- [ ] 4.2.7 `docker-compose.yml`: connect api and web with internal network
- [ ] 4.2.8 `docker-compose.yml`: mount SQLite volume for DB persistence
- [ ] 4.2.9 `docker-compose.yml`: pass env vars from `.env` file
- [ ] 4.2.10 `docker-compose up` starts both services on correct ports

### 4.3 Deployment
- [ ] 4.3.1 Backend: deploy to Railway / Render (configure web service)
- [ ] 4.3.2 Backend: set all env vars in deployment dashboard
- [ ] 4.3.3 Backend: configure health check endpoint for deployment platform
- [ ] 4.3.4 Frontend: deploy to Vercel (connect GitHub repo)
- [ ] 4.3.5 Frontend: set `NEXT_PUBLIC_API_URL` to deployed backend URL
- [ ] 4.3.6 Frontend: configure Vercel project for `apps/web` directory
- [ ] 4.3.7 Verify end-to-end flow on production deployment
- [ ] 4.3.8 Set up custom domain (if available)
- [ ] 4.3.9 Configure HTTPS / SSL on backend deployment
- [ ] 4.3.10 Run smoke test against production after deploy

---

## 5. DEMO & HACKATHON SUBMISSION

### 5.1 Demo Preparation
- [ ] 5.1.1 Identify 5 compelling demo scenarios (phishing SMS, fake job offer, wire fraud email, malicious link, scam screenshot)
- [ ] 5.1.2 Script demo walkthrough: problem → solution → live demo → impact
- [ ] 5.1.3 Seed DB with 10+ pre-analyzed examples so history page looks populated
- [ ] 5.1.4 Create demo mode toggle (hide API keys from screen during demo)
- [ ] 5.1.5 Test entire demo flow on production deployment (not localhost)
- [ ] 5.1.6 Record 2-3 minute demo video for Devpost submission
- [ ] 5.1.7 Video: show scam detection in real-time
- [ ] 5.1.8 Video: show evidence breakdown screen
- [ ] 5.1.9 Video: show history page
- [ ] 5.1.10 Video: narrate impact statement

### 5.2 Devpost Submission
- [ ] 5.2.1 Write project title: "ProofPulse — Verify Before You Trust"
- [ ] 5.2.2 Write 3-sentence tagline
- [ ] 5.2.3 Write "What it does" section (2 paragraphs)
- [ ] 5.2.4 Write "How we built it" section (tech stack details)
- [ ] 5.2.5 Write "Challenges we ran into" section ("the hardest part in 24 hours")
- [ ] 5.2.6 Write "Accomplishments" section
- [ ] 5.2.7 Write "What we learned" section
- [ ] 5.2.8 Write "What's next" section (post-hackathon roadmap)
- [ ] 5.2.9 Add screenshots: landing page, analyzer with result, evidence breakdown, history page
- [ ] 5.2.10 Add public GitHub link
- [ ] 5.2.11 Add live deployment link
- [ ] 5.2.12 Add demo video link
- [ ] 5.2.13 List all technologies used
- [ ] 5.2.14 Submit to ThunderHacks (by Mar 15)
- [ ] 5.2.15 Submit to NextDev Hackathon (by Mar 24)
- [ ] 5.2.16 Submit to Develop the Next (by Mar 25)

### 5.3 README Polish
- [ ] 5.3.1 Add project logo/banner image to README
- [ ] 5.3.2 Add live demo badge linking to deployment
- [ ] 5.3.3 Add CI status badge
- [ ] 5.3.4 Rewrite quick start section to be copy-paste friendly
- [ ] 5.3.5 Add screenshots section with 3+ images
- [ ] 5.3.6 Add API documentation section (link to `/docs` FastAPI UI)
- [ ] 5.3.7 Add architecture diagram (simple ASCII or Mermaid)
- [ ] 5.3.8 Add "Built for" section mentioning hackathons
- [ ] 5.3.9 Add contributor section

---

## 6. POLISH & STRETCH GOALS

### 6.1 UX Polish
- [ ] 6.1.1 Add confetti animation when scam is detected (🎉 "You caught a scam!")
- [ ] 6.1.2 Add subtle sound effect on CRITICAL risk result (optional, respects prefers-reduced-motion)
- [ ] 6.1.3 Dark mode support via `prefers-color-scheme` + manual toggle
- [ ] 6.1.4 Persistent dark mode preference via localStorage
- [ ] 6.1.5 Smooth tab transition animation (framer-motion)
- [ ] 6.1.6 Typewriter effect on verdict text (character-by-character reveal)
- [ ] 6.1.7 Risk score animates from 0 to final value on mount (1.5s ease)
- [ ] 6.1.8 "Share on Twitter" button: pre-filled tweet with result summary
- [ ] 6.1.9 PWA support: `manifest.json`, service worker, installable
- [ ] 6.1.10 Keyboard shortcut: `Cmd+Enter` submits analysis

### 6.2 Feature Stretch Goals
- [ ] 6.2.1 Browser extension stub: detect URLs on current page
- [ ] 6.2.2 Email `.eml` file upload support
- [ ] 6.2.3 Batch analysis: upload multiple messages at once
- [ ] 6.2.4 API key / simple auth for history privacy
- [ ] 6.2.5 Community threat feed: share scam patterns anonymously
- [ ] 6.2.6 Scam pattern library: browse known scam templates
- [ ] 6.2.7 Real-time scam alert feed (simulated for demo)
- [ ] 6.2.8 Multi-language support (i18n with next-intl)
- [ ] 6.2.9 PDF report export (jsPDF)
- [ ] 6.2.10 Webhook support: POST analysis result to custom URL

---

*Total tasks: 600+*
*Generated for ProofPulse hackathon submission — ThunderHacks (Mar 15), NextDev (Mar 24), Develop the Next (Mar 25)*
