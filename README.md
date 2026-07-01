# HealthCopilot AI

An open-source, locally-running health assistant. Describe your symptoms in plain English, get a differential diagnosis, chat with a medical AI, and extract data from uploaded medical reports — all without sending data to a third-party API.

> **Medical Disclaimer** — This tool is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

---

## What it does

| Feature | Details |
|---|---|
| **Symptom Checker** | Type symptoms in natural language. A local Random Forest model (trained on ~6k samples, 49 diseases) returns a ranked differential diagnosis with confidence scores and specialist recommendations. |
| **AI Chat** | Ask health questions. Answers come from a FAISS semantic search over a curated medical FAQ — no LLM API required. |
| **Report Upload** | Upload a PDF or image of a medical report. Text is extracted via `pdfplumber` (PDF) or `EasyOCR` (images) and summarised locally. |
| **Dark / Light theme** | System-aware with manual override. |

---

## Tech stack

**Backend** — Python 3.12, FastAPI, SQLite (dev), SQLAlchemy (async), JWT auth  
**Frontend** — React 18, TypeScript, Vite, Vanilla CSS  
**ML** — scikit-learn (TF-IDF + Random Forest), sentence-transformers, FAISS, NLTK, pdfplumber, EasyOCR  
**Training data** — [itachi9604/disease-symptom-description-dataset](https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset) + [niyarrbarman/symptom2disease](https://www.kaggle.com/datasets/niyarrbarman/symptom2disease) via Kaggle

---

## Project structure

```
healthcopilot-ai/
├── backend/
│   ├── api/
│   │   ├── deps.py              # FastAPI dependency injection (auth, db session)
│   │   └── routers/
│   │       ├── auth.py          # Login / register / token refresh
│   │       ├── predict.py       # POST /api/v1/predict/
│   │       ├── chat.py          # POST /api/v1/chat/
│   │       └── upload.py        # POST /api/v1/upload/
│   ├── core/
│   │   └── config.py            # Pydantic settings (reads .env)
│   ├── ml/
│   │   ├── trainer.py           # Downloads Kaggle datasets, trains and saves the model
│   │   ├── predictor.py         # Loads model at startup, runs inference
│   │   ├── chat_engine.py       # Sentence-transformer + FAISS medical Q&A
│   │   └── symptom_normalizer.py# Maps natural language to training vocabulary
│   ├── models/                  # SQLModel table definitions
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── services/
│   │   └── ocr_service.py       # PDF and image text extraction
│   ├── scripts/
│   │   └── train.py             # One-shot training entrypoint (run once)
│   ├── main.py                  # App factory, lifespan (DB init + model load)
│   ├── database.py              # Async SQLAlchemy engine
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   └── src/
│       ├── pages/               # SymptomChecker, AIConsult, MedicalReports, Dashboard, Auth
│       ├── components/
│       │   ├── Layout.tsx        # Sidebar + nav shell
│       │   └── ui/              # Button, Input, Toast, ThemeToggle
│       ├── context/
│       │   └── ThemeContext.tsx  # Dark/light theme provider
│       ├── App.tsx
│       └── index.css            # CSS custom properties design system
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── datasets/           # Auto-downloaded by train.py, not committed
├── trained_models/     # Saved .pkl files, not committed
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Getting started

### Requirements

- Python 3.12+
- Node.js 18+
- A free [Kaggle account](https://www.kaggle.com/settings) (needed once for training data download)

### 1. Clone

```bash
git clone https://github.com/ashutoshpatraa/healthcopilot-ai.git
cd healthcopilot-ai
```

### 2. Backend

```bash
cd backend

python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
# Edit .env — add your KAGGLE_USERNAME and KAGGLE_KEY
```

### 3. Train the model

You only need to do this once. It downloads two Kaggle datasets and trains the classifier (~30 seconds).

```bash
python scripts/train.py
```

```
Training Complete!
  Diseases:   49
  Accuracy:   99.56%
  Model:      trained_models/symptom_classifier.pkl
```

### 4. Run the backend

```bash
uvicorn main:app --reload
# http://localhost:8000
# http://localhost:8000/docs  (interactive API docs)
```

### 5. Run the frontend

```bash
cd ../frontend
npm install
npm run dev
# http://localhost:5173
```

---

## Environment variables

Copy `backend/.env.example` to `backend/.env` and fill in the values.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRET_KEY` | Yes | — | JWT signing secret. Generate with `python -c "import secrets; print(secrets.token_hex(32))"` |
| `DATABASE_URL` | No | `sqlite+aiosqlite:///./healthcopilot.db` | Swap for PostgreSQL in production |
| `KAGGLE_USERNAME` | Training only | — | Your Kaggle username |
| `KAGGLE_KEY` | Training only | — | Your Kaggle API key (from kaggle.com/settings → API) |
| `API_V1_STR` | No | `/api/v1` | API route prefix |

---

## API

Base URL: `http://localhost:8000/api/v1`

All endpoints accept and return JSON. See `http://localhost:8000/docs` for the interactive Swagger UI.

### `POST /predict/`

```json
// Request
{ "symptoms": "fever headache runny nose sore throat" }

// Response
{
  "disease": "Common Cold",
  "confidence": 0.72,
  "specialist": "General Physician",
  "differentials": [
    { "disease": "Influenza", "confidence": 0.15 },
    { "disease": "Allergy",   "confidence": 0.08 }
  ],
  "model": "local_rf_v1"
}
```

### `POST /chat/`

```json
// Request
{ "message": "What are the symptoms of diabetes?" }

// Response
{ "response": "Common symptoms include frequent urination, excessive thirst..." }
```

### `POST /upload/`

Multipart form upload. Field name: `file`. Accepted types: PDF, JPG, PNG.

```json
// Response
{
  "extracted_text": "...",
  "summary": "Document contains: CBC. Found 2 flagged values.",
  "method": "pdfplumber"
}
```

### `GET /health`

```json
{
  "status": "ok",
  "symptom_model": { "loaded": true, "n_classes": 49, "accuracy": 0.9956 },
  "chat_engine":   { "loaded": true }
}
```

---

## Symptom input tips

The model was trained on structured medical terms (`continuous_sneezing`, `high_fever`, etc.), but a normalizer layer translates plain English before inference. More symptoms = higher confidence. Some examples:

| Input | Interpreted as |
|---|---|
| `runny nose, sore throat, mild fever` | `runny_nose continuous_sneezing throat_irritation high_fever chills` |
| `chest pain, arm pain, sweating` | `chest_pain sweating` → Heart attack |
| `loose motion, stomach ache, vomiting` | `diarrhoea stomach_pain vomiting` → Gastroenteritis |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, coding standards, and the PR process.

Short version: fork → branch → commit (using [Conventional Commits](https://www.conventionalcommits.org/)) → PR.

---

## Roadmap

- [ ] Persistent user history (save predictions to account)
- [ ] More diseases and symptom coverage in the classifier
- [ ] Hindi and Spanish language support
- [ ] Docker Compose setup for one-command deployment
- [ ] Fine-tuned small LLM for the chat engine

---

## License

[MIT](LICENSE) — Ashutosh Patra, 2026
