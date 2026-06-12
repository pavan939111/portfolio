install:
	cd frontend && npm install
	cd backend && pip install -r requirements.txt

dev:
	npx concurrently "cd frontend && npm run dev" "cd backend && uvicorn main:app --reload --port 5000"

ingest:
	cd backend && python scripts/ingest.py

build:
	cd frontend && npm run build
