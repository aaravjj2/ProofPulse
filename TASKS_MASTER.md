# ProofPulse — Master Task List (4-Year Plan)
> Stack: Next.js 14 · TypeScript · Tailwind CSS · FastAPI · Python 3.11 · SQLite→Postgres · OpenAI GPT-4o · Tesseract · Playwright · pytest
> Current state: 102 backend tests (83% cov) · 36 E2E Playwright tests · dark mode · Railway/Vercel config ready
> Today: Mar 15 2026 · NextDev deadline Mar 24 · Develop the Next Mar 25

---

## LEGEND
`[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked · `[→]` deferred

## PRIORITY TIERS
🔴 P0 — blocks submission/deployment  
🟠 P1 — high impact, do this week  
🟡 P2 — important, do this month  
🟢 P3 — phase 2+, planned  
⚪ P4 — phase 3+, future  

---

# ══════════════════════════════════════════
# YEAR 1 — PHASE 1: SHIP & WIN (Now → Jun 2026)
# ══════════════════════════════════════════

## 0. IMMEDIATE: DEPLOY & SUBMIT (P0 — next 48 hours)

### 0.1 Production deployment
- [ ] 0.1.1 🔴 Verify CI run #6 green on all 3 jobs (backend-test, frontend-lint, e2e-test)
- [ ] 0.1.2 🔴 Add `apps/api/nixpacks.toml` with tesseract apt packages if missing
- [ ] 0.1.3 🔴 Add `apps/api/railway.json` with startCommand + healthcheckPath if missing
- [ ] 0.1.4 🔴 Deploy backend to Railway — set all env vars before first deploy
- [ ] 0.1.5 🔴 Deploy frontend to Vercel — set NEXT_PUBLIC_API_URL to Railway URL
- [ ] 0.1.6 🔴 Update Railway CORS_ORIGINS to Vercel URL then redeploy Railway
- [ ] 0.1.7 🔴 Smoke test Railway: `curl /api/v1/health` returns `{"status":"ok"}`
- [ ] 0.1.8 🔴 Smoke test Vercel: full analyze → result flow in incognito browser
- [ ] 0.1.9 🔴 Smoke test image upload on prod (Tesseract must work)
- [ ] 0.1.10 🔴 Smoke test URL analysis on prod

### 0.2 Screenshots and README
- [ ] 0.2.1 🔴 Run 4 sample analyses on prod to populate history
- [ ] 0.2.2 🔴 Screenshot: analyze page with CRITICAL result (dark mode, evidence visible)
- [ ] 0.2.3 🔴 Screenshot: evidence expanded with all red/yellow/green flags
- [ ] 0.2.4 🔴 Screenshot: history page with 5+ entries (mixed risk levels)
- [ ] 0.2.5 🔴 Screenshot: home page hero with stats counter showing real number
- [ ] 0.2.6 🔴 Screenshot: mobile view at 390px width (DevTools)
- [ ] 0.2.7 🔴 Save all to `docs/screenshots/`
- [ ] 0.2.8 🔴 Replace all placeholder URLs in README with real Railway + Vercel URLs
- [ ] 0.2.9 🔴 Confirm README CI badge shows green
- [ ] 0.2.10 🔴 Push: `git commit -m "docs: add screenshots, live URLs" && git push`

### 0.3 Hackathon submissions
- [ ] 0.3.1 🔴 Record 2:30 demo video (dark mode, 3 scenarios, evidence zoom, history)
- [ ] 0.3.2 🔴 Upload to YouTube Unlisted or Loom
- [ ] 0.3.3 🔴 Create `docs/DEVPOST_SUBMISSION.md` with all pre-written copy
- [ ] 0.3.4 🔴 Submit to NextDev (https://nextdev-hackathon.devpost.com) by Mar 24
- [ ] 0.3.5 🔴 Submit to Develop the Next (https://developnext.devpost.com) by Mar 25
- [ ] 0.3.6 🟠 Add repo topics: ai, scam-detection, fastapi, nextjs, openai, hackathon, playwright
- [ ] 0.3.7 🟠 Set repo description on GitHub

---

## 1. FRONTEND DESIGN — PHASE 1 POLISH

### 1.1 Design system foundations
- [ ] 1.1.1 🟠 Create `apps/web/src/lib/design-tokens.ts` — single source of truth for all color values, spacing, radius, animation durations
- [ ] 1.1.2 🟠 Define risk color semantic tokens: `RISK_COLORS`, `RISK_BORDER`, `RISK_BG`, `RISK_ICON` — all keyed to `RiskLevel` type
- [ ] 1.1.3 🟠 Define animation tokens: `DURATION_FAST=150ms`, `DURATION_NORMAL=300ms`, `DURATION_SLOW=600ms`, `DURATION_SCORE=1200ms`
- [ ] 1.1.4 🟠 Ensure `tailwind.config.ts` extends with all custom colors, keyframes (`pulse-border`, `count-up`, `slide-up`, `stagger-in`)
- [ ] 1.1.5 🟠 Define typography scale in `globals.css`: heading sizes, body, caption, mono — all using CSS custom properties
- [ ] 1.1.6 🟡 Add `apps/web/src/lib/cn.ts` utility (clsx + tailwind-merge) if not exists
- [ ] 1.1.7 🟡 Add `apps/web/src/lib/format.ts` — `formatRiskScore`, `formatDate`, `formatLatency`, `formatInputType`, `formatConfidence`
- [ ] 1.1.8 🟡 Add `apps/web/src/lib/constants.ts` — `RISK_LABELS`, `RISK_DESCRIPTIONS`, `INPUT_TYPE_ICONS`, `MAX_EVIDENCE_VISIBLE`

### 1.2 Core UI component audit and completion
- [ ] 1.2.1 🟠 `Button.tsx` — verify all 4 variants (primary, secondary, ghost, danger) render correctly in dark mode
- [ ] 1.2.2 🟠 `Button.tsx` — verify loading state (spinner replaces icon, text changes to "Analyzing...", disabled)
- [ ] 1.2.3 🟠 `Badge.tsx` — verify all 5 risk levels have distinct colors, icons, and accessible contrast ratios in both modes
- [ ] 1.2.4 🟠 `Badge.tsx` — add `size` prop: `sm` (12px), `md` (14px default), `lg` (16px)
- [ ] 1.2.5 🟠 `ProgressBar.tsx` — verify color matches risk level (not always blue)
- [ ] 1.2.6 🟠 `Skeleton.tsx` — verify skeleton renders correctly in dark mode (not invisible)
- [ ] 1.2.7 🟠 `Toast.tsx` — verify all 4 types (success, error, warning, info) render and auto-dismiss at 4s
- [ ] 1.2.8 🟡 `Tooltip.tsx` — add `delay` prop (default 400ms), ensure keyboard-accessible
- [ ] 1.2.9 🟡 `Modal.tsx` — verify focus trap, Escape close, scroll lock, backdrop click dismiss
- [ ] 1.2.10 🟡 `CopyButton.tsx` — implement: copy → show Check icon for 2s → revert to Copy icon
- [ ] 1.2.11 🟡 `EmptyState.tsx` — add SVG illustration (shield/magnifying glass), heading, subtext, optional CTA button
- [ ] 1.2.12 🟡 `Alert.tsx` — add `dismissible` prop with X button and fade-out animation

### 1.3 Risk score donut chart
- [ ] 1.3.1 🟠 `RiskScoreDonut.tsx` — SVG circle with `stroke-dashoffset` animated from 0 → final value
- [ ] 1.3.2 🟠 Animate using `requestAnimationFrame` with `cubic-bezier(0.34, 1.56, 0.64, 1)` easing over 1200ms
- [ ] 1.3.3 🟠 Numeric counter inside donut: counts up from 0 → final score in sync with ring animation
- [ ] 1.3.4 🟠 Color of ring = risk level color (not always brand blue)
- [ ] 1.3.5 🟠 Below ring: risk level label with `Badge` component, fades in 300ms after ring completes
- [ ] 1.3.6 🟠 `useReducedMotion()` check — if true, jump straight to final value, no animation
- [ ] 1.3.7 🟡 Add size variants: `sm` (80px diameter), `md` (120px default), `lg` (160px)
- [ ] 1.3.8 🟡 Add `data-testid="risk-score-donut"` and `data-testid="risk-score-value"` for Playwright

### 1.4 Analysis result card
- [ ] 1.4.1 🟠 `ResultCard.tsx` — entry animation: `motion.div` slide up 24px + fade in over 400ms
- [ ] 1.4.2 🟠 Risk-level card border: SAFE=green, LOW=blue, MEDIUM=amber, HIGH=orange, CRITICAL=red pulsing
- [ ] 1.4.3 🟠 CRITICAL border: CSS `@keyframes pulse-border` alternating opacity 70%→100% at 2s
- [ ] 1.4.4 🟠 Verdict text: 20px, font-weight 500, color matches risk level, `data-testid="verdict-text"`
- [ ] 1.4.5 🟠 Confidence row: "Analysis confidence: 94%" with small info tooltip explaining what it means
- [ ] 1.4.6 🟠 Evidence section: `data-testid="evidence-section"`, sorted by `weight` descending
- [ ] 1.4.7 🟠 Evidence items: stagger in with `staggerChildren: 0.08` framer-motion after card entry
- [ ] 1.4.8 🟠 Evidence item left border color: red/amber/green matching `flag` field
- [ ] 1.4.9 🟠 Evidence item weight bar: mini progress bar, colored by flag, shows `weight * 100`%
- [ ] 1.4.10 🟡 "Show all evidence" toggle if >5 items — shows 3 initially, expand to all
- [ ] 1.4.11 🟠 Recommendations: numbered list with icons, stagger in after evidence
- [ ] 1.4.12 🟠 Next steps: action-oriented buttons (Report, Block, Copy, Share)
- [ ] 1.4.13 🟠 Copy Report: copies formatted text report to clipboard, shows check icon 2s
- [ ] 1.4.14 🟡 Share Result: copies `${window.location.origin}/result/${analysis_id}` to clipboard
- [ ] 1.4.15 🟠 Metadata footer: analysis ID, timestamp, model used, latency in ms — muted text, small
- [ ] 1.4.16 🟠 All `data-testid` attributes present: `analysis-result`, `risk-badge`, `verdict-text`, `evidence-section`, `feedback-widget`

### 1.5 Loading state
- [ ] 1.5.1 🟠 5 rotating messages cycling every 1800ms: "Scanning for patterns…", "Analyzing signals…", "Weighing evidence…", "Calculating risk score…", "Preparing your report…"
- [ ] 1.5.2 🟠 Fake progress bar filling asymptotically to 90% over 8s using `requestAnimationFrame`
- [ ] 1.5.3 🟠 Cancel button: calls `AbortController.abort()`, resets to input state immediately
- [ ] 1.5.4 🟡 Long-wait message after 12s: "This one's taking a little longer than usual…"
- [ ] 1.5.5 🟠 Minimum display time: 600ms even if API responds faster (prevents flash)
- [ ] 1.5.6 🟠 `data-testid="loading-state"` on container

### 1.6 Analyzer widget tabs
- [ ] 1.6.1 🟠 Tab state persisted in URL: `?tab=text|image|url|scenario`
- [ ] 1.6.2 🟠 Active tab indicator slides (not jumps) using framer-motion `layoutId`
- [ ] 1.6.3 🟠 Text tab: character counter `{current}/{10000}`, goes amber at 8000, red at 9500
- [ ] 1.6.4 🟠 Text tab: "Try an example" dropdown with 3 preset scam scenarios
- [ ] 1.6.5 🟠 Text tab: context field optional — add `?` tooltip explaining its purpose
- [ ] 1.6.6 🟠 Image tab: drag-and-drop zone, dashed border pulses on `dragover`
- [ ] 1.6.7 🟠 Image tab: image preview with file name/size, Remove button
- [ ] 1.6.8 🟠 Image tab: client-side file size validation (>10MB shows inline error, no request)
- [ ] 1.6.9 🟠 URL tab: URL validation shows inline error on blur if invalid format
- [ ] 1.6.10 🟠 URL tab: follow-redirects toggle, on by default
- [ ] 1.6.11 🟠 Scenario tab: signal badges appear dynamically as inputs are filled (Text ✓, URL ✓, Image ✓)
- [ ] 1.6.12 🟠 All tabs: AbortController cancels in-flight request when tab switches
- [ ] 1.6.13 🟠 All tabs: "Analyze Another" smooth scrolls to input after result

### 1.7 Home page
- [ ] 1.7.1 🟠 Hero headline: "Is this a scam?" in large type, subheadline one sentence
- [ ] 1.7.2 🟠 Live stats: "X analyses completed · Y scams caught" — fetches `/api/v1/history/stats` on mount
- [ ] 1.7.3 🟠 Stats counter: animates up from 0 on first viewport intersection
- [ ] 1.7.4 🟡 Two example result cards (static): one CRITICAL (IRS scam), one SAFE (conference follow-up)
- [ ] 1.7.5 🟠 How It Works: 3 steps with numbered icons — Submit, Analyze, Review evidence
- [ ] 1.7.6 🟠 Feature cards: 3 cards with icons — Text, Screenshot, URL
- [ ] 1.7.7 🟡 Scam impact stat: "$442B lost to scams globally in 2025" with source link
- [ ] 1.7.8 🟠 CTA button prominent: "Analyze Something Now →" links to `/analyze`

### 1.8 History page
- [ ] 1.8.1 🟠 Stats bar: total scans, scams caught (HIGH+CRITICAL count), avg risk score — all from `/history/stats`
- [ ] 1.8.2 🟠 Filter: risk level dropdown, input type dropdown — applied client-side
- [ ] 1.8.3 🟠 History card: input type icon, relative timestamp ("2 hours ago"), risk badge, verdict excerpt (80 chars)
- [ ] 1.8.4 🟠 History card hover: translate-y-0.5 + box-shadow transition 150ms
- [ ] 1.8.5 🟠 Click card → navigates to `/history/[id]` showing full result in read-only mode
- [ ] 1.8.6 🟠 Empty state: SVG illustration + "No analyses yet" + CTA to `/analyze`
- [ ] 1.8.7 🟠 Pagination: prev/next, page numbers, items per page selector (10, 20, 50)
- [ ] 1.8.8 🟡 Export CSV: `URL.createObjectURL` + `<a download>` — columns: id, date, type, risk_level, risk_score, verdict
- [ ] 1.8.9 🟠 Clear history: confirmation modal "Delete all X analyses? This cannot be undone." with red confirm button
- [ ] 1.8.10 🟠 After clear: empty state renders immediately, no page refresh

### 1.9 About page
- [ ] 1.9.1 🟡 Mission statement with tagline "Verify before you trust."
- [ ] 1.9.2 🟡 Scam statistics section with real data + FTC source link
- [ ] 1.9.3 🟡 FAQ accordion: 5 questions covering data privacy, accuracy, free status, scam types
- [ ] 1.9.4 🟡 How it works technical section (architecture diagram or 3-step visual)
- [ ] 1.9.5 🟡 GitHub link with star badge

### 1.10 Shareable result page (P1 quick win)
- [ ] 1.10.1 🟠 Create `apps/web/src/app/result/[id]/page.tsx`
- [ ] 1.10.2 🟠 Fetch analysis by ID from `GET /api/v1/history/{id}`
- [ ] 1.10.3 🟠 Render `<ResultCard>` in read-only mode (no feedback widget, no analyze-another)
- [ ] 1.10.4 🟠 Add `<head>` metadata: OG title "ProofPulse — Risk Score: X/100", description = verdict
- [ ] 1.10.5 🟠 Share button in main result now actually links to this page
- [ ] 1.10.6 🟠 Handle 404 for invalid/deleted analysis IDs gracefully

---

## 2. BACKEND — PHASE 1 COMPLETION

### 2.1 Missing backend features
- [ ] 2.1.1 🟠 `DELETE /api/v1/history/{id}` — soft delete (set `deleted_at`) — verify excluded from list queries
- [ ] 2.1.2 🟠 `DELETE /api/v1/history` — bulk clear with confirmation header `X-Confirm-Clear: true`
- [ ] 2.1.3 🟠 `GET /api/v1/history/stats` — verify returns `total_analyses`, `avg_risk_score`, `scam_rate_pct`, `analyses_by_day` (7 days)
- [ ] 2.1.4 🟠 `GET /api/v1/history/{id}` — returns 404 with message for soft-deleted items
- [ ] 2.1.5 🟡 `GET /api/v1/result/{id}` — public read-only endpoint, no auth needed (for shareable URLs)
- [ ] 2.1.6 🟡 Add `input_preview` field to history list items — first 100 chars of raw_input for display
- [ ] 2.1.7 🟡 Add `GET /api/v1/health/ready` and `GET /api/v1/health/live` for k8s probes

### 2.2 Backend hardening
- [ ] 2.2.1 🟠 Verify all endpoints return `X-Request-ID` header (UUID per request)
- [ ] 2.2.2 🟠 Verify all endpoints return `X-Latency-Ms` header
- [ ] 2.2.3 🟠 Verify `CORS_ORIGINS` list excludes `localhost` in production environment
- [ ] 2.2.4 🟠 Verify `deleted_at IS NULL` filter in all history list queries
- [ ] 2.2.5 🟠 Verify `POST /feedback` returns 409 (not 500) on duplicate analysis_id
- [ ] 2.2.6 🟡 Add request body size limit: 10MB (prevents DoS via large payload)
- [ ] 2.2.7 🟡 Add IP-based rate limiting (use X-Forwarded-For behind Railway proxy)
- [ ] 2.2.8 🟡 Add structured logging — every request logs: method, path, status, latency, request_id
- [ ] 2.2.9 🟡 OpenAI retry: exponential backoff 3 attempts (0.5s, 1s, 2s) on RateLimitError
- [ ] 2.2.10 🟡 URL scanner: cache results 24h in `url_cache` table (hash URL with SHA-256)

### 2.3 Backend test coverage (83% → 90%)
- [ ] 2.3.1 🟡 Add `test_url_scanner_timeout` — mock httpx to raise `TimeoutException`, expect graceful partial result
- [ ] 2.3.2 🟡 Add `test_url_scanner_redirect_chain` — mock 3 redirects, verify all captured
- [ ] 2.3.3 🟡 Add `test_llm_json_parse_failure_retries` — first call returns invalid JSON, second succeeds
- [ ] 2.3.4 🟡 Add `test_llm_rate_limit_backoff` — mock RateLimitError twice then success
- [ ] 2.3.5 🟡 Add `test_ocr_tesseract_not_found` — mock TesseractNotFoundError, expect 503 with message
- [ ] 2.3.6 🟡 Add `test_history_soft_delete_excluded` — deleted item not in list, 404 on direct get
- [ ] 2.3.7 🟡 Add `test_history_stats_accuracy` — seed 5 known analyses, verify each stat field
- [ ] 2.3.8 🟡 Add `test_feedback_duplicate_409` — submit feedback twice, second returns 409
- [ ] 2.3.9 🟡 Add `test_scenario_concurrent_execution` — patch asyncio.gather, verify called once
- [ ] 2.3.10 🟡 Add `test_clear_history_requires_header` — without header, returns 400; with header, clears
- [ ] 2.3.11 🟡 Run `pytest --cov=src --cov-fail-under=90` — must pass

---

## 3. PLAYWRIGHT E2E TESTING — COMPLETE SUITE

### 3.1 Test infrastructure setup
- [ ] 3.1.1 🟠 `playwright.config.ts` — confirm `headless: false` for local runs, `headless: true` in CI only
- [ ] 3.1.2 🟠 `playwright.config.ts` — `use: { video: 'retain-on-failure', screenshot: 'on', trace: 'on-first-retry' }`
- [ ] 3.1.3 🟠 `playwright.config.ts` — `reporter: [['html'], ['line']]`
- [ ] 3.1.4 🟠 Create `e2e/helpers/mock-responses.ts` — `MOCK_CRITICAL`, `MOCK_HIGH`, `MOCK_MEDIUM`, `MOCK_SAFE`, `MOCK_HISTORY`, `MOCK_STATS`
- [ ] 3.1.5 🟠 Create `e2e/helpers/AnalyzerPage.ts` — Page Object with all locators, `analyzeText()`, `analyzeURL()`, `analyzeImage()` helpers
- [ ] 3.1.6 🟠 Create `e2e/helpers/HistoryPage.ts` — Page Object with `waitForEntries()`, `filterByRisk()`, `clickEntry()` helpers
- [ ] 3.1.7 🟠 Create `e2e/fixtures/scam-text.txt`, `e2e/fixtures/safe-text.txt`, `e2e/fixtures/scam-screenshot.png`
- [ ] 3.1.8 🟠 All tests that hit `/analyze/*` endpoints: must have `page.route()` mock BEFORE the action
- [ ] 3.1.9 🟠 All tests that hit `/history` endpoint: must have `page.route()` mock
- [ ] 3.1.10 🟠 Global `beforeEach` in `e2e/global-setup.ts` — intercept unhandled console errors, fail test if any `console.error` fires

### 3.2 Navigation tests (`e2e/navigation.spec.ts`)
- [ ] 3.2.1 🟠 Homepage title is "ProofPulse — Verify Before You Trust"
- [ ] 3.2.2 🟠 Navbar has Analyze, History, About links visible
- [ ] 3.2.3 🟠 Each nav link navigates to correct route
- [ ] 3.2.4 🟠 Logo click navigates to `/`
- [ ] 3.2.5 🟠 Active link is visually highlighted on each page
- [ ] 3.2.6 🟠 404 page renders for `/nonexistent` with link back to home
- [ ] 3.2.7 🟠 Footer renders with disclaimer text
- [ ] 3.2.8 🟠 Mobile hamburger visible at 375px viewport
- [ ] 3.2.9 🟠 Mobile menu opens, shows all nav links, closes on backdrop click
- [ ] 3.2.10 🟡 Dark mode toggle in navbar switches `<html class="dark">`, persists on reload

### 3.3 Text analysis tests (`e2e/text-analysis.spec.ts`)
- [ ] 3.3.1 🟠 Text tab active by default on `/analyze`
- [ ] 3.3.2 🟠 Analyze button disabled when textarea empty
- [ ] 3.3.3 🟠 Typing text enables Analyze button
- [ ] 3.3.4 🟠 Character counter updates as user types
- [ ] 3.3.5 🟠 Counter goes amber at 8000 chars
- [ ] 3.3.6 🟠 Clear button resets textarea + disables Analyze
- [ ] 3.3.7 🟠 "Try an example" fills textarea with preset scam text
- [ ] 3.3.8 🟠 Submit triggers `data-testid="loading-state"` visible
- [ ] 3.3.9 🟠 Loading messages cycle — second message visible after 1800ms
- [ ] 3.3.10 🟠 Cancel button during loading aborts request and resets to input state
- [ ] 3.3.11 🟠 Successful analysis shows `data-testid="analysis-result"`
- [ ] 3.3.12 🟠 `data-testid="risk-badge"` visible with non-empty text content
- [ ] 3.3.13 🟠 `data-testid="verdict-text"` visible and non-empty
- [ ] 3.3.14 🟠 `data-testid="evidence-section"` visible with ≥1 evidence item
- [ ] 3.3.15 🟠 Risk score donut `data-testid="risk-score-value"` shows numeric value
- [ ] 3.3.16 🟠 Recommendations section visible with ≥1 item
- [ ] 3.3.17 🟠 Copy Report button: click → icon changes to check → reverts after 2s
- [ ] 3.3.18 🟠 "Analyze Another" resets to input state
- [ ] 3.3.19 🟠 Network error shows `role="alert"` with user-friendly message
- [ ] 3.3.20 🟠 429 response shows "Too many requests" message
- [ ] 3.3.21 🟠 CRITICAL result shows pulsing border (check class present on card)
- [ ] 3.3.22 🟠 SAFE result shows green border class on card
- [ ] 3.3.23 🟡 Context field value included in API request body (intercept and verify)

### 3.4 Image analysis tests (`e2e/image-analysis.spec.ts`)
- [ ] 3.4.1 🟠 Screenshot tab shows drop zone with label
- [ ] 3.4.2 🟠 Analyze button disabled with no file
- [ ] 3.4.3 🟠 Upload via `page.setInputFiles()` shows preview
- [ ] 3.4.4 🟠 File name and size display below preview
- [ ] 3.4.5 🟠 Remove button clears preview, disables Analyze
- [ ] 3.4.6 🟠 File >10MB shows client-side error, no API call made
- [ ] 3.4.7 🟠 Non-image file shows validation error
- [ ] 3.4.8 🟠 Valid image upload triggers analysis flow
- [ ] 3.4.9 🟠 Result appears with `data-testid="analysis-result"`
- [ ] 3.4.10 🟡 Drag-and-drop simulated with `page.dispatchEvent` on drop zone

### 3.5 URL analysis tests (`e2e/url-analysis.spec.ts`)
- [ ] 3.5.1 🟠 URL tab shows input field
- [ ] 3.5.2 🟠 Analyze disabled with empty input
- [ ] 3.5.3 🟠 Invalid URL format shows inline validation error
- [ ] 3.5.4 🟠 Follow-redirects toggle on by default
- [ ] 3.5.5 🟠 Valid URL triggers analysis, result appears
- [ ] 3.5.6 🟡 Verify request body contains `follow_redirects: true` when toggle on

### 3.6 Scenario analysis tests (`e2e/scenario-analysis.spec.ts`)
- [ ] 3.6.1 🟠 Scenario tab shows 3 collapsible sections
- [ ] 3.6.2 🟠 Analyze All disabled with all sections empty
- [ ] 3.6.3 🟠 Filling text section shows "Text ✓" signal badge, enables Analyze All
- [ ] 3.6.4 🟠 Filling URL section shows "URL ✓" signal badge
- [ ] 3.6.5 🟠 Analyze All calls `/analyze/scenario` not `/analyze/text` (verify URL)
- [ ] 3.6.6 🟠 Result appears after scenario analysis
- [ ] 3.6.7 🟠 Switching away from Scenario tab during flight cancels request, no crash
- [ ] 3.6.8 🟡 All 3 inputs filled → request body contains text, url, image_base64

### 3.7 History tests (`e2e/history.spec.ts`)
- [ ] 3.7.1 🟠 History page loads and shows empty state with mocked empty response
- [ ] 3.7.2 🟠 History page shows mocked entries with correct risk badges
- [ ] 3.7.3 🟠 Risk level filter: selecting HIGH shows only HIGH/CRITICAL entries
- [ ] 3.7.4 🟠 Input type filter: selecting "text" filters correctly
- [ ] 3.7.5 🟠 Pagination next/previous buttons work
- [ ] 3.7.6 🟠 Clicking history card navigates to `/history/[id]`
- [ ] 3.7.7 🟠 Detail page shows full result with evidence
- [ ] 3.7.8 🟡 Export CSV triggers file download (check `download` attribute)
- [ ] 3.7.9 🟠 Clear history button shows confirmation modal
- [ ] 3.7.10 🟠 Confirming clear calls DELETE endpoint, shows empty state
- [ ] 3.7.11 🟠 Canceling clear leaves entries intact

### 3.8 Feedback tests (`e2e/feedback.spec.ts`)
- [ ] 3.8.1 🟠 Feedback widget visible at bottom of result
- [ ] 3.8.2 🟠 Clicking thumbs-up shows star rating + comment field
- [ ] 3.8.3 🟠 Selecting stars enables Submit button
- [ ] 3.8.4 🟠 Submitting feedback shows "Thank you" state
- [ ] 3.8.5 🟠 Feedback widget disabled after submission (no double submit)
- [ ] 3.8.6 🟡 Comment optional — submitting without comment succeeds

### 3.9 Shareable result page tests (`e2e/shareable-result.spec.ts`)
- [ ] 3.9.1 🟠 `/result/[id]` renders result card for valid ID
- [ ] 3.9.2 🟠 `/result/invalid-id` shows 404 page gracefully
- [ ] 3.9.3 🟡 OG meta tags present in `<head>` with correct title and description
- [ ] 3.9.4 🟡 No feedback widget on shareable page (read-only)

### 3.10 Accessibility tests (`e2e/accessibility.spec.ts`)
- [ ] 3.10.1 🟠 Install `@axe-core/playwright`: `npm install -D @axe-core/playwright`
- [ ] 3.10.2 🟠 Home page: `new AxeBuilder({ page }).analyze()` → zero violations
- [ ] 3.10.3 🟠 Analyze page (empty): zero axe violations
- [ ] 3.10.4 🟠 Analyze page (with result showing): zero axe violations
- [ ] 3.10.5 🟠 History page (empty state): zero axe violations
- [ ] 3.10.6 🟠 History page (with entries): zero axe violations
- [ ] 3.10.7 🟠 About page: zero axe violations
- [ ] 3.10.8 🟠 Result detail page: zero axe violations
- [ ] 3.10.9 🟠 All interactive elements reachable via Tab key (test keyboard navigation loop)
- [ ] 3.10.10 🟠 Modal: focus trapped inside when open, returns to trigger on close
- [ ] 3.10.11 🟡 Color contrast: all text passes WCAG 2.1 AA (axe checks this)

### 3.11 Responsive tests (`e2e/responsive.spec.ts`)
- [ ] 3.11.1 🟠 Configure viewport fixtures in playwright.config: mobile (375×667), tablet (768×1024)
- [ ] 3.11.2 🟠 Mobile: hamburger visible, desktop nav hidden
- [ ] 3.11.3 🟠 Mobile: analyze widget usable — all tabs accessible, result readable
- [ ] 3.11.4 🟠 Mobile: no horizontal scroll on any page (check `scrollWidth <= clientWidth`)
- [ ] 3.11.5 🟠 Mobile: result card evidence readable at 375px
- [ ] 3.11.6 🟠 Mobile: history cards stack vertically
- [ ] 3.11.7 🟡 Tablet: layout between mobile/desktop renders correctly

### 3.12 Dark mode tests (`e2e/dark-mode.spec.ts`)
- [ ] 3.12.1 🟡 Configure `colorScheme: 'dark'` in playwright project config
- [ ] 3.12.2 🟡 Analyze page in dark mode: no white backgrounds on cards
- [ ] 3.12.3 🟡 Result card in dark mode: risk badge visible (sufficient contrast)
- [ ] 3.12.4 🟡 Toggle button in navbar switches `html.dark` class
- [ ] 3.12.5 🟡 Theme persists on page reload (localStorage check)

### 3.13 Performance tests (`e2e/performance.spec.ts`)
- [ ] 3.13.1 🟡 Home page `DOMContentLoaded` < 3000ms
- [ ] 3.13.2 🟡 Analyze page loads < 2000ms
- [ ] 3.13.3 🟡 Analysis result appears within 15000ms of submit
- [ ] 3.13.4 🟡 No `console.error` fires on any page (global check)

---

## 4. BROWSER EXTENSION (Phase 1 Distribution)

### 4.1 Extension setup (`apps/extension/`)
- [ ] 4.1.1 🟡 Create `apps/extension/manifest.json` (Manifest V3)
- [ ] 4.1.2 🟡 Permissions: `contextMenus`, `storage`, `activeTab`
- [ ] 4.1.3 🟡 `background.js` service worker — registers context menu on install
- [ ] 4.1.4 🟡 Context menu: "Check with ProofPulse" on text selection
- [ ] 4.1.5 🟡 Context menu: "Check this link" on link right-click
- [ ] 4.1.6 🟡 `popup.html` — mini analyze widget (text input + submit + result preview)
- [ ] 4.1.7 🟡 `popup.js` — calls production API, renders risk score + verdict
- [ ] 4.1.8 🟡 `content.js` — injects "Check" button near text selections on trigger
- [ ] 4.1.9 🟡 Storage: remember last 5 results locally (chrome.storage.local)
- [ ] 4.1.10 🟡 Settings page: configure API URL (allow pointing at self-hosted)
- [ ] 4.1.11 🟡 Test locally: `chrome://extensions` → load unpacked → verify context menu
- [ ] 4.1.12 🟡 Publish to Chrome Web Store (requires $5 developer account)

---

# ══════════════════════════════════════════
# YEAR 1 — PHASE 2: EXPAND DETECTION (Jul–Dec 2026)
# ══════════════════════════════════════════

## 5. NEW INPUT MODALITIES

### 5.1 Voice message analysis
- [ ] 5.1.1 🟢 Add `POST /api/v1/analyze/audio` endpoint
- [ ] 5.1.2 🟢 Use OpenAI Whisper API to transcribe `.mp3`, `.m4a`, `.ogg`, `.wav`
- [ ] 5.1.3 🟢 Pass transcription to existing LLM analyzer with voice-specific prompt hints
- [ ] 5.1.4 🟢 Frontend: Audio tab in analyzer widget with file upload
- [ ] 5.1.5 🟢 Show transcription before evidence (user can verify OCR accuracy)
- [ ] 5.1.6 🟢 Max file size: 25MB (Whisper limit)
- [ ] 5.1.7 🟢 E2E tests: audio upload flow, transcription displayed, analysis returned

### 5.2 QR code scanner
- [ ] 5.2.1 🟢 `POST /api/v1/analyze/qr` — accept image, decode QR with `pyzbar` library
- [ ] 5.2.2 🟢 Extract URL from QR, run through URL scanner + LLM
- [ ] 5.2.3 🟢 Frontend: QR upload option in Image tab (or separate tab)
- [ ] 5.2.4 🟢 Show decoded URL in evidence section
- [ ] 5.2.5 🟢 E2E tests: QR image upload, decoded URL shown, analysis returned

### 5.3 Email (.eml) file upload
- [ ] 5.3.1 🟢 `POST /api/v1/analyze/email` — parse `.eml` using Python `email` stdlib
- [ ] 5.3.2 🟢 Extract: From, Subject, Body text, links, attachments count
- [ ] 5.3.3 🟢 Build composite prompt: header spoofing signals + body analysis + link analysis
- [ ] 5.3.4 🟢 Frontend: Email tab with `.eml` drag-and-drop
- [ ] 5.3.5 🟢 Show parsed header fields (From, Subject) before evidence
- [ ] 5.3.6 🟢 E2E tests: .eml upload, parsed fields displayed, analysis returned

### 5.4 Deepfake image detection
- [ ] 5.4.1 🟢 Research C2PA metadata standard — check for authentic provenance markers
- [ ] 5.4.2 🟢 Integrate `hive-moderation` or similar API for AI-generated image classification
- [ ] 5.4.3 🟢 Add `is_ai_generated_probability` signal to image analysis evidence
- [ ] 5.4.4 🟢 Frontend: show "AI-generated image detected" warning in result
- [ ] 5.4.5 🟢 E2E tests: upload known AI image, verify flag appears in evidence

---

## 6. INTELLIGENCE LAYER

### 6.1 Scam pattern library
- [ ] 6.1.1 🟢 Create `patterns` table: id, category, name, description, example_text, risk_indicators_json
- [ ] 6.1.2 🟢 Seed 50+ known scam templates: IRS scam, Nigerian prince, romance, job offer, package delivery, crypto, tech support
- [ ] 6.1.3 🟢 `GET /api/v1/patterns` — paginated list with category filter
- [ ] 6.1.4 🟢 `GET /api/v1/patterns/{id}` — single pattern with examples
- [ ] 6.1.5 🟢 Frontend: `/patterns` page with category filter, search, card grid
- [ ] 6.1.6 🟢 Link patterns to results: "This matches the IRS Phone Scam pattern"

### 6.2 Community threat feed
- [ ] 6.2.1 🟢 Add `community_reports` table: analysis_id, scam_category, upvotes, created_at
- [ ] 6.2.2 🟢 `POST /api/v1/community/report` — opt-in report sharing (anonymized, no raw text stored)
- [ ] 6.2.3 🟢 `GET /api/v1/community/trending` — top scam types this week by count
- [ ] 6.2.4 🟢 Frontend: trending threats section on home page
- [ ] 6.2.5 🟢 Frontend: "Share pattern anonymously" checkbox after analysis

### 6.3 Trend dashboard
- [ ] 6.3.1 🟢 `/dashboard` page — charts for: scans over time, risk distribution, top scam types, geographic trends
- [ ] 6.3.2 🟢 Use Chart.js for all visualizations
- [ ] 6.3.3 🟢 Backend: `/api/v1/analytics/trends` endpoint with time bucketing
- [ ] 6.3.4 🟢 Link from home page: "See what's trending this week →"

---

## 7. INFRASTRUCTURE UPGRADES (Phase 2)

### 7.1 Database migration: SQLite → Postgres
- [ ] 7.1.1 🟢 Add `asyncpg` and `databases` to requirements.txt
- [ ] 7.1.2 🟢 Create Alembic migration files from existing SQL schemas
- [ ] 7.1.3 🟢 Update all repository functions for Postgres syntax (no AUTOINCREMENT, use SERIAL/UUID)
- [ ] 7.1.4 🟢 Add Railway Postgres service to project
- [ ] 7.1.5 🟢 Update `DATABASE_URL` env var
- [ ] 7.1.6 🟢 Test migration script: verify all data intact after migration
- [ ] 7.1.7 🟢 Keep SQLite for local dev, Postgres for production

### 7.2 User accounts (optional, privacy-first)
- [ ] 7.2.1 🟢 Add `users` table: id, email, created_at, plan_tier
- [ ] 7.2.2 🟢 Auth via magic link (no passwords) — send email with JWT link
- [ ] 7.2.3 🟢 History tied to user_id — users only see their own analyses
- [ ] 7.2.4 🟢 Guest mode preserved — analyses without auth stored locally (localStorage) for 7 days
- [ ] 7.2.5 🟢 Frontend: Sign in modal, account settings page, history sync across devices

### 7.3 Internationalization (5 languages)
- [ ] 7.3.1 🟢 Install `next-intl`
- [ ] 7.3.2 🟢 Create translation files: `en.json`, `es.json`, `fr.json`, `hi.json`, `pt.json`, `ar.json`
- [ ] 7.3.3 🟢 Translate: all UI labels, error messages, placeholder text, about page
- [ ] 7.3.4 🟢 LLM system prompt: detect input language, respond in same language
- [ ] 7.3.5 🟢 Language selector in navbar (flag icon dropdown)
- [ ] 7.3.6 🟢 RTL support for Arabic (Tailwind `dir="rtl"`)

---

# ══════════════════════════════════════════
# YEAR 2 — PHASE 3: PLATFORM (Jan–Jun 2027)
# ══════════════════════════════════════════

## 8. DEVELOPER PLATFORM

### 8.1 Public API v1
- [ ] 8.1.1 ⚪ API key system: `api_keys` table, SHA-256 hashed storage, key prefix display
- [ ] 8.1.2 ⚪ `POST /api/v1/keys` — create key, `DELETE /api/v1/keys/{id}` — revoke
- [ ] 8.1.3 ⚪ Rate limiting per key: free (100/day), pro (10k/day), enterprise (custom)
- [ ] 8.1.4 ⚪ Usage tracking: `api_usage` table, `GET /api/v1/usage` dashboard
- [ ] 8.1.5 ⚪ Comprehensive API docs at `/docs` (FastAPI auto-docs already exist, enhance)
- [ ] 8.1.6 ⚪ Python SDK: `pip install proofpulse` — `client.analyze_text("...")` → `AnalysisResult`
- [ ] 8.1.7 ⚪ Node.js SDK: `npm install proofpulse` — `await client.analyzeText("...")`
- [ ] 8.1.8 ⚪ SDKs published to PyPI and npm with CI auto-publish on tag

### 8.2 Webhook integrations
- [ ] 8.2.1 ⚪ `webhooks` table: id, user_id, url, events (analyze.complete, high_risk.detected), secret
- [ ] 8.2.2 ⚪ HMAC-signed payload delivery with retry (3 attempts, exponential backoff)
- [ ] 8.2.3 ⚪ Zapier integration: "New HIGH risk analysis" trigger
- [ ] 8.2.4 ⚪ Slack integration: post HIGH/CRITICAL results to a channel
- [ ] 8.2.5 ⚪ Make.com (Integromat) integration

---

## 9. MOBILE APPS

### 9.1 iOS app
- [ ] 9.1.1 ⚪ React Native (Expo) project setup — shares business logic with web
- [ ] 9.1.2 ⚪ Core screens: Home, Analyze (Text/Image/URL tabs), History, Settings
- [ ] 9.1.3 ⚪ Share extension: "Check with ProofPulse" in iOS share sheet
- [ ] 9.1.4 ⚪ Camera: take photo → analyze screenshot directly
- [ ] 9.1.5 ⚪ Push notifications: "New HIGH risk scam pattern detected in your area"
- [ ] 9.1.6 ⚪ App Store submission, privacy manifest

### 9.2 Android app
- [ ] 9.2.1 ⚪ Share intent handler: receives text/images from any app
- [ ] 9.2.2 ⚪ Same core screens as iOS
- [ ] 9.2.3 ⚪ Accessibility service (optional): auto-detect suspicious incoming SMS
- [ ] 9.2.4 ⚪ Play Store submission

---

## 10. MONETIZATION

### 10.1 Pricing tiers
- [ ] 10.1.1 ⚪ Free: 10 analyses/day, web only, no history sync
- [ ] 10.1.2 ⚪ Pro ($8/mo): unlimited analyses, all modalities, history sync, PDF export, API access (10k/day)
- [ ] 10.1.3 ⚪ Team ($25/mo/seat): shared history, admin dashboard, team threat feed, bulk API
- [ ] 10.1.4 ⚪ Enterprise: custom pricing, SLA, on-premise option, integration support

### 10.2 Payment infrastructure
- [ ] 10.2.1 ⚪ Stripe integration: subscriptions, billing portal, usage-based billing for API
- [ ] 10.2.2 ⚪ Checkout flow: upgrade prompt when free tier limit hit
- [ ] 10.2.3 ⚪ Billing page in settings: current plan, usage, invoice history
- [ ] 10.2.4 ⚪ Webhook: `customer.subscription.updated` → update `users.plan_tier`

---

# ══════════════════════════════════════════
# YEAR 2 — PHASE 4: AI-NATIVE DEFENSE (Jul–Dec 2027)
# ══════════════════════════════════════════

## 11. NEXT-GENERATION DETECTION

### 11.1 Voice clone detection
- [ ] 11.1.1 ⚪ Research voice authentication APIs (Pindrop, Nuance, or open-source)
- [ ] 11.1.2 ⚪ `POST /api/v1/analyze/voice-call` — analyze recorded call for clone indicators
- [ ] 11.1.3 ⚪ Signals: inconsistent breathing, spectral artifacts, unnatural prosody
- [ ] 11.1.4 ⚪ Frontend: phone call recording upload with playback
- [ ] 11.1.5 ⚪ Mobile: real-time call monitoring during active call (iOS CallKit integration)

### 11.2 Crypto scam detection
- [ ] 11.2.1 ⚪ Specialized prompt additions for: pig butchering patterns, fake DEX URLs, rug pull signals
- [ ] 11.2.2 ⚪ Blockchain address lookup: check address against known scam databases
- [ ] 11.2.3 ⚪ `analyze/crypto` endpoint: input = wallet address or contract address
- [ ] 11.2.4 ⚪ Show transaction history signals, contract audit status

### 11.3 Email inbox scanner
- [ ] 11.3.1 ⚪ Gmail OAuth integration — request `gmail.readonly` scope
- [ ] 11.3.2 ⚪ Scan last 30 days of inbox for phishing patterns (batch mode)
- [ ] 11.3.3 ⚪ Flag suspicious emails, show summary report
- [ ] 11.3.4 ⚪ Outlook / Microsoft 365 Graph API integration
- [ ] 11.3.5 ⚪ Privacy: all analysis on-server, no email content stored

### 11.4 Enterprise + partnerships
- [ ] 11.4.1 ⚪ FTC Reportfraud.ftc.gov API integration — one-click report submission
- [ ] 11.4.2 ⚪ Financial institution white-label API
- [ ] 11.4.3 ⚪ SOC 2 Type II compliance audit
- [ ] 11.4.4 ⚪ Enterprise SSO (SAML/OIDC)
- [ ] 11.4.5 ⚪ On-premise deployment option (Docker Compose + docs)

---

## 12. PDF EXPORT (stretch — phase 1)

- [ ] 12.1 🟡 `npm install jspdf html2canvas`
- [ ] 12.2 🟡 "Download Evidence Report" button on result card
- [ ] 12.3 🟡 Report content: header (ProofPulse logo + date), risk score, verdict, all evidence items, recommendations, analysis ID
- [ ] 12.4 🟡 File name: `proofpulse-report-{analysis_id}-{date}.pdf`
- [ ] 12.5 🟡 E2E test: click download button, verify file download initiated (`page.waitForEvent('download')`)

---

## 13. CONFETTI + DELIGHT (stretch — phase 1)

- [ ] 13.1 🟡 `npm install canvas-confetti`
- [ ] 13.2 🟡 On CRITICAL result mount: `confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ef4444', '#f97316', '#fbbf24'] })`
- [ ] 13.3 🟡 Guard with `useReducedMotion()` — no confetti if reduced motion
- [ ] 13.4 🟡 Text above donut: "You caught a scam!" fades in for CRITICAL results
- [ ] 13.5 🟡 E2E test: mock CRITICAL response, verify confetti fires (check for canvas element added to DOM)

---

## PHASE 1 FINAL SUBMISSION CHECKLIST

- [ ] CI green: all 3 jobs pass on GitHub Actions
- [ ] `npm run lint -- --max-warnings=0` exits 0
- [ ] `npx tsc --noEmit` exits 0
- [ ] `npm run build` succeeds
- [ ] `pytest --cov=src --cov-fail-under=83` passes
- [ ] `npx playwright test` — all 36+ tests pass
- [ ] Railway live: `/health` returns `{"status":"ok"}`
- [ ] Vercel live: analyze flow works end-to-end
- [ ] README has banner, screenshots, real URLs, badges
- [ ] Demo video uploaded and linked
- [ ] NextDev submitted by Mar 24
- [ ] Develop the Next submitted by Mar 25
