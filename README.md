# ProofPulse

**Verify before you trust.**

ProofPulse is an AI-powered scam detection platform that analyzes suspicious messages, screenshots, and URLs. It provides evidence-based risk scores, clear red flags, and actionable next steps.

## Features

- **Text Analysis** — Paste suspicious messages (SMS, email, chat) for instant scam detection
- **Screenshot Analysis** — Upload images; OCR extracts text for analysis
- **URL Analysis** — Check links for phishing signals (typosquatting, suspicious TLDs, brand impersonation)
- **Evidence-First Results** — Every risk score includes labeled evidence with weights and color-coded flags
- **Demo Scenarios** — 8 built-in examples covering phishing, job scams, payment fraud, impersonation, and more
- **Analysis History** — Browse past analyses with filtering and statistics
- **Feedback System** — Rate analysis accuracy with star ratings and comments

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
| Testing | pytest (102 tests, 83% coverage), Playwright E2E (24 tests) |
| Infrastructure | Docker, docker-compose, GitHub Actions CI |

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
uvicorn src.main:app --reload --port 8000
```

**Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

### Option 3: Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API docs: http://localhost:8000/docs

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
│   │   └── tests/              # 102 pytest tests
│   └── web/                    # Next.js frontend
│       ├── app/                # Pages: /, /analyze, /history, /about
│       ├── components/         # UI components with data-testid
│       ├── lib/                # API client, types, constants
│       └── e2e/                # 24 Playwright E2E tests
├── docker-compose.yml
├── Makefile
└── .github/workflows/ci.yml
```

## Testing

```bash
# Backend unit tests
cd apps/api && python -m pytest tests/ -v --cov=src

# Frontend E2E tests
cd apps/web && npx playwright test

# All tests via Makefile
make test
```

## Risk Levels

| Level | Score Range | Meaning |
|-------|-----------|---------|
| SAFE | 0–15 | No suspicious signals detected |
| LOW | 16–35 | Minor concerns, likely safe |
| MEDIUM | 36–55 | Some suspicious patterns |
| HIGH | 56–80 | Strong scam indicators |
| CRITICAL | 81–100 | Almost certainly a scam |

## License

MIT
