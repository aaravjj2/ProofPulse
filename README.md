# ProofPulse

**Verify before you trust.**

ProofPulse is an AI-powered trust layer that analyzes suspicious messages, screenshots, links, job offers, payment claims, and emails, then explains whether they look safe, deceptive, manipulated, or high-risk.

## Quick Start

### Backend (FastAPI)

```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your OPENAI_API_KEY
uvicorn src.main:app --reload --port 8000
```

### Frontend (Next.js)

```bash
cd apps/web
npm install
cp .env.example .env.local  # Set NEXT_PUBLIC_API_URL
npm run dev
```

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python)
- **OCR:** Tesseract
- **LLM:** OpenAI API
- **Database:** SQLite (MVP)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/analyze/text` | Analyze text messages |
| POST | `/api/v1/analyze/image` | Analyze screenshots via OCR |
| POST | `/api/v1/analyze/url` | Analyze suspicious URLs |
| POST | `/api/v1/analyze/scenario` | Multi-signal scenario analysis |
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/history` | Analysis history |
| POST | `/api/v1/feedback` | Submit feedback |

## License

MIT
