<div align="center">

<img src="https://img.shields.io/badge/HealthCopilot-AI-00E5FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0xIDE1aC0ydi0yaDJ2MnptMC00aC0yVjdoMnY2eiIvPjwvc3ZnPg==" alt="HealthCopilot AI">

# HealthCopilot AI

### AI-Powered Medical Symptom Checker & Health Assistant

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)](https://python.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6-F7931E?style=flat-square&logo=scikit-learn)](https://scikit-learn.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**[Live Demo](http://localhost:5173) · [Report Bug](https://github.com/ashutoshpatraa/healthcopilot-ai/issues) · [Request Feature](https://github.com/ashutoshpatraa/healthcopilot-ai/issues) · [Contributing](CONTRIBUTING.md)**

</div>

---

## 📖 Overview

**HealthCopilot AI** is a full-stack, open-source health assistant that runs a **local AI model** for symptom-to-disease classification — no cloud API keys needed. It combines a brutalist-inspired React UI with a FastAPI backend and a trained Random Forest classifier (99.56% accuracy on the test set).

> ⚠️ **Medical Disclaimer**: HealthCopilot AI is for **informational and educational purposes only**. It is not a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified healthcare provider.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Local AI Symptom Checker** | TF-IDF + Random Forest trained on 6,120 samples across 49 diseases |
| 💬 **AI Medical Chat** | Semantic Q&A powered by `all-MiniLM-L6-v2` + FAISS vector search |
| 📄 **Medical Report OCR** | Upload PDFs or images — extracts text via pdfplumber & EasyOCR |
| 🌡️ **Differential Diagnoses** | Shows top-3 ranked conditions with confidence scores |
| 👨‍⚕️ **Specialist Routing** | Recommends the right specialist (Cardiologist, Neurologist, etc.) |
| 🌙 **Dark / Light Theme** | Full system-aware theme with manual toggle |
| 📱 **Fully Responsive** | Mobile-first design, works on all screen sizes |
| 🔒 **Auth System** | JWT-based authentication with secure token handling |
| 📊 **Health Dashboard** | Overview of predictions, chat history, and uploaded reports |

---

## 🏗️ Architecture

```
healthcopilot-ai/
├── backend/                  # FastAPI Python backend
│   ├── api/
│   │   └── routers/          # auth, predict, chat, upload
│   ├── core/
│   │   └── config.py         # Pydantic settings (reads .env)
│   ├── ml/
│   │   ├── trainer.py        # Kaggle dataset download + model training
│   │   ├── predictor.py      # Inference engine (TF-IDF + Random Forest)
│   │   ├── chat_engine.py    # Semantic chat (sentence-transformers + FAISS)
│   │   └── symptom_normalizer.py  # Natural language → medical vocabulary
│   ├── services/
│   │   └── ocr_service.py    # PDF + image OCR (pdfplumber + EasyOCR)
│   ├── models/               # SQLModel database models
│   ├── scripts/
│   │   └── train.py          # One-shot model training script
│   ├── main.py               # FastAPI app entry point
│   └── requirements.txt
│
├── frontend/                 # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── pages/            # SymptomChecker, AIConsult, MedicalReports, etc.
│   │   ├── components/       # Reusable UI components (Button, Input, Toast…)
│   │   ├── context/          # ThemeContext
│   │   └── index.css         # Design system (CSS variables + custom utilities)
│   └── package.json
│
├── datasets/                 # Kaggle datasets (auto-downloaded, git-ignored)
└── trained_models/           # Saved model artifacts (git-ignored)
```

---

## 🤖 AI / ML Stack

| Component | Technology | Details |
|---|---|---|
| **Symptom Classifier** | scikit-learn | TF-IDF (ngram 1–2, 8k features) + Random Forest (200 trees) |
| **Training Data** | Kaggle | `itachi9604/disease-symptom-description-dataset` (4,920 rows) + `niyarrbarman/symptom2disease` (1,200 rows) |
| **Accuracy** | 99.56% | On 15% held-out test set |
| **Chat Engine** | sentence-transformers + FAISS | `all-MiniLM-L6-v2` semantic search over medical FAQ KB |
| **OCR** | pdfplumber + EasyOCR | PDF text extraction + image OCR |
| **NLP** | NLTK | Tokenization, stopwords, text preprocessing |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- A [Kaggle account](https://www.kaggle.com/) (free) — for downloading training datasets

### 1. Clone the repository

```bash
git clone https://github.com/ashutoshpatraa/healthcopilot-ai.git
cd healthcopilot-ai
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `backend/.env`:

```env
PROJECT_NAME="HealthCopilot AI"
API_V1_STR="/api/v1"
SECRET_KEY="your-secret-key-change-this"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# Database
DATABASE_URL="sqlite+aiosqlite:///./healthcopilot.db"

# Kaggle credentials (get from https://www.kaggle.com/settings → API)
KAGGLE_USERNAME="your_kaggle_username"
KAGGLE_KEY="your_kaggle_api_key"
```

### 4. Train the AI model

```bash
# Downloads datasets from Kaggle and trains the classifier (~30 seconds)
python scripts/train.py
```

Expected output:
```
Training Complete!
  Diseases:   49
  Accuracy:   99.56%
  Model saved: trained_models/symptom_classifier.pkl
```

### 5. Start the backend

```bash
uvicorn main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 6. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
# App available at http://localhost:5173
```

---

## 📡 API Reference

Base URL: `http://localhost:8000/api/v1`

### Symptom Prediction

```http
POST /predict/
Content-Type: application/json

{
  "symptoms": "cough fever runny nose sore throat"
}
```

**Response:**
```json
{
  "disease": "Common Cold",
  "confidence": 0.72,
  "specialist": "General Physician",
  "differentials": [
    { "disease": "Influenza", "confidence": 0.15 },
    { "disease": "Bronchial Asthma", "confidence": 0.08 }
  ],
  "model": "local_rf_v1"
}
```

### AI Chat

```http
POST /chat/
Content-Type: application/json

{
  "message": "What are the symptoms of diabetes?"
}
```

**Response:**
```json
{
  "response": "Common symptoms of diabetes include frequent urination..."
}
```

### Medical Report OCR

```http
POST /upload/
Content-Type: multipart/form-data

file: <PDF, JPG, or PNG>
```

**Response:**
```json
{
  "extracted_text": "...",
  "summary": "Document contains: Complete Blood Count. Found 2 potentially flagged values.",
  "method": "pdfplumber"
}
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "symptom_model": { "loaded": true, "n_classes": 49, "accuracy": 0.9956 },
  "chat_engine": { "loaded": true }
}
```

---

## 🧪 Symptom Input Tips

The AI understands **natural language** — you can describe symptoms conversationally:

| You type | AI understands |
|---|---|
| "water from nose, sour neck" | `runny_nose continuous_sneezing congestion throat_irritation` |
| "chest pain arm pain sweating" | `chest_pain sweating` |
| "loose motion, stomach ache" | `diarrhoea stomach_pain` |

**Better accuracy tips:**
- Add more symptoms for higher confidence
- Include duration ("for 3 days"), severity ("severe"), and modifiers ("worse at night")
- Use the **Quick Select** buttons to add common symptoms fast

---

## 🛠️ Development

### Running Tests

```bash
# Backend
cd backend
python -m pytest

# Frontend
cd frontend
npm test
```

### Retraining the Model

```bash
cd backend
python scripts/train.py
# Then restart uvicorn
```

### Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `PROJECT_NAME` | `HealthCopilot AI` | API title |
| `API_V1_STR` | `/api/v1` | API route prefix |
| `SECRET_KEY` | *(required)* | JWT signing secret |
| `DATABASE_URL` | `sqlite+aiosqlite:///./healthcopilot.db` | Database URL |
| `KAGGLE_USERNAME` | *(required for training)* | Kaggle username |
| `KAGGLE_KEY` | *(required for training)* | Kaggle API key |

---

## 🗺️ Roadmap

- [ ] **v1.1** — Patient history persistence (save predictions to profile)
- [ ] **v1.2** — Multi-language support (Hindi, Spanish, French)
- [ ] **v1.3** — Drug interaction checker
- [ ] **v2.0** — Fine-tuned LLM for richer conversational diagnosis
- [ ] **v2.1** — Wearable device data integration (heart rate, SpO2)
- [ ] **v2.2** — Telemedicine appointment booking integration

---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

Quick steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📦 Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite 8
- React Router v6
- Vanilla CSS (custom design system)

**Backend**
- FastAPI 0.115
- SQLModel + SQLAlchemy (async)
- SQLite (dev) / PostgreSQL (prod)
- Pydantic v2
- JWT authentication

**AI / ML**
- scikit-learn (Random Forest classifier)
- NLTK (text processing)
- sentence-transformers (semantic embeddings)
- FAISS (vector similarity search)
- pdfplumber (PDF extraction)
- EasyOCR (image OCR)
- Kaggle API (dataset download)

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## 👏 Acknowledgements

- [Kaggle — Disease Symptom Dataset](https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset) by itachi9604
- [Kaggle — Symptom2Disease Dataset](https://www.kaggle.com/datasets/niyarrbarman/symptom2disease) by niyarrbarman
- [sentence-transformers](https://www.sbert.net/) — `all-MiniLM-L6-v2`
- [FastAPI](https://fastapi.tiangolo.com/) by Sebastián Ramírez
- [scikit-learn](https://scikit-learn.org/) — The Machine Learning team

---

<div align="center">
Made with ❤️ by <a href="https://github.com/ashutoshpatraa">Ashutosh Patra</a>
<br><br>
<a href="https://github.com/ashutoshpatraa/healthcopilot-ai/stargazers">⭐ Star this project if it helped you!</a>
</div>
