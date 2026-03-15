# ProofPulse — Design System & Architecture Reference
## Frontend Design Template · Backend Architecture Map
> The authoritative reference for how every screen, component, and API is structured.
> All implementation decisions flow from this document.

---

# PART 1: FRONTEND DESIGN SYSTEM

## 1.1 Design Philosophy

ProofPulse communicates danger. The entire visual language must reinforce:
- **Clarity over decoration** — when someone sees CRITICAL, they must feel it immediately
- **Evidence first** — the score is a number; the evidence is the story
- **Trust through specificity** — generic warnings feel like spam; specific quotes feel authoritative
- **Speed** — loading must feel fast even when it isn't (progress bars, rotating messages)

## 1.2 Color System

### Brand Colors (defined in `tailwind.config.ts`)
```typescript
colors: {
  brand: {
    DEFAULT: '#3B82F6',   // Primary blue
    dark:    '#1D4ED8',   // Hover state
    light:   '#93C5FD',   // Background tint
  },
  surface: {
    DEFAULT: '#0F172A',   // Page bg (dark)
    elevated: '#1E293B',  // Card bg (dark)
    border:   '#334155',  // Border (dark)
  }
}
```

### Risk Semantic Colors — the most important colors in the entire system
```typescript
risk: {
  safe: {
    text:    '#16A34A',  // text-risk-safe
    border:  '#22C55E',  // border-risk-safe
    bg:      '#F0FDF4',  // bg-risk-safe (light) / #052e16 (dark)
    icon:    'ShieldCheck', // lucide-react icon name
  },
  low: {
    text:    '#2563EB',
    border:  '#3B82F6',
    bg:      '#EFF6FF',
    icon:    'Shield',
  },
  medium: {
    text:    '#D97706',
    border:  '#F59E0B',
    bg:      '#FFFBEB',
    icon:    'ShieldAlert',
  },
  high: {
    text:    '#DC2626',
    border:  '#EF4444',
    bg:      '#FEF2F2',
    icon:    'ShieldX',
  },
  critical: {
    text:    '#7C3AED',
    border:  '#8B5CF6',
    bg:      '#F5F3FF',
    icon:    'ShieldX',      // same icon, pulsing border
    animation: 'pulse-border 2s ease-in-out infinite',
  }
}
```

### Evidence Flag Colors
```typescript
flag: {
  red:    { border: '#EF4444', bg: 'rgba(239,68,68,0.06)'   },
  yellow: { border: '#F59E0B', bg: 'rgba(245,158,11,0.06)'  },
  green:  { border: '#22C55E', bg: 'rgba(34,197,94,0.06)'   },
}
```

### Dark Mode Equivalents
Every color must be tested in dark mode. Rules:
- Risk colors use lighter stops in dark: `text-green-400` not `text-green-800`
- Card borders use `dark:border-slate-700`
- Background surfaces use `dark:bg-slate-900` (page) and `dark:bg-slate-800` (cards)
- Text uses `dark:text-slate-100` for headings, `dark:text-slate-300` for body

## 1.3 Typography Scale

```css
/* In globals.css */
:root {
  --font-display: 'Inter', system-ui, sans-serif;   /* headings */
  --font-body:    'Inter', system-ui, sans-serif;   /* body */
  --font-mono:    'JetBrains Mono', monospace;      /* code, IDs */
}

/* Scale */
.text-hero    { font-size: 3rem;   font-weight: 700; line-height: 1.1; }
.text-h1      { font-size: 2rem;   font-weight: 600; line-height: 1.2; }
.text-h2      { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
.text-h3      { font-size: 1.25rem;font-weight: 500; line-height: 1.4; }
.text-verdict { font-size: 1.25rem;font-weight: 500; line-height: 1.5; }  /* result verdict */
.text-body    { font-size: 1rem;   font-weight: 400; line-height: 1.7; }
.text-caption { font-size: 0.875rem;font-weight: 400;line-height: 1.5; }
.text-micro   { font-size: 0.75rem; font-weight: 400;line-height: 1.4; }
```

## 1.4 Spacing System

Use Tailwind's default 4px base unit. Key spacing decisions:
- Page max-width: `max-w-4xl` (896px) — keeps content readable, not too wide
- Section padding: `py-16 md:py-24` — generous breathing room between sections
- Card padding: `p-6` (24px) — spacious interior
- Component gap: `gap-4` (16px) between related items, `gap-8` between sections
- Input height: `h-10` (40px) — approachable, not tiny
- Button height: `h-10` small, `h-12` default, `h-14` hero CTA

## 1.5 Animation System

### Keyframes (in `globals.css`)
```css
@keyframes pulse-border {
  0%, 100% { border-color: rgb(139 92 246 / 0.7); }
  50%       { border-color: rgb(139 92 246 / 1.0); }
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes count-up {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Framer Motion Variants (in `lib/animations.ts`)
```typescript
export const cardEntrance = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } }
};
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
};
export const staggerItem = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } }
};
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.6 } }
};
```

## 1.6 Component Library Reference

### Layout Components

#### `<PageContainer>`
```tsx
// Max-width wrapper, centers content, adds page padding
// Usage: wraps every page's main content
<PageContainer>
  <h1>Page Title</h1>
  ...content
</PageContainer>

// Implementation:
function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  );
}
```

#### `<Navbar>`
```
Structure (left → right):
[Logo: shield icon + "ProofPulse"]  [spacer]  [Analyze] [History] [About]  [ThemeToggle]

Mobile (< 768px):
[Logo]  [spacer]  [HamburgerButton]
  → drawer slides in from right with all links

Active link: underline + brand color text
Hover: brand color text transition 150ms

ThemeToggle: Sun/Moon icon (lucide-react), 40px tap target
  onClick: useTheme().toggle()
  suppressHydrationWarning on the button element
```

#### `<Footer>`
```
Left: © 2026 ProofPulse · MIT License
Center: GitHub link (icon + "View source")
Right: "AI may make mistakes. Always verify with official sources."
Background: surface.elevated (dark) / slate-50 (light)
Border top: 1px border-slate-200 dark:border-slate-800
```

### Input Components

#### `<Button>`
```tsx
// Variants:
// primary   — brand blue bg, white text
// secondary — transparent bg, brand border, brand text
// ghost     — no border, muted text, hover bg-slate-100
// danger    — red bg or border
// Sizes: sm (h-8 text-sm), md (h-10 text-base, DEFAULT), lg (h-12 text-lg)

// Loading state:
// - Spinner replaces left icon
// - Text changes to loadingText prop or "Loading..."
// - Pointer-events: none, opacity: 0.7

// All buttons: focus ring, keyboard accessible, aria-disabled when disabled

<Button variant="primary" size="lg" loading={isLoading} loadingText="Analyzing...">
  Analyze
</Button>
```

#### `<Textarea>`
```tsx
// Props: value, onChange, placeholder, maxLength, contextLabel (optional second field)
// Character counter: right-aligned below, "{current}/{max}"
// Counter color: default text-slate-400, amber at >80%, red at >95%
// Resize: vertical only (resize-y), min-height: 120px, max-height: 400px
// Focus: ring-2 ring-brand focus:border-brand
```

#### `<FileDropzone>`
```tsx
// Props: onFile, accept (default "image/*"), maxSizeMB (default 10)
// Default state: dashed border, upload icon, "Drag & drop or click to browse"
// Dragover state: border becomes solid brand color, bg changes to light brand tint
// File selected state: shows image preview + file name + file size + remove button
// Error state: red border, error message below
// Tap target: entire zone is clickable on mobile
```

### Display Components

#### `<RiskBadge>`
```tsx
// Props: level: RiskLevel, size?: 'sm' | 'md' | 'lg'
// Renders: colored pill with icon + label text
// SAFE:     green  background, ShieldCheck icon, "Safe"
// LOW:      blue   background, Shield icon,      "Low Risk"
// MEDIUM:   amber  background, ShieldAlert icon, "Medium Risk"
// HIGH:     red    background, ShieldX icon,     "High Risk"
// CRITICAL: purple background, ShieldX icon,     "Critical Risk" + animation class

// data-testid="risk-badge"
```

#### `<RiskScoreDonut>`
```tsx
// Props: score: number (0-100), level: RiskLevel, size?: 'sm'|'md'|'lg'
// SVG ring: cx=60,cy=60, r=50, strokeWidth=8
// strokeDasharray=314 (circumference), strokeDashoffset animates from 314→ final
// Ring color = risk level color
// Center: animated counter (0→score), below: risk level label (fades in after)
// Animation: requestAnimationFrame cubic-bezier(0.34,1.56,0.64,1) over 1200ms
// useReducedMotion: skip to final value instantly

// data-testid="risk-score-donut"
// data-testid="risk-score-value" on the number element
```

#### `<EvidenceItem>`
```tsx
// Props: item: EvidenceItem (label, value, weight, flag)
// Layout: left border (4px, flag color) + padding + label row + value row + weight bar
// Label: 14px font-medium, flag icon (🔴/🟡/🟢 represented as colored dot, not emoji)
// Value: 14px text-slate-600 dark:text-slate-400, italic
// Weight bar: h-1, rounded-full, flag color, width = `${weight * 100}%`, max 100%
// Entry animation: staggerItem variant (slides in from left 12px)
```

#### `<FeedbackWidget>`
```tsx
// data-testid="feedback-widget"
// Initial: "Was this analysis helpful?" with 👍 / 👎
// After click: star rating (1-5) + optional comment field + Submit button
// After submit: "Thank you for your feedback!" fade in, widget disabled
// Error: if 409 (duplicate), show "You've already rated this analysis"

// States:
type FeedbackState = 'idle' | 'rating' | 'submitting' | 'done' | 'duplicate';
```

## 1.7 Page Layouts

### Home Page (`/`)

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  HERO SECTION                           │
│  ┌───────────────────┐  ┌────────────┐  │
│  │ "Is this a scam?" │  │ [Demo card]│  │
│  │ Subheadline       │  │ CRITICAL   │  │
│  │ [Analyze Now →]   │  │ result     │  │
│  └───────────────────┘  └────────────┘  │
├─────────────────────────────────────────┤
│  LIVE STATS BAR                         │
│  X analyses  ·  Y scams caught today    │
├─────────────────────────────────────────┤
│  HOW IT WORKS (3 steps)                 │
│  [1. Submit] → [2. Analyze] → [3. Act] │
├─────────────────────────────────────────┤
│  FEATURES (3 cards)                     │
│  [Text]  [Screenshot]  [URL + Scenario] │
├─────────────────────────────────────────┤
│  IMPACT STAT                            │
│  "$442B lost to scams in 2025"          │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

### Analyze Page (`/analyze`)

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  PAGE HEADER                            │
│  "Analyze Suspicious Content"           │
├─────────────────────────────────────────┤
│  ANALYZER WIDGET                        │
│  ┌─────────────────────────────────┐    │
│  │ [Text] [Screenshot] [URL] [All] │    │  ← Radix Tabs
│  ├─────────────────────────────────┤    │
│  │                                 │    │
│  │  TAB CONTENT (varies by tab)    │    │
│  │                                 │    │
│  │  [Analyze Button]               │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  LOADING STATE (during fetch)   │    │
│  └─────────────────────────────────┘    │
│  OR                                     │
│  ┌─────────────────────────────────┐    │
│  │  RESULT CARD (after success)    │    │
│  │  ┌──────┐  Verdict text         │    │
│  │  │Donut │  Risk badge           │    │
│  │  │ 96   │  Confidence           │    │
│  │  └──────┘                       │    │
│  │  Evidence items (staggered)     │    │
│  │  Recommendations                │    │
│  │  Next Steps                     │    │
│  │  [Copy] [Share] [Download]      │    │
│  │  Feedback widget                │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

Mobile Analyze Page:
- Tabs: icon-only or abbreviated on mobile to prevent wrapping
- Result card: donut shrinks to 80px, evidence shows 3 items initially
- Sticky "Copy Report" button at bottom of viewport on mobile

### History Page (`/history`)

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  STATS BAR                              │
│  [Total: X]  [High Risk: Y]  [Safe: Z]  │
├─────────────────────────────────────────┤
│  FILTER ROW                             │
│  [Risk Level ▼]  [Input Type ▼]  [Export CSV] [Clear All]│
├─────────────────────────────────────────┤
│  HISTORY LIST                           │
│  ┌─────────────────────────────────┐    │
│  │ [icon] Type · 2h ago  [CRITICAL]│    │
│  │ "This is a phishing attempt..." │    │
│  │                          [View] │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ [icon] URL  · 5h ago  [SAFE]   │    │
│  │ "No suspicious signals found"  │    │
│  │                          [View] │    │
│  └─────────────────────────────────┘    │
│  ...                                    │
├─────────────────────────────────────────┤
│  PAGINATION                             │
│  [← Prev] [1] [2] [3] [Next →]  20/pg  │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

Empty State:
```
        [SVG: shield with magnifying glass]
        "No analyses yet"
        "Start by checking something suspicious"
        [Analyze Something Now →]
```

### Result Detail Page (`/history/[id]` and `/result/[id]`)

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  BREADCRUMB: History > Analysis #abc123 │
├─────────────────────────────────────────┤
│  RESULT CARD (same as analyze page)     │
│  But: no feedback widget on /result/[id]│
│       feedback widget on /history/[id]  │
│       "Analyze Another" on history page │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

## 1.8 Responsive Breakpoints

```
Mobile first:     default styles apply to all sizes
sm:  640px+       tablet portrait
md:  768px+       tablet landscape / small desktop
lg:  1024px+      desktop
xl:  1280px+      wide desktop

Key breakpoint decisions:
- Navbar: hamburger below md, full links at md+
- Home hero: single column below md, two column at md+
- Feature cards: 1 col below sm, 2 cols at sm, 3 cols at lg
- History list: full width always (cards, not table)
- Analyzer widget: full width always
- Result card: full width, donut shrinks at mobile
```

## 1.9 Accessibility Requirements

Every component must satisfy:
- Color contrast: 4.5:1 minimum for text (WCAG AA)
- Risk level never conveyed by color alone — always icon + text too
- All interactive elements: visible focus ring (ring-2 ring-brand)
- Buttons: minimum 44×44px tap target
- Images: non-empty `alt` attribute
- Modals: `role="dialog"`, `aria-modal="true"`, focus trap, Escape close
- Form inputs: `<label>` associated via `htmlFor` or `aria-label`
- Error messages: `role="alert"` for immediate announcement
- Loading states: `aria-live="polite"` on message container

## 1.10 Data-testid Map (complete reference for Playwright)

```
Page elements:
  data-testid="navbar"
  data-testid="nav-link-analyze"
  data-testid="nav-link-history"
  data-testid="nav-link-about"
  data-testid="theme-toggle"
  data-testid="mobile-menu-button"
  data-testid="mobile-menu"

Analyzer:
  data-testid="analyzer-widget"
  data-testid="tab-text"
  data-testid="tab-image"
  data-testid="tab-url"
  data-testid="tab-scenario"
  data-testid="text-input"
  data-testid="char-counter"
  data-testid="context-input"
  data-testid="try-example-button"
  data-testid="file-dropzone"
  data-testid="file-preview"
  data-testid="url-input"
  data-testid="follow-redirects-toggle"
  data-testid="signal-badge-text"
  data-testid="signal-badge-url"
  data-testid="signal-badge-image"
  data-testid="analyze-button"
  data-testid="clear-button"
  data-testid="cancel-button"

Loading:
  data-testid="loading-state"
  data-testid="loading-message"
  data-testid="loading-progress"

Result:
  data-testid="analysis-result"
  data-testid="risk-score-donut"
  data-testid="risk-score-value"
  data-testid="risk-badge"
  data-testid="verdict-text"
  data-testid="confidence-value"
  data-testid="evidence-section"
  data-testid="evidence-item" (×N, add index: evidence-item-0, -1, ...)
  data-testid="evidence-show-all"
  data-testid="recommendations-section"
  data-testid="next-steps-section"
  data-testid="copy-report-button"
  data-testid="share-result-button"
  data-testid="download-pdf-button"
  data-testid="analyze-another-button"
  data-testid="result-metadata"

Feedback:
  data-testid="feedback-widget"
  data-testid="feedback-thumbs-up"
  data-testid="feedback-thumbs-down"
  data-testid="feedback-star-1" through "feedback-star-5"
  data-testid="feedback-comment"
  data-testid="feedback-submit"
  data-testid="feedback-success"

History:
  data-testid="history-stats-bar"
  data-testid="history-filter-risk"
  data-testid="history-filter-type"
  data-testid="history-list"
  data-testid="history-card" (×N)
  data-testid="history-card-risk-badge"
  data-testid="history-empty-state"
  data-testid="history-pagination"
  data-testid="history-export-csv"
  data-testid="history-clear-button"
  data-testid="history-clear-modal"
  data-testid="history-clear-confirm"
  data-testid="history-clear-cancel"
```

---

# PART 2: BACKEND ARCHITECTURE

## 2.1 System Architecture

```
Internet → Railway (FastAPI)
              │
              ├── Request Middleware Stack (in order):
              │     1. RequestIDMiddleware (attach UUID to every request)
              │     2. CORSMiddleware (validate origin)
              │     3. RateLimitMiddleware (slowapi, per-IP)
              │     4. LoggingMiddleware (structlog, all requests)
              │     5. ErrorHandlerMiddleware (catch-all → JSON envelope)
              │
              ├── Routers
              │     ├── /api/v1/analyze/*   → AnalyzeRouter
              │     ├── /api/v1/history/*   → HistoryRouter
              │     ├── /api/v1/feedback    → FeedbackRouter
              │     ├── /api/v1/result/*    → ResultRouter (shareable)
              │     └── /api/v1/health/*    → HealthRouter
              │
              ├── Services
              │     ├── LLMAnalyzer         → OpenAI GPT-4o
              │     ├── OCRService          → Tesseract
              │     ├── URLScanner          → httpx + heuristics
              │     └── [future: AudioTranscriber → Whisper]
              │
              └── Database (SQLite → Postgres)
                    ├── analyses
                    ├── feedback
                    ├── url_cache
                    └── [future: users, api_keys, patterns]
```

## 2.2 Request/Response Envelope

### Success envelope
```json
{
  "analysis_id": "uuid-v4",
  "risk_score": 87,
  "risk_level": "HIGH",
  "verdict": "This is a phishing attempt...",
  "confidence": 0.95,
  "evidence": [
    {
      "label": "Spoofed domain",
      "value": "amaz0n-verify.ru uses number substitution and .ru TLD",
      "weight": 0.92,
      "flag": "red"
    }
  ],
  "recommendations": ["Do not click any links"],
  "next_steps": ["Report as phishing", "Block sender"],
  "model_used": "gpt-4o",
  "latency_ms": 1243,
  "input_type": "text"
}
```

### Error envelope (all errors use this)
```json
{
  "code": 422,
  "message": "Text field is required and cannot be empty",
  "field": "text",
  "request_id": "uuid-v4",
  "timestamp": "2026-03-15T12:00:00Z"
}
```

## 2.3 Database Schema (complete)

```sql
-- analyses: core table
CREATE TABLE analyses (
  id                  TEXT    PRIMARY KEY,      -- UUID v4
  created_at          TEXT    NOT NULL,          -- ISO 8601
  input_type          TEXT    NOT NULL CHECK(input_type IN ('text','image','url','scenario','audio','email','qr')),
  raw_input           TEXT,                      -- original user input (truncated at 10k)
  input_preview       TEXT,                      -- first 100 chars for list display
  extracted_text      TEXT,                      -- OCR output if image
  risk_score          INTEGER NOT NULL CHECK(risk_score BETWEEN 0 AND 100),
  risk_level          TEXT    NOT NULL CHECK(risk_level IN ('SAFE','LOW','MEDIUM','HIGH','CRITICAL')),
  verdict             TEXT    NOT NULL,
  evidence_json       TEXT    NOT NULL DEFAULT '[]',
  recommendations_json TEXT   NOT NULL DEFAULT '[]',
  next_steps_json     TEXT    NOT NULL DEFAULT '[]',
  confidence          REAL    NOT NULL DEFAULT 0.0,
  model_used          TEXT,
  prompt_version      TEXT,                      -- track which prompt version was used
  latency_ms          INTEGER,
  tokens_used         INTEGER,
  ip_hash             TEXT,                      -- SHA-256 of IP for rate tracking
  deleted_at          TEXT,                      -- soft delete
  user_id             TEXT                       -- nullable, future: FK to users
);

CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_risk_level  ON analyses(risk_level);
CREATE INDEX idx_analyses_input_type  ON analyses(input_type);
CREATE INDEX idx_analyses_deleted_at  ON analyses(deleted_at);

-- feedback
CREATE TABLE feedback (
  id                TEXT    PRIMARY KEY,
  analysis_id       TEXT    NOT NULL REFERENCES analyses(id),
  created_at        TEXT    NOT NULL,
  rating            INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  user_comment      TEXT,
  was_actually_scam INTEGER,                     -- boolean: 1=yes, 0=no, NULL=unknown
  ip_hash           TEXT
);
CREATE UNIQUE INDEX idx_feedback_analysis_id ON feedback(analysis_id);

-- url_cache: avoid re-scanning same URL within 24h
CREATE TABLE url_cache (
  id             TEXT    PRIMARY KEY,
  url_hash       TEXT    NOT NULL UNIQUE,         -- SHA-256 of normalized URL
  scanned_at     TEXT    NOT NULL,
  final_url      TEXT,                            -- after following redirects
  redirect_chain TEXT    NOT NULL DEFAULT '[]',   -- JSON array of redirect URLs
  is_suspicious  INTEGER NOT NULL,                -- boolean
  signals_json   TEXT    NOT NULL DEFAULT '{}',   -- all URL analysis signals
  expires_at     TEXT    NOT NULL                 -- scanned_at + 24h
);

-- api_keys (Phase 3)
CREATE TABLE api_keys (
  id              TEXT    PRIMARY KEY,
  user_id         TEXT    NOT NULL,
  key_prefix      TEXT    NOT NULL,               -- first 8 chars displayed to user
  key_hash        TEXT    NOT NULL UNIQUE,         -- SHA-256 of full key
  name            TEXT,
  created_at      TEXT    NOT NULL,
  last_used_at    TEXT,
  revoked_at      TEXT,
  daily_limit     INTEGER NOT NULL DEFAULT 100
);
```

## 2.4 API Endpoint Map (complete)

```
ANALYSIS
  POST /api/v1/analyze/text        Body: {text, context?}
  POST /api/v1/analyze/image       Body: multipart/form-data file
  POST /api/v1/analyze/url         Body: {url, follow_redirects?}
  POST /api/v1/analyze/scenario    Body: {text?, url?, image_base64?, context?}
  POST /api/v1/analyze/audio       Body: multipart/form-data audio file [Phase 2]
  POST /api/v1/analyze/email       Body: multipart/form-data .eml file [Phase 2]
  POST /api/v1/analyze/qr          Body: multipart/form-data image [Phase 2]

HISTORY
  GET  /api/v1/history             Query: page, per_page, risk_level, input_type
  GET  /api/v1/history/stats       Returns: total, avg_score, scam_rate, by_day
  GET  /api/v1/history/{id}        Returns: full analysis
  DELETE /api/v1/history/{id}      Soft-deletes (sets deleted_at)
  DELETE /api/v1/history           Header: X-Confirm-Clear: true — bulk clear

SHAREABLE (public, no auth)
  GET  /api/v1/result/{id}         Same as history/{id} but excludes deleted

FEEDBACK
  POST /api/v1/feedback            Body: {analysis_id, rating, comment?, was_actually_scam?}
  GET  /api/v1/feedback/{analysis_id} Returns feedback for an analysis

HEALTH
  GET  /api/v1/health              Returns: {status, db_ok, openai_ok, version, uptime_seconds}
  GET  /api/v1/health/ready        Kubernetes readiness probe
  GET  /api/v1/health/live         Kubernetes liveness probe

FUTURE (Phase 2-3)
  GET  /api/v1/patterns            Browse scam pattern library
  GET  /api/v1/patterns/{id}       Single pattern
  GET  /api/v1/community/trending  Trending scam types
  POST /api/v1/community/report    Share pattern anonymously
  POST /api/v1/keys                Create API key (auth required)
  DELETE /api/v1/keys/{id}         Revoke API key
  GET  /api/v1/usage               API usage stats
```

## 2.5 LLM Prompt Architecture

### Prompt Version Control
Every analysis stores `prompt_version` (e.g., `v1.3`). This lets you A/B test prompts and track quality over time.

### System Prompt Invariants (must always be true)
1. Output is ONLY JSON — no preamble, no markdown fences
2. `evidence` items must quote or paraphrase specific text from the input
3. `risk_score` is always 0-100
4. `risk_level` must be consistent with `risk_score`:
   - 0-20 → SAFE, 21-40 → LOW, 41-60 → MEDIUM, 61-80 → HIGH, 81-100 → CRITICAL
5. At least 2 evidence items, maximum 8
6. At least 1 recommendation, at least 1 next step

### Prompt Layers
```
System prompt (invariant):
  Role + output contract + risk score guide + evidence rules + 3 few-shot examples

User prompt (per request):
  Text analysis:    "Analyze this message: {text}\nContext: {context}"
  Image analysis:   "Analyze this extracted text from an image (OCR confidence: {conf}%): {text}"
  URL analysis:     "Analyze this URL and signals: {url}\nSignals: {signals_json}"
  Scenario:         "Analyze this combined submission:\nText: {text}\nURL: {url}\nImage text: {ocr}"
  Audio (future):   "Analyze this phone call transcript: {transcript}"
  Email (future):   "Analyze this email:\nFrom: {from}\nSubject: {subject}\nBody: {body}"
```

## 2.6 URL Scanner Signal Map

Every URL analysis produces a `signals` dict. Higher `weight` = stronger indicator.

```python
signals = {
  # Red flags (weight 0.6-1.0)
  "ip_address_url":           bool,   # e.g. http://192.168.1.1/login
  "number_substitution":      bool,   # amaz0n, paypa1, g00gle
  "lookalike_brand":          str,    # "amazon" → detected as "amaz0n"
  "suspicious_tld":           bool,   # .ru .xyz .tk .pw .ga .cf
  "excessive_subdomains":     bool,   # > 3 subdomain levels
  "url_shortener":            bool,   # bit.ly tinyurl t.co etc.
  "login_form_detected":      bool,   # destination page has <form> with password
  "ssl_cert_mismatch":        bool,   # cert domain != URL domain
  "non_standard_port":        bool,   # not 80 or 443
  "redirect_chain_length":    int,    # > 3 redirects = suspicious
  "final_url_differs":        bool,   # final URL very different from original
  
  # Context (weight 0.2-0.5)
  "scheme":                   str,    # http or https
  "subdomain_depth":          int,    # count of subdomains
  "path_complexity":          int,    # number of path segments
  "has_query_params":         bool,
  "url_encoded_chars":        bool,   # %XX encoding in domain/path
  "domain_age_days":          int,    # None if unknown
  "redirect_chain":           list,   # full list of redirect URLs
  "final_url":                str,
  "page_title":               str,    # None if could not fetch
}
```

## 2.7 Error Handling Matrix

| Scenario | HTTP Code | User-facing Message |
|---|---|---|
| Empty text input | 422 | "Please enter some text to analyze" |
| Text > 10,000 chars | 422 | "Text is too long. Maximum 10,000 characters." |
| Image > 10MB | 413 | "Image too large. Maximum 10MB." |
| Non-image file | 422 | "Please upload an image file (PNG, JPG, etc.)" |
| OCR extracts < 20 chars | 422 | "Could not extract text from this image. Try a clearer screenshot." |
| Invalid URL scheme | 422 | "URL must start with http:// or https://" |
| All scenario inputs null | 422 | "Please provide at least one input to analyze" |
| OpenAI rate limit | 429 | "Analysis service is busy. Please try again in a moment." |
| OpenAI API error | 503 | "Analysis service unavailable. Please try again." |
| LLM returns invalid JSON (after 2 retries) | 503 | "Could not process analysis. Please try again." |
| Duplicate feedback | 409 | "You've already submitted feedback for this analysis." |
| Analysis not found | 404 | "Analysis not found or has been deleted." |
| Rate limit (user) | 429 | "Too many requests. Please wait a moment." |
| Tesseract not found | 503 | "Image analysis temporarily unavailable." |

## 2.8 Testing Strategy

### Unit Tests (pytest, `tests/`)
- Mock all external services (OpenAI, httpx) — zero real API calls
- In-memory SQLite for all tests (`sqlite+aiosqlite:///:memory:`)
- Test file naming: `test_{module}.py` mirrors `src/{module}.py`
- Every endpoint: happy path + each error case
- Every service function: happy path + timeout + error + edge cases
- Target: 90% coverage

### Integration Tests (pytest, `tests/integration/`)
- Start with `TestClient` (sync) or `AsyncClient` (async)
- Use real SQLite file in temp directory
- Mock only OpenAI
- Test full request → DB → response cycle
- Particularly important for: pagination, filtering, concurrent requests

### E2E Tests (Playwright, `e2e/`)
- `headless: false` in dev (non-headless: you see the browser)
- `headless: true` in CI only
- All analyze tests: `page.route()` mocks — no real API calls
- All history tests: `page.route()` mocks
- Accessibility tests: `@axe-core/playwright` on every page
- Video on failure, screenshot on failure, trace on first retry
- Page Object Model: every page has a corresponding Page Object class

### Contract Tests
- Response schema validation: every API response validated against Pydantic models
- TypeScript types validated: `tsc --noEmit` on full type tree including API types

---

# PART 3: FILE STRUCTURE REFERENCE

## 3.1 Frontend (`apps/web/src/`)

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout: fonts, providers, FOUC script
│   ├── page.tsx                  # Home page
│   ├── not-found.tsx             # 404 page
│   ├── error.tsx                 # Error boundary page
│   ├── loading.tsx               # Global loading
│   ├── analyze/
│   │   └── page.tsx              # Analyze page
│   ├── history/
│   │   ├── page.tsx              # History list page
│   │   └── [id]/
│   │       └── page.tsx          # History detail page
│   ├── result/
│   │   └── [id]/
│   │       └── page.tsx          # Shareable result page (public)
│   └── about/
│       └── page.tsx              # About page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageContainer.tsx
│   ├── ui/                       # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx             # RiskBadge
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Accordion.tsx
│   │   ├── Alert.tsx
│   │   ├── CopyButton.tsx
│   │   ├── EmptyState.tsx
│   │   └── Divider.tsx
│   ├── analyzer/                 # Analyzer feature components
│   │   ├── AnalyzerWidget.tsx    # Container + tab state
│   │   ├── TextTab.tsx
│   │   ├── ImageTab.tsx
│   │   ├── URLTab.tsx
│   │   ├── ScenarioTab.tsx
│   │   ├── LoadingState.tsx
│   │   └── ResultCard.tsx        # Full result display
│   ├── result/                   # Result sub-components
│   │   ├── RiskScoreDonut.tsx
│   │   ├── EvidenceSection.tsx
│   │   ├── EvidenceItem.tsx
│   │   ├── RecommendationList.tsx
│   │   ├── NextStepsList.tsx
│   │   └── ResultMetadata.tsx
│   ├── feedback/
│   │   └── FeedbackWidget.tsx
│   └── history/
│       ├── HistoryCard.tsx
│       ├── HistoryFilter.tsx
│       └── HistoryStatsBar.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useTextAnalysis.ts        # React Query mutation
│   ├── useImageAnalysis.ts
│   ├── useURLAnalysis.ts
│   ├── useScenarioAnalysis.ts
│   ├── useHistory.ts             # React Query query
│   ├── useAnalysis.ts            # Single analysis by ID
│   ├── useFeedback.ts
│   ├── useStats.ts
│   ├── useTheme.ts               # dark/light mode
│   └── useHealth.ts
│
├── lib/                          # Utilities and config
│   ├── api.ts                    # Axios instance + typed API functions
│   ├── queryClient.ts            # React Query client config
│   ├── cn.ts                     # clsx + tailwind-merge
│   ├── format.ts                 # formatRiskScore, formatDate, etc.
│   ├── constants.ts              # RISK_LABELS, RISK_COLORS, etc.
│   ├── animations.ts             # Framer Motion variants
│   └── design-tokens.ts          # Color/spacing/timing constants
│
├── types/
│   └── api.ts                    # TypeScript types mirroring Pydantic models
│
└── styles/
    └── globals.css               # CSS variables, keyframes, base styles
```

## 3.2 Backend (`apps/api/src/`)

```
src/
├── main.py                       # FastAPI app, middleware registration, lifespan
├── config.py                     # Pydantic Settings class
├── db/
│   ├── connection.py             # aiosqlite connection factory
│   ├── migrate.py                # migration runner
│   ├── repository.py             # all async CRUD functions
│   └── migrations/
│       ├── 001_initial.sql
│       ├── 002_feedback.sql
│       ├── 003_url_cache.sql
│       └── [future: 004_users.sql, 005_api_keys.sql, 006_patterns.sql]
├── models/
│   └── __init__.py               # all Pydantic request/response models
├── prompts/
│   ├── system_prompt.py          # master system prompt + few-shot examples
│   ├── text_prompt.py
│   ├── image_prompt.py
│   ├── url_prompt.py
│   └── scenario_prompt.py
├── routers/
│   ├── analyze.py
│   ├── history.py
│   ├── feedback.py
│   ├── result.py                 # shareable result (public read-only)
│   └── health.py
└── services/
    ├── ocr.py                    # Tesseract
    ├── url_scanner.py            # URL signal extraction
    ├── llm_analyzer.py           # OpenAI GPT-4o
    └── [future: audio.py, email_parser.py, qr_scanner.py]
```

## 3.3 E2E Tests (`apps/web/e2e/`)

```
e2e/
├── helpers/
│   ├── mock-responses.ts         # MOCK_CRITICAL, MOCK_HIGH, MOCK_SAFE, MOCK_HISTORY
│   ├── AnalyzerPage.ts           # Page Object
│   ├── HistoryPage.ts            # Page Object
│   └── api-mock.ts               # reusable page.route() setup functions
├── fixtures/
│   ├── scam-text.txt
│   ├── safe-text.txt
│   └── scam-screenshot.png
├── navigation.spec.ts
├── text-analysis.spec.ts
├── image-analysis.spec.ts
├── url-analysis.spec.ts
├── scenario-analysis.spec.ts
├── history.spec.ts
├── feedback.spec.ts
├── shareable-result.spec.ts
├── accessibility.spec.ts
├── responsive.spec.ts
├── dark-mode.spec.ts
└── performance.spec.ts
```
