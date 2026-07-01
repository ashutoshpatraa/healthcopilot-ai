# HealthCopilot AI

HealthCopilot AI is an AI healthcare copilot scaffold built around a FastAPI backend, a React 19 frontend, PostgreSQL, and Docker Compose.

## What is included

- FastAPI API with auth, prediction, chat, upload, history, dashboard, admin, and analytics endpoints
- SQLAlchemy models for the core healthcare entities
- Dataset setup script that tries `kagglehub` first and falls back to the Kaggle CLI
- React/Vite frontend with landing, dashboard, symptom checker, assistant, and profile views
- Docker Compose orchestration for PostgreSQL, Redis, backend, and frontend
- GitHub Actions CI workflow for backend tests and frontend build

## Local setup

1. Copy `.env.example` to `.env` and adjust the database values if needed.
2. Install backend dependencies from `backend/requirements.txt`.
3. Install frontend dependencies from `frontend/package.json`.
4. Run `docker compose up --build` from the repository root.

## API

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/profile`
- `PUT /api/profile`
- `POST /api/predict`
- `POST /api/upload`
- `POST /api/chat`
- `GET /api/history`
- `GET /api/dashboard`
- `GET /api/admin`
- `GET /api/analytics`

## Notes

The repository now contains a working foundation rather than the full production product described in the master prompt. The backend and frontend are wired so the next pass can add the remaining enterprise features on top of a real structure instead of a blank starter.
# healthcopilot-ai
An enterprise-grade AI healthcare copilot built with FastAPI, React, PostgreSQL, and machine learning. Features symptom analysis, disease prediction, medical report OCR, conversational AI, analytics dashboards, secure authentication, and a scalable microservice-ready architecture.
