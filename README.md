# HealthCopilot AI

![HealthCopilot AI Banner](https://via.placeholder.com/1200x400?text=HealthCopilot+AI+-+Production+Grade+Healthcare+Copilot)

![Python](https://img.shields.io/badge/Python-3.12-blue.svg) ![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg) ![React](https://img.shields.io/badge/React-19-61DAFB.svg) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57.svg)

HealthCopilot AI is a production-grade AI healthcare platform built with modern AI, Machine Learning, NLP, and OCR. It is designed to simulate a real-world healthcare workflow, serving as a comprehensive portfolio piece for Full Stack and AI/ML Engineering.

---

## 🏗️ Architecture

HealthCopilot AI follows a Clean Architecture pattern, split into specialized layers for high maintainability:

1. **Frontend**: React 19 + TypeScript + Vite, using a "Clinical Brutalist" design system powered by TailwindCSS and shadcn/ui.
2. **Backend**: Asynchronous FastAPI server utilizing `aiosqlite` for lightweight, localized database interactions.
3. **Machine Learning Pipeline**: Custom preprocessing scripts and inference wrappers integrating `Scikit-learn`, `XGBoost`, `Transformers`, and `EasyOCR`.

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 20+
- (Optional) Kaggle API credentials (`kaggle.json`)

### 1. Clone the Repository
```bash
git clone https://github.com/ashutoshpatraa/healthcopilot-ai.git
cd healthcopilot-ai
```

### 2. Backend Setup
The backend runs on a lightweight SQLite database for easy local execution.
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn core.main:app --reload
```
The API documentation will be available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🗄️ Database Schema

The SQLite database consists of the following primary tables:
- **`users`**: Authentication credentials and basic info.
- **`profiles`**: Patient medical history and physical details.
- **`predictions`**: Log of symptoms and AI-predicted diseases.
- **`reports`**: Uploaded medical reports and OCR summaries.
- **`chat_messages`**: Conversational history with the AI Assistant.

---

## 🧠 ML Pipeline & Dataset Setup

The system relies on 5 core Kaggle datasets for disease prediction and symptom mapping. 

### Kaggle Setup
Ensure you have your `kaggle.json` configured. If not, `kagglehub` will attempt to prompt or you can manually download the datasets.

### Downloading Datasets
```bash
python scripts/setup_datasets.py
```
This script downloads:
1. Disease Prediction Using Machine Learning
2. Symptom2Disease
3. Disease Symptom Description Dataset
4. Healthcare Symptoms Disease Classification Dataset
5. Disease and Symptoms Dataset

### Training Models
```bash
python scripts/train_models.py
```
This will train models like Random Forest, XGBoost, and LightGBM, saving the `best_model.pkl` to `trained_models/`.

---

## 🛡️ Security
- **JWT Authentication**: Short-lived access tokens.
- **Password Hashing**: Secure `bcrypt` hashing for all passwords.
- **Role-Based Access Control**: Simple user/superuser boolean flags.

---

## 📁 Folder Structure

```
healthcopilot-ai/
├── backend/            # FastAPI, SQLAlchemy, Pydantic
├── frontend/           # React 19, Tailwind CSS, Vite
├── datasets/           # Raw and processed Kaggle datasets
├── trained_models/     # Pickled ML models and encoders
├── scripts/            # Dataset setup and model training scripts
├── docs/               # Architecture diagrams and specifications
└── README.md           # Project documentation
```

---

## 🔮 Future Roadmap
- Integration with external Electronic Health Record (EHR) APIs.
- Advanced RAG (Retrieval-Augmented Generation) for more accurate medical chatbot responses.
- Cloud deployment configurations for AWS/GCP.
- Support for complex multi-page PDF medical reports.
