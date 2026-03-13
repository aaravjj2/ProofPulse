# ProofPulse Build Blueprint

**Tagline:** Verify before you trust.

**One-line pitch:** ProofPulse is an AI-powered trust layer that analyzes suspicious messages, screenshots, links, job offers, payment claims, and emails, then explains whether they look safe, deceptive, manipulated, or high-risk.

**Goal:** Ship a polished, demo-ready MVP that feels trustworthy, explainable, and fast, with a clear path to a scalable platform.

**Product Promise:** Evidence-first risk analysis with practical next steps, not just a black-box score.

**Target Users:** Students, marketplace users, general consumers, families/older adults.

**Primary Use Case for MVP Demo:** Phishing text + fake recruiter message + fake payment screenshot.

---

**Exact Feature Checklist**

- [ ] Text input analysis for emails, chats, and SMS
- [ ] Screenshot/image upload with OCR text extraction
- [ ] URL input analysis with domain and pattern checks
- [ ] Risk score output (0–100) with bucket label
- [ ] Threat category classification
- [ ] Top red flags list (3–8 items)
- [ ] Evidence-based explanation paragraph
- [ ] Recommended next steps checklist
- [ ] Confidence level indicator
- [ ] Safe reply generator (optional in MVP)
- [ ] Highlighted suspicious phrases in extracted text
- [ ] Simple trust meter visualization
- [ ] Demo sample inputs (6–10 curated scenarios)
- [ ] Fast loading state and clear error states
- [ ] Mobile-responsive layout
- [ ] History view of last 10 analyses (optional MVP)
- [ ] Basic analytics event logging (page view, analysis submitted, analysis completed)

---

**Folder Structure**

- `apps/`
- `apps/web/`
- `apps/web/app/`
- `apps/web/components/`
- `apps/web/lib/`
- `apps/web/public/`
- `apps/web/styles/`
- `apps/api/`
- `apps/api/src/`
- `apps/api/src/routes/`
- `apps/api/src/services/`
- `apps/api/src/services/ocr/`
- `apps/api/src/services/heuristics/`
- `apps/api/src/services/url_analysis/`
- `apps/api/src/services/llm/`
- `apps/api/src/services/scoring/`
- `apps/api/src/services/response_builder/`
- `apps/api/src/types/`
- `apps/api/src/utils/`
- `apps/api/tests/`
- `packages/`
- `packages/shared/`
- `packages/shared/src/`
- `packages/shared/src/schemas/`
- `packages/shared/src/constants/`
- `packages/shared/src/types/`
- `infra/`
- `infra/vercel/`
- `infra/render/`
- `docs/`
- `docs/demo/`
- `docs/devpost/`
- `docs/security/`

---

**Tech Stack Choices**

- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: FastAPI (Python) or Express (Node). Recommendation: FastAPI for OCR pipeline and easier Python ML/OCR tooling.
- OCR: Tesseract locally for MVP, optional Google Vision for higher accuracy later
- LLM: OpenAI API for classification and explanation
- Data: SQLite for MVP history, PostgreSQL for production
- Hosting: Vercel for web, Render or Fly.io for API
- Storage: S3-compatible object storage for image uploads
- Observability: PostHog or Plausible for analytics, Sentry for errors

---

**API Design**

Base URL: `/api/v1`

**POST `/analyze/text`**

- Request JSON:

```json
{
  "text": "string",
  "source": "email|sms|chat|other",
  "locale": "en-US"
}
```

- Response JSON:

```json
{
  "risk_score": 82,
  "risk_label": "high",
  "category": "phishing",
  "confidence": 0.87,
  "flags": ["urgent threat framing", "credential request", "domain mismatch"],
  "evidence": [
    {"type": "phrase", "value": "verify now", "reason": "urgent action"},
    {"type": "pattern", "value": "credential_request", "reason": "asks for login"}
  ],
  "explanation": "This message pressures immediate action and requests credentials, which is typical of phishing.",
  "next_steps": ["Do not click the link", "Open your bank app directly", "Call official support"],
  "safe_reply": "I will verify this through the official channel before proceeding.",
  "normalized_text": "..."
}
```

**POST `/analyze/image`**

- Request: `multipart/form-data` with fields `image` (file), `source` (string), `locale` (string)
- Response: same as `/analyze/text` plus `ocr_text` and `ocr_confidence`

**POST `/analyze/url`**

- Request JSON:

```json
{
  "url": "string",
  "context": "banking|marketplace|login|other"
}
```

- Response JSON:

```json
{
  "risk_score": 76,
  "risk_label": "high",
  "category": "phishing",
  "confidence": 0.81,
  "flags": ["typosquatting", "odd tld", "suspicious subdomain"],
  "evidence": [
    {"type": "domain", "value": "secure-bankverify-login.net", "reason": "brand mismatch"}
  ],
  "explanation": "The domain looks like an imitation of a bank domain and uses a suspicious TLD.",
  "next_steps": ["Do not visit the link", "Open the official site directly"]
}
```

**POST `/analyze/scenario`**

- Request JSON:

```json
{
  "scenario": "job_scam|payment_scam|phishing|impersonation|misinformation",
  "text": "string",
  "url": "string",
  "image_id": "string"
}
```

- Response JSON: same as `/analyze/text`

**GET `/health`**

- Response JSON: `{ "status": "ok" }`

**GET `/history`**

- Response JSON: list of recent analyses with timestamps, input type, category, risk score

**POST `/feedback`**

- Request JSON:

```json
{
  "analysis_id": "string",
  "rating": "accurate|inaccurate|unsure",
  "note": "string"
}
```

---

**Homepage Copy**

Hero headline: ProofPulse — Verify before you trust.

Hero subcopy: Analyze suspicious messages, screenshots, and links in seconds. Get evidence-based risk scores, clear red flags, and safe next steps.

Primary CTA: Check a message

Secondary CTA: Try a demo sample

Value bullets:
- Evidence-first scam analysis, not black-box guesses
- Works on text, screenshots, and links
- Clear guidance you can act on immediately

Social proof line: Built for students, marketplace sellers, and everyday users who deal with risky messages.

How it works section:
- Paste text, upload an image, or submit a link
- We analyze language, URLs, and signals for scam patterns
- You get a risk score, red flags, and what to do next

Demo section header: See ProofPulse catch scams in real time

Demo cards copy:
- “Bank account locked” phishing text
- “Instant internship offer” recruiter message
- “Payment pending” screenshot

Trust section header: Explainable results you can verify

Trust copy: Every alert includes the exact evidence and reasoning behind the risk score.

Footer line: Don’t click, pay, or reply until you check.

---

**Devpost Writeup**

Title: ProofPulse — AI Scam Detection for Messages, Screenshots, and Links

Subtitle: A real-time trust layer that helps people verify suspicious digital content before they act.

Problem: Scams succeed because they look real, create urgency, and exploit trust. Most tools do not explain social engineering or handle screenshots and chat messages.

Solution: ProofPulse analyzes text, screenshots, and links using OCR, heuristic scoring, URL pattern checks, and AI explanations. It returns a clear risk score, evidence-based red flags, and safe next steps.

Features:
- Screenshot OCR analysis
- Scam language detection
- URL risk analysis
- Risk scoring with explainable evidence
- Safe next-step guidance and optional safe reply

Tech stack: Next.js, TypeScript, Tailwind CSS, FastAPI, Tesseract OCR, OpenAI API, PostgreSQL, Vercel, Render

Challenges: Balancing rules with AI explanation, extracting useful signals from screenshots, and keeping outputs understandable.

Accomplishments: Multimodal scam analysis, explainable scoring, and a polished demo-ready UI.

What’s next: Browser extension, email and marketplace integrations, multilingual support, and enterprise anti-fraud dashboards.

Hardest part (ThunderHacks): Combining OCR, heuristic detection, and AI reasoning into one coherent, explainable trust score without a black box.

---

**MVP Success Criteria**

- 3 demo scenarios completed end-to-end in under 5 seconds each
- Risk score and flags match human expectation for at least 8 of 10 sample cases
- Users can explain the result in their own words after reading the output
- Demo video is 2–3 minutes with clear problem, live demo, and architecture

