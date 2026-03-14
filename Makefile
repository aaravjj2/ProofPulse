.PHONY: dev build test lint docker-up docker-down

dev:
	npx concurrently "cd apps/api && uvicorn src.main:app --reload --port 8000" "cd apps/web && npm run dev"

build:
	cd apps/web && npm run build

test:
	cd apps/api && python -m pytest tests/ -v --cov=src --cov-report=term-missing
	cd apps/web && npm run lint

test-backend:
	cd apps/api && python -m pytest tests/ -v --cov=src --cov-report=term-missing

test-e2e:
	cd apps/web && npx playwright test

lint:
	cd apps/web && npm run lint

docker-up:
	docker-compose up --build -d

docker-down:
	docker-compose down
