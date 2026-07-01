# HealthCopilot AI

HealthCopilot AI is a production-grade AI healthcare copilot built with modern AI, Machine Learning, NLP, OCR, and cloud-native technologies. 

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: FastAPI, SQLite (aiosqlite)
- **Architecture**: Brutalist UI/UX design matching exact specifications for medical software.

## Features
- Secure AI-driven Authentication
- Patient Dashboard & Vitals Tracking
- OCR & Medical Records Parsing
- AI Consult Module
- Predictive Symptom Checker
- Analytics Dashboard

## Getting Started

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## UI/UX Rules
This project follows a strict brutalist design utilizing Inter, JetBrains Mono, and Space Grotesk fonts along with high-contrast UI variables defined in Tailwind configuration.
