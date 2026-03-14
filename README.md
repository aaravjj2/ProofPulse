# ProofPulse

**Verify before you trust.**

[![CI](https://github.com/aaravjj2/ProofPulse/actions/workflows/ci.yml/badge.svg)](https://github.com/aaravjj2/ProofPulse/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![Tests](https://img.shields.io/badge/Backend%20Tests-102%20passed-22c55e)](apps/api/tests/)
[![E2E](https://img.shields.io/badge/E2E%20Tests-36%20passed-22c55e)](apps/web/e2e/)
[![License](https://img.shields.io/badge/License-MIT-6b7280)](LICENSE)

ProofPulse is an AI-powered scam detection platform that analyzes suspicious messages, screenshots, and URLs. It provides evidence-based risk scores, color-coded red flags, and actionable next steps — with full dark mode support and accessibility-first design.

---

## Features

- **Text Analysis** — Paste suspicious messages (SMS, email, chat) for instant scam detection
- **Screenshot Analysis** — Upload images; OCR extracts text for analysis
- **URL Analysis** — Check links for phishing signals (typosquatting, suspicious TLDs, brand impersonation)
- **Evidence-First Results** — Every risk score includes labeled evidence with weights and color-coded flags
- **Dark Mode** — System preference detection + localStorage persistence, toggle in navbar
- **Copy Report** — One-click clipboard copy of the full analysis report
- **Demo Scenarios** — 8 built-in examples covering phishing, job scams, payment fraud, and more
- **Analysis History** — Browse past analyses with filtering, pagination, and CSV export
- **Feedback System** — Rate analysis accuracy with star ratings and comments
- **Accessible** — WCAG 2.0 AA compliant, keyboard navigable, reduced-motion support

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js 16 (App Router)  ·  Tailwind CSS 4         │   │
│  │  React Query  ·  Framer Motion  ·  Radix UI         │   │
│  └───────────────────────┬─────────────────────────────┘   │
└──────────────────────────│──────────────────────────────────┘
                           │ HTTP (REST)
┌──────────────────────────▼──────────────────────────────────┐
│                   FastAPI (Python 3.10+)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  /analyze/*  │  │  /history/*  │  │  /feedback       │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │             │
│  ┌──────▼───────┐  ┌──────▼───────┐           │             │
│  │ LLM Analyzer │  │  Repository  │◄──────────┘             │
│  │  (GPT-4o)    │  │  (SQLite)    │                         │
│  └──────┬───────┘  └──────────────┘                         │
│         │                                                    │
│  ┌──────▼───────┐  ┌──────────────┐                         │
│  │ URL Scanner  │  │  OCR Service │                         │
│  │  (heuristic) │  │ (Tesseract)  │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| UI | Radix UI Tabs, Framer Motion, Lucide Icons |
| Data Fetching | React Query (@tanstack/react-query) |
| Backend | FastAPI, Python 3.10+, Pydantic v2 |
| LLM | OpenAI API (GPT-4o) with heuristic fallback |
| OCR | Tesseract |
| Database | SQLite with aiosqlite (async) |
| Testing | pytest (102 tests, 83% coverage), Playwright E2E (36 tests) |
| Infrastructure | Docker, docker-compose, GitHub Actions CI |
| Deployment | Railway (API), Vercel (frontend) |

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- Tesseract OCR (`sudo apt install tesseract-ocr`)

### Option 1: Makefile (recommended)

```bash
# Copy environment files
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local

# Edit apps/api/.env and set OPENAI_API_KEY (optional — fallback heuristics work without it)

# Start both services
make dev
```

### Option 2: Manual Setup

**Backend:**
```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../../.env.example .env  # Set OPENAI_API_KEY
python -m uvicorn src.main:app --reload --port 8000
```

**Frontend:**
```bash
cd apps/web
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

### Option 3: Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

## Deployment

### Backend — Railway

The `apps/api/railway.json` config is included. Set these environment variables in Railway:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `PORT` | Auto-set by Railway |

### Frontend — Vercel

Import the repo in Vercel, set root to `apps/web`, and add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Your Railway backend URL |

The `apps/web/vercel.json` includes security headers (X-Frame-Options, CSP, etc.).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/analyze/text` | Analyze text messages |
| POST | `/api/v1/analyze/image` | Analyze screenshots via OCR |
| POST | `/api/v1/analyze/url` | Analyze suspicious URLs |
| POST | `/api/v1/analyze/scenario` | Multi-signal scenario analysis |
| GET | `/api/v1/history` | Paginated analysis history |
| GET | `/api/v1/history/stats` | Aggregate statistics |
| GET | `/api/v1/history/{id}` | Single analysis by ID |
| POST | `/api/v1/feedback` | Submit feedback on analysis |
| GET | `/api/v1/health` | Health check (DB + OpenAI status) |

## Project Structure

```
ProofPulse/
├── apps/
│   ├── api/                    # FastAPI backend
│   │   ├── src/
│   │   │   ├── config.py       # Pydantic Settings
│   │   │   ├── main.py         # App entrypoint
│   │   │   ├── db/             # SQLite connection, migrations, repository
│   │   │   ├── models/         # Pydantic v2 models
│   │   │   ├── prompts/        # LLM system prompt & templates
│   │   │   ├── routers/        # API route handlers
│   │   │   └── services/       # LLM analyzer, URL scanner, OCR
│   │   ├── railway.json        # Railway deployment config
│   │   ├── Procfile            # Heroku-compatible start command
│   │   └── tests/              # 102 pytest tests (83% coverage)
│   └── web/                    # Next.js frontend
│       ├── app/                # Pages: /, /analyze, /history, /about
│       ├── components/         # UI components with data-testid
│       ├── lib/
│       │   ├── hooks/          # useTheme (dark mode)
│       │   ├── api.ts          # API client
│       │   ├── types.ts        # Shared TypeScript types
│       │   └── constants.ts    # Demo scenarios, limits
│       ├── vercel.json         # Vercel deployment + security headers
│       └── e2e/                # 36 Playwright E2E tests
│           ├── helpers/        # Mock API responses
│           ├── text-analysis.spec.ts
│           ├── url-analysis.spec.ts
│           ├── scenario-analysis.spec.ts
│           └── accessibility.spec.ts
├── docker-compose.yml
├── Makefile
└── .github/workflows/ci.yml
```

## Testing

```bash
# Backend unit + integration tests
cd apps/api && python -m pytest tests/ -v --cov=src

# Frontend E2E tests (starts servers automatically)
cd apps/web && npx playwright test

# All tests via Makefile
make test
```

### Test Coverage

| Suite | Count | Coverage |
|-------|-------|----------|
| Backend (pytest) | 102 tests | 83% |
| E2E — text / URL analysis | 18 tests | — |
| E2E — scenario analysis | 12 tests | — |
| E2E — accessibility (axe-core) | 6 tests | — |

## Risk Levels

| Level | Score Range | Meaning |
|-------|-----------|---------|
| Safe | 0–15 | No suspicious signals detected |
| Low Risk | 16–35 | Minor concerns, likely safe |
| Medium Risk | 36–55 | Some suspicious patterns |
| High Risk | 56–80 | Strong scam indicators |
| Critical Risk | 81–100 | Almost certainly a scam |

## License

MIT
