# ProofPulse — Phase 2 Task List
## Fix · Polish · Deploy · Submit
> Current state: CI failing (frontend-lint exit 1), e2e job skipped, no live deployment, no demo video, no Devpost submission.
> Goal: Green CI, live deployment, 95+ judging score, submitted to all 3 hackathons.

---

## LEGEND
- `[ ]` Not started  |  `[~]` In progress  |  `[x]` Done  |  `[!]` Blocked

---

## TIER 1 — CI RED (fix in the next 30 minutes)

### 1.1 Fix the broken ESLint failure
- [ ] 1.1.1 Open `apps/web/components/ResultCard.tsx` line 32
- [ ] 1.1.2 Find `RISK_LABELS` — it is assigned but never referenced anywhere in the file
- [ ] 1.1.3 Option A: delete the `RISK_LABELS` declaration entirely if unused
- [ ] 1.1.4 Option B: prefix with `_` → `_RISK_LABELS` to signal intentional non-use (less clean)
- [ ] 1.1.5 Option C: actually use it — refactor the risk label rendering logic to consume `RISK_LABELS` map instead of inline strings
- [ ] 1.1.6 Prefer option C: it removes duplication and improves maintainability
- [ ] 1.1.7 After fix: run `cd apps/web && npm run lint` locally — must exit 0
- [ ] 1.1.8 Verify no other `no-unused-vars` warnings exist in any component
- [ ] 1.1.9 Scan all `.tsx` files for `@ts-ignore` or `@ts-expect-error` comments — remove or fix each one properly
- [ ] 1.1.10 Run `npx tsc --noEmit` from `apps/web` — must exit 0 with zero errors

### 1.2 Fix the Node.js action deprecation warnings
- [ ] 1.2.1 Open `.github/workflows/ci.yml`
- [ ] 1.2.2 Change `actions/checkout@v4` → `actions/checkout@v4` with `env: FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` OR upgrade to `@v5` if available
- [ ] 1.2.3 Change `actions/setup-python@v5` → `actions/setup-python@v5` (already v5 — just add the NODE24 env var or check for @v6)
- [ ] 1.2.4 Change `actions/setup-node@v4` → check if v5 is available; if not, add NODE24 env var
- [ ] 1.2.5 Add `env: FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` at the workflow level to suppress all warnings
- [ ] 1.2.6 Push and confirm Actions page shows no deprecation warnings

### 1.3 Fix the e2e-test job (was skipped — it needs both servers)
- [ ] 1.3.1 In `ci.yml`, the e2e job currently has 0s duration — it was skipped or instantly failed
- [ ] 1.3.2 Check the `needs:` declaration on the e2e job — it likely needs `frontend-lint` to pass first
- [ ] 1.3.3 Add proper `needs: [backend-test, frontend-lint]` so it only runs after both pass
- [ ] 1.3.4 Ensure the e2e job spins up both the backend and frontend servers before running Playwright
- [ ] 1.3.5 Backend startup in CI: `cd apps/api && pip install -r requirements.txt && uvicorn src.main:app --port 8000 &`
- [ ] 1.3.6 Wait for backend health: `npx wait-on http://localhost:8000/api/v1/health --timeout 30000`
- [ ] 1.3.7 Frontend startup: `cd apps/web && npm run build && npm run start &`
- [ ] 1.3.8 Wait for frontend: `npx wait-on http://localhost:3000 --timeout 60000`
- [ ] 1.3.9 Install `wait-on` as a devDependency in `apps/web`
- [ ] 1.3.10 Set `OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}` in the e2e job env — add the secret in GitHub repo settings
- [ ] 1.3.11 For CI safety: use a mock/stub for LLM calls in e2e (Playwright `page.route()` already handles this — confirm all 24 tests use mocked API)
- [ ] 1.3.12 Add `continue-on-error: false` to e2e job so CI fails visibly if any Playwright test fails
- [ ] 1.3.13 Upload Playwright HTML report on failure: `actions/upload-artifact@v4` with `if: failure()`
- [ ] 1.3.14 Verify all 24 Playwright tests pass in CI, not just locally

### 1.4 Verify backend-test job fully passes
- [ ] 1.4.1 Check the backend-test job logs — confirm 102 tests ran and all passed
- [ ] 1.4.2 Confirm coverage report uploaded (currently shows no artifact)
- [ ] 1.4.3 Add `actions/upload-artifact@v4` step to upload `htmlcov/` after pytest
- [ ] 1.4.4 Fix any flaky tests that pass locally but fail in CI (common: SQLite file path issues, temp file cleanup)
- [ ] 1.4.5 Ensure all tests use the in-memory SQLite test database, not `./proofpulse.db`
- [ ] 1.4.6 Add `--tb=short` flag to pytest in CI for readable failure output
- [ ] 1.4.7 Confirm `OPENAI_API_KEY=test-key-for-ci` is sufficient for all mocked tests (no test should make a real API call)

---

## TIER 2 — CODE QUALITY (do before deploy)

### 2.1 Remove all dead code
- [ ] 2.1.1 Audit all `apps/web/components/` for unused imports — run `eslint --fix` on each file
- [ ] 2.1.2 Audit all `apps/web/hooks/` — remove hooks not called anywhere
- [ ] 2.1.3 Audit `apps/api/src/` — remove any commented-out code blocks
- [ ] 2.1.4 Remove any `console.log` / `print()` debug statements left in production code paths
- [ ] 2.1.5 Remove `TODO:` comments that are actually done — update ones that are real future work
- [ ] 2.1.6 Run `ruff check apps/api/src/ --select F401` to find all unused Python imports — fix each one
- [ ] 2.1.7 Run `ruff check apps/api/src/ --select F841` to find all unused Python variables — fix each one
- [ ] 2.1.8 Run `black apps/api/src/` to auto-format all Python files
- [ ] 2.1.9 Run `cd apps/web && npx prettier --write .` to format all TypeScript/JSON files
- [ ] 2.1.10 Verify no `.env` file is committed to git (should only be `.env.example`)

### 2.2 Fix all TypeScript strict violations
- [ ] 2.2.1 Enable `"strict": true` in `apps/web/tsconfig.json` if not already set
- [ ] 2.2.2 Fix all implicit `any` types — every function parameter and return type must be explicit
- [ ] 2.2.3 Fix all `Type 'X | undefined' is not assignable to type 'X'` errors with proper null checks
- [ ] 2.2.4 Fix all `Object is possibly null` errors — add null guards where needed
- [ ] 2.2.5 Ensure `AnalysisResponse`, `HistoryResponse`, all API types are imported from a single source-of-truth `types/api.ts`
- [ ] 2.2.6 No type assertions (`as SomeType`) on API responses — use Zod or manual type guards instead
- [ ] 2.2.7 All React component props must have explicit typed interfaces (no inline `{ foo: any }`)
- [ ] 2.2.8 Ensure all `async` functions have typed return promises: `Promise<AnalysisResponse>` not `Promise<any>`

### 2.3 Fix runtime error edge cases
- [ ] 2.3.1 In `ResultCard.tsx` (or equivalent): handle case where `evidence` array is empty — show "No specific evidence items" rather than a blank section
- [ ] 2.3.2 Handle case where `recommendations` is empty array — show fallback message
- [ ] 2.3.3 Handle case where `next_steps` is empty array
- [ ] 2.3.4 Handle `analysis_id` being null/undefined before rendering the feedback widget
- [ ] 2.3.5 In history page: handle API returning `total: 0` — empty state must render, not crash
- [ ] 2.3.6 In image tab: if user uploads an unsupported file then removes it, ensure the "Analyze" button returns to disabled state
- [ ] 2.3.7 In URL tab: handle URLs with trailing spaces (strip before submit)
- [ ] 2.3.8 In text tab: handle text that is all whitespace — show client-side validation error, don't submit
- [ ] 2.3.9 In loading state: if the API returns in <200ms, ensure loading state is shown for a minimum of 600ms (prevents flash of content)
- [ ] 2.3.10 In `AnalyzerWidget`: if user switches tabs while a request is in flight, cancel the previous request via `AbortController`
- [ ] 2.3.11 Ensure `Copy Report` gracefully handles browsers that don't support `navigator.clipboard` (fallback to `document.execCommand`)
- [ ] 2.3.12 Ensure `Share Result` button constructs the correct URL using `window.location.origin` not a hardcoded domain
- [ ] 2.3.13 In backend: verify that the `deleted_at` field is respected in all history queries (soft-deleted items must not appear)
- [ ] 2.3.14 In backend: verify that `GET /history/stats` computes `scam_rate_pct` correctly (count HIGH+CRITICAL / total, not all non-SAFE)
- [ ] 2.3.15 In backend: confirm `POST /feedback` returns 409 on duplicate correctly (not 500 from SQLite unique constraint exception bubbling up)

### 2.4 Performance improvements
- [ ] 2.4.1 Add `loading="lazy"` to any `<img>` tags in the about and home pages
- [ ] 2.4.2 Memoize `EvidenceItem` list with `useMemo` — re-sorts on every render otherwise
- [ ] 2.4.3 Memoize `HistoryCard` list with `React.memo` to prevent re-renders during pagination
- [ ] 2.4.4 Add `staleTime: 60_000` to the `useHistory` React Query hook (history doesn't change every second)
- [ ] 2.4.5 Add `staleTime: 300_000` to the `useStats` hook
- [ ] 2.4.6 In Next.js: add `export const dynamic = 'force-dynamic'` to history and analyze pages (they depend on runtime data)
- [ ] 2.4.7 In Next.js: ensure the home page is statically generated (no `useEffect` fetches that block SSR)
- [ ] 2.4.8 Add `next/font` for Inter — eliminates FOUT (flash of unstyled text)
- [ ] 2.4.9 Run `npm run build` and check the build output — flag any chunk > 250KB as needing code-splitting
- [ ] 2.4.10 Add `output: 'standalone'` to `next.config.js` for optimal Docker production image

---

## TIER 3 — UX POLISH (judging score: +6-8 points on UX category)

### 3.1 Risk score animation
- [ ] 3.1.1 The risk score donut/radial must animate from 0 → final value on mount — not appear instantly
- [ ] 3.1.2 Animation duration: 1200ms with `cubic-bezier(0.34, 1.56, 0.64, 1)` easing (spring feel)
- [ ] 3.1.3 The numeric score inside the donut also counts up: 0 → final using `useEffect` + `setInterval` at 16ms frames
- [ ] 3.1.4 The risk badge should fade in 300ms after the score animation completes (not simultaneously)
- [ ] 3.1.5 Evidence items stagger in: each item delays by `index * 80ms` (framer-motion `staggerChildren`)
- [ ] 3.1.6 Recommendations stagger in after evidence items complete
- [ ] 3.1.7 The entire result card slides up 20px and fades in on mount — not just appears
- [ ] 3.1.8 Respect `prefers-reduced-motion` — wrap all animations in `@media (prefers-reduced-motion: no-preference)` or use framer-motion's `useReducedMotion()` hook

### 3.2 Risk level visual treatment
- [ ] 3.2.1 CRITICAL results: add a pulsing red border around the entire result card (CSS `@keyframes` on `border-color` or `box-shadow`)
- [ ] 3.2.2 HIGH results: add a steady amber/orange border
- [ ] 3.2.3 SAFE results: add a steady green border + subtle green background tint
- [ ] 3.2.4 The verdict text for CRITICAL/HIGH must be large (20px) and visually dominant — not the same size as body text
- [ ] 3.2.5 Add a risk level icon alongside the badge: shield-check for SAFE, shield-alert for HIGH/CRITICAL (use lucide-react)
- [ ] 3.2.6 The progress/score bar should be the risk color, not always blue
- [ ] 3.2.7 Evidence items with `flag: "red"` must have a visually distinct treatment (red left border, or red background tint)
- [ ] 3.2.8 Evidence items with `flag: "green"` must be visually distinct from red ones (green treatment)
- [ ] 3.2.9 Weight bars on evidence items should be colored by flag, not neutral gray

### 3.3 Loading state quality
- [ ] 3.3.1 Loading state must show the spinner + rotating message immediately (< 100ms after submit)
- [ ] 3.3.2 Messages must cycle: "Scanning for patterns...", "Analyzing signals...", "Weighing evidence...", "Calculating risk score...", "Preparing your report..." — 5 distinct messages, not 3
- [ ] 3.3.3 Add a subtle progress bar under the loading state that fills over a fixed 8-second estimate (not tied to actual latency)
- [ ] 3.3.4 Cancel button must be visible and functional — clicking it aborts the fetch and resets to input state with no error shown
- [ ] 3.3.5 If the analysis takes > 12 seconds, show an additional message: "This one's taking a little longer than usual..."

### 3.4 Mobile UX
- [ ] 3.4.1 On mobile, the tab labels should be icon-only or abbreviated (Text / Shot / URL / All) to fit without wrapping
- [ ] 3.4.2 On mobile, the evidence section should default to showing 3 items with "Show all" — not all 8 (too much scroll)
- [ ] 3.4.3 The copy report button should be sticky at the bottom of the result card on mobile
- [ ] 3.4.4 The risk score donut should be smaller on mobile (100px diameter vs 140px on desktop)
- [ ] 3.4.5 Verify the image dropzone is tappable on mobile (minimum 44px touch target)
- [ ] 3.4.6 Ensure the URL paste button works on iOS (iOS doesn't support `navigator.clipboard.readText()` without permission)
- [ ] 3.4.7 Test the full analyze → result flow on a 375px viewport — no horizontal scroll anywhere

### 3.5 Empty state polish
- [ ] 3.5.1 History page empty state: add an illustration (SVG shield/magnifying glass) not just text
- [ ] 3.5.2 History page empty state CTA: "Analyze your first suspicious message →" links to `/analyze`
- [ ] 3.5.3 Evidence section empty state: "No specific evidence extracted" with an info icon
- [ ] 3.5.4 If API health check fails on load, show a banner: "ProofPulse is currently unavailable. Please try again in a moment." — not a broken UI

### 3.6 Dark mode
- [ ] 3.6.1 Add a theme toggle button to the navbar (sun/moon icon, lucide-react)
- [ ] 3.6.2 Store preference in `localStorage` under key `proofpulse-theme`
- [ ] 3.6.3 On initial load, respect `prefers-color-scheme` media query if no localStorage preference exists
- [ ] 3.6.4 Apply dark mode via `class="dark"` on `<html>` (Tailwind dark mode: `darkMode: 'class'` in config)
- [ ] 3.6.5 Audit every component for hardcoded colors (e.g. `text-gray-900`) — replace with Tailwind dark variants (`text-gray-900 dark:text-gray-100`)
- [ ] 3.6.6 Risk colors in dark mode: ensure sufficient contrast (e.g. `text-green-400` in dark not `text-green-800`)
- [ ] 3.6.7 The result card borders in dark mode must be visible (not disappear against dark background)
- [ ] 3.6.8 Test dark mode on all 5 pages — no white flash, no invisible text, no broken layouts

### 3.7 Micro-interactions
- [ ] 3.7.1 "Copy Report" button: on click, icon changes from `Copy` → `Check` for 2 seconds then reverts
- [ ] 3.7.2 "Share Result" button: same copy-success treatment
- [ ] 3.7.3 Feedback stars: hovering highlights 1→N stars progressively (not just the hovered star)
- [ ] 3.7.4 Feedback submit: show a checkmark animation after successful submission (not just text)
- [ ] 3.7.5 "Analyze Another" button: smooth scroll back to input on click
- [ ] 3.7.6 History card hover: subtle lift (translate-y-0.5 + shadow-sm transition)
- [ ] 3.7.7 Tab switching: active tab indicator animates (slides) rather than jumps
- [ ] 3.7.8 Image dropzone: border pulses on dragover state

---

## TIER 4 — MISSING FEATURES (close remaining gaps)

### 4.1 Scenario tab completion
- [ ] 4.1.1 Verify the Scenario tab correctly sends all three inputs in one API call to `/analyze/scenario`
- [ ] 4.1.2 Intercept the network request in dev tools and confirm the `ScenarioAnalysisRequest` payload is correct
- [ ] 4.1.3 Verify that submitting scenario with only text (no URL, no image) works and uses just the text analysis signal
- [ ] 4.1.4 Verify that scenario with only URL works
- [ ] 4.1.5 Verify that scenario with all three inputs shows all three signals in the result's evidence list
- [ ] 4.1.6 Add signal badges to the Scenario tab UI — "Text ✓", "URL ✓", "Image ✓" appear as inputs are filled
- [ ] 4.1.7 Signal badges must turn green (active) or gray (inactive) dynamically as user fills/clears inputs
- [ ] 4.1.8 Add a "Scenario analysis combines all your inputs for the most accurate result" helper tooltip

### 4.2 History page completion
- [ ] 4.2.1 Verify that analyses actually persist between page loads (SQLite file survives server restart)
- [ ] 4.2.2 Verify the pagination `total` count is accurate (not always 0 or always the same)
- [ ] 4.2.3 Verify filtering by risk level actually filters — test HIGH filter returns only HIGH/CRITICAL items
- [ ] 4.2.4 Verify filtering by input type works for all 4 types
- [ ] 4.2.5 Add a "Date" column or sort option (newest first by default)
- [ ] 4.2.6 Clicking a history card opens the full `AnalysisResult` view — verify this works end-to-end
- [ ] 4.2.7 The individual analysis detail page (`/history/[id]`) must be fully functional with all evidence
- [ ] 4.2.8 Implement the "Export CSV" button: generate CSV with columns: id, date, type, risk_level, risk_score, verdict
- [ ] 4.2.9 CSV download must trigger a file save in the browser (use `URL.createObjectURL` + `<a download>`)
- [ ] 4.2.10 Stats bar (total scans, high-risk count, safe count) must show accurate numbers from `/history/stats`
- [ ] 4.2.11 "Clear History" button must show a confirmation modal with the text "Delete all X analyses? This cannot be undone."
- [ ] 4.2.12 After clearing, the empty state renders immediately without a page refresh

### 4.3 Feedback widget completion
- [ ] 4.3.1 Confirm feedback is submitted to the correct `analysis_id` (not a hardcoded or undefined value)
- [ ] 4.3.2 Confirm that after submitting feedback, the widget shows "Thank you for your feedback!" and disables
- [ ] 4.3.3 Confirm the 409 duplicate-feedback case is handled gracefully ("You've already submitted feedback for this analysis")
- [ ] 4.3.4 The `was_actually_scam` boolean should be set based on the 👍/👎 initial click (thumbs up = false/legitimate, thumbs down = true/scam)
- [ ] 4.3.5 Star rating 1-2 = negative, 3 = neutral, 4-5 = positive — ensure this semantic is clear in the UI label

### 4.4 About page quality
- [ ] 4.4.1 Add a statistics section with real (static) scam data: "Americans lost $10.3B to fraud in 2023 (FTC data)"
- [ ] 4.4.2 Add a "How it works" section with a 3-step visual: Submit → AI Analyzes → Get Evidence
- [ ] 4.4.3 Add a FAQ accordion with at least 5 questions:
  - "Is my data stored?" → "Analyses are stored locally in our database for your history. We never share your data."
  - "Does this replace calling my bank?" → "No. Always take additional steps if you suspect fraud."
  - "What types of scams does it detect?" → list the main categories
  - "How accurate is it?" → honest answer about AI limitations
  - "Is it free?" → yes, open source, hackathon project
- [ ] 4.4.4 Add a link to the GitHub repo with a star count badge
- [ ] 4.4.5 Add the ProofPulse tagline prominently: "Verify before you trust."

### 4.5 Home page quality
- [ ] 4.5.1 The hero headline must be immediately clear: "Is this a scam? Find out in seconds."
- [ ] 4.5.2 Hero subheadline should explain the product in one sentence
- [ ] 4.5.3 Add a live stats counter to the hero: "X analyses completed" — pulls from `/api/v1/history/stats`
- [ ] 4.5.4 Feature cards (3) must have icons, not just text
- [ ] 4.5.5 The "How It Works" section must have numbered steps with icons
- [ ] 4.5.6 Add at least 2 example result cards (static, pre-rendered) showing what the output looks like — judges need to see the value immediately
- [ ] 4.5.7 Example card 1: phishing SMS, CRITICAL risk, 3 evidence items visible
- [ ] 4.5.8 Example card 2: legitimate message, SAFE, green treatment
- [ ] 4.5.9 CTA button "Analyze Something Now" links to `/analyze` and is visually prominent (large, brand color)
- [ ] 4.5.10 Footer must include: "Built for ThunderHacks, NextDev, and Develop the Next hackathons 2026"

---

## TIER 5 — DEPLOYMENT (must complete before submission)

### 5.1 Backend deployment (Railway)
- [ ] 5.1.1 Create Railway account at railway.app if not exists
- [ ] 5.1.2 Create new Railway project: "ProofPulse API"
- [ ] 5.1.3 Connect GitHub repo → select `apps/api` as the root directory
- [ ] 5.1.4 Set build command: `pip install -r requirements.txt`
- [ ] 5.1.5 Set start command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
- [ ] 5.1.6 Set environment variables in Railway dashboard:
  - `OPENAI_API_KEY` = your key
  - `ENVIRONMENT` = production
  - `CORS_ORIGINS` = https://your-vercel-app.vercel.app (set after step 5.2)
  - `LOG_LEVEL` = INFO
  - `DATABASE_URL` = sqlite+aiosqlite:///./proofpulse.db
- [ ] 5.1.7 Add a Railway volume mount for `/app/proofpulse.db` so the SQLite DB persists across deploys
- [ ] 5.1.8 Set health check endpoint: `GET /api/v1/health`
- [ ] 5.1.9 Trigger first deploy and watch logs — confirm app starts without errors
- [ ] 5.1.10 Test: `curl https://your-railway-url.railway.app/api/v1/health` must return `{"status": "ok"}`
- [ ] 5.1.11 Test: `curl -X POST https://your-railway-url.railway.app/api/v1/analyze/text -H "Content-Type: application/json" -d '{"text":"You have won $1M, click here now"}'` must return a valid `AnalysisResponse`
- [ ] 5.1.12 Note the Railway URL — you'll need it for step 5.2

### 5.2 Frontend deployment (Vercel)
- [ ] 5.2.1 Install Vercel CLI: `npm i -g vercel`
- [ ] 5.2.2 From `apps/web`: run `vercel --prod` and follow prompts, OR connect via vercel.com dashboard
- [ ] 5.2.3 Set root directory to `apps/web` in Vercel project settings
- [ ] 5.2.4 Set environment variable in Vercel dashboard: `NEXT_PUBLIC_API_URL` = https://your-railway-url.railway.app
- [ ] 5.2.5 Trigger deploy and watch build logs — confirm no TypeScript or lint errors during build
- [ ] 5.2.6 Note the Vercel URL (e.g. `proofpulse.vercel.app`)
- [ ] 5.2.7 Go back to Railway → update `CORS_ORIGINS` to the Vercel URL → redeploy backend
- [ ] 5.2.8 Test full round-trip: open Vercel URL in browser → analyze a message → confirm result appears
- [ ] 5.2.9 Test image upload on prod: upload a screenshot → confirm OCR and analysis work
- [ ] 5.2.10 Test URL analysis on prod: paste a URL → confirm result appears
- [ ] 5.2.11 Test history on prod: confirm previous analyses appear
- [ ] 5.2.12 Test on mobile (real device or BrowserStack): confirm the UI is usable

### 5.3 Production hardening
- [ ] 5.3.1 Confirm `CORS_ORIGINS` in production does NOT include `http://localhost:3000` (security)
- [ ] 5.3.2 Confirm no API keys or secrets appear in frontend bundle (check `NEXT_PUBLIC_` prefix — only URL is public)
- [ ] 5.3.3 Add a `robots.txt` to `apps/web/public/` allowing indexing
- [ ] 5.3.4 Add `sitemap.xml` (can be minimal: just `/`, `/analyze`, `/history`, `/about`)
- [ ] 5.3.5 Confirm HTTPS is enforced on both Railway (it is by default) and Vercel (it is by default)
- [ ] 5.3.6 Add a `NEXT_PUBLIC_APP_VERSION` env var set to `1.0.0` — display in footer
- [ ] 5.3.7 Set Railway instance to at least 512MB RAM (LLM responses can be memory-intensive)
- [ ] 5.3.8 Add `X-Frame-Options: DENY` header in Next.js config (prevent clickjacking)
- [ ] 5.3.9 Add `X-Content-Type-Options: nosniff` header
- [ ] 5.3.10 Verify the Vercel deployment doesn't expose any internal API error messages to end users

---

## TIER 6 — README & REPO POLISH (judges inspect repos)

### 6.1 README rewrite
- [ ] 6.1.1 Add a banner image at the very top — a screenshot of the analyze page with a CRITICAL result showing
- [ ] 6.1.2 Add CI status badge: `[![CI](https://github.com/aaravjj2/ProofPulse/workflows/CI/badge.svg)](https://github.com/aaravjj2/ProofPulse/actions)`
- [ ] 6.1.3 Add live demo badge: `[![Live Demo](https://img.shields.io/badge/Live%20Demo-proofpulse.vercel.app-blue)](https://proofpulse.vercel.app)`
- [ ] 6.1.4 Add MIT license badge
- [ ] 6.1.5 Add a one-sentence description immediately under the badges — judges skim fast
- [ ] 6.1.6 Add a "Screenshots" section with 4 images:
  - Home page hero
  - Analyze page with a CRITICAL result (most important — show evidence cards clearly)
  - History page with multiple entries
  - Mobile view of the result
- [ ] 6.1.7 Add a "Tech Stack" section with icons (use shields.io badges: Python, FastAPI, Next.js, TypeScript, OpenAI, Tesseract, SQLite, Docker)
- [ ] 6.1.8 Add an "Architecture" section with a simple ASCII or mermaid diagram:
  ```
  Browser → Next.js (Vercel) → FastAPI (Railway)
                                    ↓
                           OpenAI GPT-4o + Tesseract OCR + SQLite
  ```
- [ ] 6.1.9 Rewrite the "Quick Start" section to be copy-paste friendly (include the `cp .env.example .env` step prominently)
- [ ] 6.1.10 Add a "Running Tests" section: backend (`pytest`), frontend (`npm test`), e2e (`npx playwright test`)
- [ ] 6.1.11 Add an "API Reference" section linking to the Railway URL's `/docs` (FastAPI auto-docs)
- [ ] 6.1.12 Add a "Built for" section: "Built for ThunderHacks 2026 (Algoma University), NextDev Hackathon 2026, Develop the Next Hackathon 2026"
- [ ] 6.1.13 Add "What's Next" section (the Devpost copy will reuse this): browser extension, email .eml support, community threat feed
- [ ] 6.1.14 Add a "License" section: MIT
- [ ] 6.1.15 README total length: aim for 400-600 lines — comprehensive but not overwhelming

### 6.2 Repo hygiene
- [ ] 6.2.1 Delete `plan.md` from root — it was pre-build planning, not useful to judges
- [ ] 6.2.2 Delete `BUILD_BLUEPRINT.md` from root — ditto (or move to `docs/` if you want to keep it)
- [ ] 6.2.3 Keep `tasks.md` — it shows methodical planning which judges appreciate
- [ ] 6.2.4 Add `docs/` directory with `ARCHITECTURE.md` describing the system design decisions
- [ ] 6.2.5 Add `docs/DEMO_SCENARIOS.md` with the 5 demo scenarios and sample inputs
- [ ] 6.2.6 Add topics/tags to the GitHub repo: `ai`, `scam-detection`, `fastapi`, `nextjs`, `openai`, `hackathon`
- [ ] 6.2.7 Add a repository description: "AI-powered scam detection for messages, screenshots, and links. Evidence-first risk analysis with explainable scores."
- [ ] 6.2.8 Ensure the repo's default branch is `main` and it has at least 10 commits (shows work was done incrementally)
- [ ] 6.2.9 Pin the most important files at the top of the repo (GitHub lets you pin up to 6)
- [ ] 6.2.10 Make sure `.gitignore` excludes: `*.db`, `__pycache__`, `node_modules`, `.env`, `htmlcov`, `playwright-report`, `.next`

---

## TIER 7 — NEW PLAYWRIGHT TESTS (fill the coverage gaps)

### 7.1 Scenario tab tests (currently only 2 — need 6 more)
- [ ] 7.1.1 `scenario-analysis.spec.ts` → test that signal badges appear when text is filled
- [ ] 7.1.2 Test that signal badge disappears when text is cleared
- [ ] 7.1.3 Test URL signal badge appears when URL is entered
- [ ] 7.1.4 Test "Analyze All" disabled with zero inputs, enabled with one input
- [ ] 7.1.5 Test successful scenario analysis with text only → result shows
- [ ] 7.1.6 Test successful scenario analysis with text + URL → result shows, evidence from both signals present
- [ ] 7.1.7 Test that switching from Scenario tab to Text tab mid-analysis doesn't crash
- [ ] 7.1.8 Test that the correct API endpoint (`/analyze/scenario` not `/analyze/text`) is called

### 7.2 Accessibility tests (add @axe-core/playwright)
- [ ] 7.2.1 Install: `npm install -D @axe-core/playwright` in `apps/web`
- [ ] 7.2.2 Create `e2e/accessibility.spec.ts`
- [ ] 7.2.3 Test: home page has zero axe violations
- [ ] 7.2.4 Test: analyze page has zero axe violations
- [ ] 7.2.5 Test: analyze page with a result showing has zero axe violations
- [ ] 7.2.6 Test: history page has zero axe violations
- [ ] 7.2.7 Test: about page has zero axe violations
- [ ] 7.2.8 Test: modal dialog (clear history confirmation) has zero axe violations
- [ ] 7.2.9 Test: all form inputs have associated labels
- [ ] 7.2.10 Test: all images have non-empty alt text

### 7.3 Responsive tests
- [ ] 7.3.1 Create `e2e/responsive.spec.ts`
- [ ] 7.3.2 Configure viewport fixtures: `mobile: { width: 375, height: 667 }`, `tablet: { width: 768, height: 1024 }`
- [ ] 7.3.3 Mobile test: navbar hamburger is visible at 375px
- [ ] 7.3.4 Mobile test: analyzer widget fills width correctly
- [ ] 7.3.5 Mobile test: result card is readable (no overflow)
- [ ] 7.3.6 Mobile test: history cards stack vertically (not side-by-side)
- [ ] 7.3.7 Tablet test: layout renders correctly between breakpoints

### 7.4 Dark mode tests
- [ ] 7.4.1 Configure Playwright to test with `colorScheme: 'dark'`
- [ ] 7.4.2 Test: analyze page in dark mode has no white backgrounds
- [ ] 7.4.3 Test: result card in dark mode — risk badge is visible (not invisible against dark bg)
- [ ] 7.4.4 Test: theme toggle button switches class on `<html>` element

### 7.5 Performance smoke tests
- [ ] 7.5.1 Create `e2e/performance.spec.ts`
- [ ] 7.5.2 Test: home page DOMContentLoaded < 3000ms
- [ ] 7.5.3 Test: analyze page loads in < 2000ms
- [ ] 7.5.4 Test: analysis result appears within 15000ms of submit (generous for LLM)

---

## TIER 8 — DEVPOST SUBMISSION COPY

### 8.1 Submission text (write this before filling Devpost)
- [ ] 8.1.1 **Project title:** "ProofPulse — Verify Before You Trust"
- [ ] 8.1.2 **Tagline (1 sentence):** "AI-powered scam detection that analyzes suspicious messages, screenshots, and links — then explains exactly why they're dangerous."
- [ ] 8.1.3 **What it does (2 paragraphs):**
  - Para 1: "ProofPulse is an AI trust layer that gives anyone an instant second opinion on suspicious communications. Paste a text message, upload a screenshot, or drop in a URL, and ProofPulse returns an evidence-first risk score from 0–100 with a detailed breakdown of exactly which signals triggered the alert — not just a vague 'risky' label."
  - Para 2: "The evidence panel shows specific details like 'Domain uses number substitution (amaz0n.ru)' or 'Artificial urgency: 24-hour deadline with threat of permanent account deletion' — the same reasoning a trained fraud analyst would use. Users get concrete next steps: report links, block numbers, and verify through official channels."
- [ ] 8.1.4 **How we built it:** Describe the tech stack, the multi-stage pipeline (OCR → URL scanner → LLM with few-shot prompting → evidence extraction), the concurrent multi-signal analysis, and the evidence-first prompt design.
- [ ] 8.1.5 **Challenges:** "The hardest part was designing a prompt that produces consistently structured JSON with specific evidence items rather than generic warnings. It took 12 iterations of the system prompt and few-shot examples before the LLM reliably cited specific text from the input rather than producing boilerplate advice."
- [ ] 8.1.6 **Accomplishments:** 102 backend tests at 83% coverage, 24/24 Playwright E2E tests, multi-modal input, concurrent scenario analysis, full deployment.
- [ ] 8.1.7 **What we learned:** Describe the prompt engineering learnings, the importance of evidence-first design, and the complexity of multi-signal correlation.
- [ ] 8.1.8 **What's next:** Browser extension, email .eml file upload, community threat feed, multi-language support.
- [ ] 8.1.9 **The "Secret Sauce" (ThunderHacks specific):** "Getting the LLM to produce evidence items that cite specific text from the input — not generic 'suspicious domain' labels — required iterative prompt engineering with few-shot examples and an evidence weight validation layer."

### 8.2 Devpost media
- [ ] 8.2.1 Screenshot 1: Home page hero with the live stats counter showing
- [ ] 8.2.2 Screenshot 2: Analyze page with a CRITICAL-risk phishing SMS result — evidence cards fully visible
- [ ] 8.2.3 Screenshot 3: Evidence breakdown expanded showing all items with red/yellow/green flags
- [ ] 8.2.4 Screenshot 4: History page with 5+ entries showing a mix of risk levels
- [ ] 8.2.5 Screenshot 5 (bonus): Mobile view of the result card
- [ ] 8.2.6 All screenshots: 1920×1080 or 1280×800, no browser chrome (use full-screen mode)
- [ ] 8.2.7 Use dark mode for screenshots — looks more polished and modern

### 8.3 Demo video script (2 min 30 sec)
- [ ] 8.3.1 **0:00–0:20** — Hook: "Every day, millions of people receive scam messages and can't tell if they're real. ProofPulse gives you an instant, evidence-based second opinion."
- [ ] 8.3.2 **0:20–0:50** — Demo 1 (Text): Paste a phishing SMS ("Your PayPal account is limited. Verify now: paypa1-verify.ru/secure"). Show the CRITICAL result animating in. Zoom in on the evidence cards — "Look: it detected the number substitution in the domain, the .ru TLD, and the artificial urgency."
- [ ] 8.3.3 **0:50–1:20** — Demo 2 (Screenshot): Upload a fake delivery scam screenshot. Show OCR extracting the text. Show HIGH risk result.
- [ ] 8.3.4 **1:20–1:50** — Demo 3 (Scenario): Use all three inputs simultaneously for a job-offer scam. Show how combining signals increases confidence score.
- [ ] 8.3.5 **1:50–2:10** — History page: show the accumulated analyses with risk level badges.
- [ ] 8.3.6 **2:10–2:30** — Close: "ProofPulse: verify before you trust. The link is in the description." Show the live URL.
- [ ] 8.3.7 Record video with OBS or Loom (Loom is faster, OBS has better quality)
- [ ] 8.3.8 Upload to YouTube (unlisted) or Loom — Devpost accepts both
- [ ] 8.3.9 Add captions for accessibility

### 8.4 Submit to each hackathon
- [ ] 8.4.1 **ThunderHacks** (Mar 15): Submit at thunderhacks.devpost.com — fill all fields, attach video, add GitHub + live URL
- [ ] 8.4.2 **NextDev** (Mar 24): Submit at nextdev-hackathon.devpost.com — same content, no changes needed
- [ ] 8.4.3 **Develop the Next** (Mar 25): Submit at developnext.devpost.com — same content
- [ ] 8.4.4 For each submission: double-check the "Technologies Used" field lists all: Python, FastAPI, Next.js, TypeScript, Tailwind CSS, OpenAI GPT-4o, Tesseract OCR, SQLite, Docker, GitHub Actions, Vercel, Railway, Playwright

---

## TIER 9 — STRETCH GOALS (if time allows)

### 9.1 High-impact stretch features
- [ ] 9.1.1 **PDF export:** Use `jsPDF` + `html2canvas` to export the result card as a PDF — "Download Evidence Report" button
- [ ] 9.1.2 **Confetti on CRITICAL:** Use `canvas-confetti` npm package — when risk_level === 'CRITICAL', trigger confetti after the result animates in ("You caught a scam!")
- [ ] 9.1.3 **Browser extension stub:** Create `apps/extension/manifest.json` + `content.js` that adds a "Check with ProofPulse" right-click menu item — even if it just opens the web app, it shows product vision
- [ ] 9.1.4 **Email .eml upload:** Add an `eml` tab to the analyzer — parse the raw .eml text with a Python library (`email` stdlib) and extract subject + body for analysis
- [ ] 9.1.5 **Real-time threat counter:** WebSocket endpoint in FastAPI that broadcasts the count of new HIGH/CRITICAL analyses — frontend subscribes and shows a live counter in the navbar
- [ ] 9.1.6 **Shareable result page:** Add `app/result/[id]/page.tsx` — a public read-only view of an analysis that can be shared via URL (already have the data, just need the route)

### 9.2 Test coverage push (83% → 90%)
- [ ] 9.2.1 Identify the 17% uncovered lines using the HTML coverage report
- [ ] 9.2.2 Most likely uncovered: error handling branches in `url_scanner.py` (timeout, malformed URL)
- [ ] 9.2.3 Add `test_url_scanner_timeout` — mock httpx to raise `TimeoutException`
- [ ] 9.2.4 Add `test_url_scanner_malformed_url` — URL with invalid chars
- [ ] 9.2.5 Add `test_llm_json_parse_failure_retries` — mock first OpenAI call to return invalid JSON, second call succeeds
- [ ] 9.2.6 Add `test_llm_rate_limit_backoff` — mock OpenAI to raise RateLimitError twice then succeed
- [ ] 9.2.7 Add `test_ocr_tesseract_not_found` — mock pytesseract.TesseractNotFoundError
- [ ] 9.2.8 Add `test_scenario_concurrent_execution` — verify asyncio.gather is actually called (all sub-analyzers run in parallel)
- [ ] 9.2.9 Add `test_history_soft_delete` — deleted items don't appear in list
- [ ] 9.2.10 Add `test_history_stats_accuracy` — create 5 analyses at known risk levels, verify stats computation
- [ ] 9.2.11 Run coverage and confirm ≥ 90%

---

## FINAL SUBMISSION CHECKLIST
- [ ] CI is green (all jobs pass, no warnings)
- [ ] `npm run lint` exits 0 locally
- [ ] `npx tsc --noEmit` exits 0 locally
- [ ] `pytest` shows 102+ tests, ≥ 83% coverage
- [ ] `npx playwright test` shows 24+ tests passing
- [ ] Backend live at Railway URL — health check returns 200
- [ ] Frontend live at Vercel URL — analyze flow works end-to-end
- [ ] README has banner, badges, screenshots, quick start, architecture
- [ ] Demo video is uploaded and linked
- [ ] Devpost submission filled for all 3 hackathons
- [ ] GitHub repo has 10+ commits, topics set, description set
- [ ] No secrets committed to git
- [ ] No console.log / print debug statements in production code
- [ ] Dark mode works across all pages
- [ ] Mobile layout works at 375px

---
*Phase 2 tasks | Target: 95/100 judging score | Deadlines: Mar 15 / Mar 24 / Mar 25*
