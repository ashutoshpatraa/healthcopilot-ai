# Architecture

HealthCopilot AI is organized as a monorepo with a FastAPI backend, a React/Vite frontend, PostgreSQL persistence, Redis for background work, and Docker-based local orchestration.

The backend exposes the `/api` surface for authentication, symptom prediction, chat, report uploads, profile management, dashboard metrics, and analytics summaries. The frontend consumes those endpoints through a small API client and provides the landing experience plus the primary product surfaces.
