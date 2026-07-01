# Contributing to HealthCopilot AI

First off — **thank you** for taking the time to contribute! 🎉

HealthCopilot AI is an open-source project and we welcome contributions of all kinds: bug fixes, new features, documentation improvements, UI polish, and more.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Areas We Need Help With](#areas-we-need-help-with)

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating you agree to abide by its terms.

In short: **be kind, be respectful, be constructive**.

---

## 🤝 How to Contribute

### 1. Find something to work on

- Browse [open issues](https://github.com/ashutoshpatraa/healthcopilot-ai/issues) labelled `good first issue` or `help wanted`
- Check the [Roadmap](README.md#roadmap) for planned features
- Suggest your own improvement by opening an issue first

### 2. Fork & clone

```bash
git clone https://github.com/<your-username>/healthcopilot-ai.git
cd healthcopilot-ai
```

### 3. Create a branch

Use a descriptive branch name:

```bash
git checkout -b feat/symptom-autocomplete
git checkout -b fix/prediction-low-confidence
git checkout -b docs/api-reference
git checkout -b refactor/ocr-service
```

### 4. Make your changes

Follow the [Coding Standards](#coding-standards) below.

### 5. Test your changes

```bash
# Backend
cd backend
.venv\Scripts\activate   # Windows
source .venv/bin/activate # macOS/Linux
python -m pytest

# Frontend
cd frontend
npm test
```

### 6. Commit using Conventional Commits

```bash
git commit -m "feat: add symptom autocomplete dropdown"
git commit -m "fix: correct low-confidence warning threshold"
git commit -m "docs: update API reference for /predict endpoint"
```

### 7. Push and open a PR

```bash
git push origin feat/symptom-autocomplete
```

Then open a Pull Request against `main` on GitHub.

---

## 🛠️ Development Setup

### Prerequisites

| Tool | Version |
|---|---|
| Python | 3.12+ |
| Node.js | 18+ |
| Git | latest |

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt

# Copy env file
cp .env.example .env
# Fill in your KAGGLE_USERNAME and KAGGLE_KEY

# Train the model (first-time setup, ~30s)
python scripts/train.py

# Start dev server
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Verify everything works

```bash
# Check API health
curl http://localhost:8000/health

# Test a prediction
curl -X POST http://localhost:8000/api/v1/predict/ \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "fever headache runny nose sore throat"}'
```

---

## 📁 Project Structure

```
healthcopilot-ai/
├── backend/
│   ├── api/routers/          # Route handlers (auth, predict, chat, upload)
│   ├── core/config.py        # Settings loaded from .env
│   ├── ml/
│   │   ├── trainer.py        # Dataset download + model training
│   │   ├── predictor.py      # Inference (load model, run prediction)
│   │   ├── chat_engine.py    # Semantic medical chat
│   │   └── symptom_normalizer.py  # NL → medical vocab translation
│   ├── services/ocr_service.py    # PDF + image OCR
│   ├── models/               # SQLModel DB models
│   ├── scripts/train.py      # Training entrypoint
│   └── main.py               # FastAPI app
│
├── frontend/src/
│   ├── pages/                # Full-page components
│   ├── components/ui/        # Shared UI primitives (Button, Input, Toast…)
│   ├── context/              # React context providers
│   └── index.css             # CSS design system
│
├── datasets/                 # Auto-downloaded datasets (gitignored)
├── trained_models/           # Saved ML models (gitignored)
├── README.md
├── CONTRIBUTING.md           # This file
└── LICENSE
```

---

## 🎨 Coding Standards

### Python (Backend)

- Follow **PEP 8** (use a formatter like `black` or `ruff`)
- Type-annotate all function signatures
- Add docstrings to all public functions and classes
- Use `async/await` for all I/O-bound operations
- Keep routers thin — business logic goes in `ml/` or `services/`

```python
# Good
async def predict_disease(request: PredictionRequest) -> PredictionResponse:
    """Run AI symptom classification and return diagnosis."""
    result = predictor.predict(request.symptoms)
    return PredictionResponse(**result)

# Avoid
def predict(req):
    return predictor.predict(req.symptoms)
```

### TypeScript / React (Frontend)

- Use **functional components** with hooks — no class components
- Type all props with explicit interfaces
- Keep components under ~150 lines; split if larger
- Use `useCallback` and `useMemo` for expensive operations
- No inline styles — use CSS classes from the design system

```tsx
// Good
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const ActionButton: React.FC<ButtonProps> = ({ onClick, disabled, children }) => (
  <button className="btn-primary" onClick={onClick} disabled={disabled}>
    {children}
  </button>
);
```

### CSS

- Use CSS custom properties (`var(--color-primary)`) — never hardcode hex values inline
- Follow the existing naming convention: `font-headline-md`, `text-body-md`, etc.
- Mobile-first responsive design

### ML / AI

- Any changes to `trainer.py` must include updated accuracy metrics in the PR description
- New symptom mappings in `symptom_normalizer.py` should be tested with the test script:
  ```bash
  python -m scripts.test_normalizer
  ```
- Do not commit trained model `.pkl` files or datasets to the repo

---

## 📝 Commit Message Convention

We use **[Conventional Commits](https://www.conventionalcommits.org/)**:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructure (no feature/fix) |
| `test` | Adding or fixing tests |
| `chore` | Build, CI, dependency updates |
| `perf` | Performance improvements |

**Examples:**

```bash
git commit -m "feat(ml): add symptom autocomplete with NLP normalization"
git commit -m "fix(predict): correct trailing slash in API URL"
git commit -m "docs: add Kaggle setup instructions to README"
git commit -m "style(frontend): align diagnosis result card spacing"
git commit -m "chore: upgrade scikit-learn to 1.6.1"
```

---

## 🔀 Pull Request Process

1. **Open an issue first** for non-trivial changes so we can discuss the approach
2. **Keep PRs focused** — one feature or fix per PR (easier to review)
3. **Update documentation** if you change API endpoints or add features
4. **Add tests** for new functionality where possible
5. **Fill in the PR template** completely
6. **Request a review** from a maintainer

### PR Checklist

Before submitting:

- [ ] Code follows the coding standards above
- [ ] All existing tests pass (`python -m pytest` / `npm test`)
- [ ] New code has tests where applicable
- [ ] Documentation updated (README, docstrings, comments)
- [ ] Conventional commit messages used
- [ ] No secrets or API keys committed
- [ ] No large binary files (datasets, models) committed

---

## 🐛 Issue Reporting

### Bug Reports

Use the **Bug Report** template and include:

- **Steps to reproduce** (minimal example)
- **Expected behavior**
- **Actual behavior**
- **Environment** (OS, Python version, Node version)
- **Logs/screenshots** if applicable

### Feature Requests

Use the **Feature Request** template and include:

- **Problem statement** — what are you trying to solve?
- **Proposed solution**
- **Alternatives considered**
- **Additional context** (mockups, references)

---

## 🆘 Areas We Need Help With

We especially welcome contributions in these areas:

### 🧠 AI / ML
- Improving symptom normalizer mappings for more languages
- Adding more diseases to the training dataset
- Experimenting with XGBoost or LightGBM for the classifier
- Training a fine-tuned BERT model for the chat engine

### 🎨 Frontend / UI
- Accessibility improvements (ARIA labels, keyboard navigation)
- Mobile UI polish
- Dark mode improvements
- Animated result transitions

### 🌐 Internationalization
- Hindi language symptom support
- Spanish/French translations

### 📚 Documentation
- Video walkthroughs / GIFs
- API cookbook examples
- Deployment guides (Docker, Render, Railway)

### 🧪 Testing
- Backend unit tests (pytest)
- Frontend component tests (Vitest)
- Integration tests for AI endpoints

---

## 💬 Questions?

- Open a [Discussion](https://github.com/ashutoshpatraa/healthcopilot-ai/discussions)
- Open an [Issue](https://github.com/ashutoshpatraa/healthcopilot-ai/issues)

---

Thank you for making HealthCopilot AI better! 🏥
