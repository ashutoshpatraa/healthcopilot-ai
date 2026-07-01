# Contributing to HealthCopilot AI

Thanks for your interest. Contributions are welcome — bug fixes, features, docs, tests, all of it.

---

## Before you start

Open an issue first for anything non-trivial so we can agree on the approach before you write code. For small fixes (typos, minor bugs) you can go straight to a PR.

---

## Setup

```bash
git clone https://github.com/ashutoshpatraa/healthcopilot-ai.git
cd healthcopilot-ai

# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
source .venv/bin/activate    # macOS / Linux
pip install -r requirements.txt
cp .env.example .env         # fill in KAGGLE_USERNAME + KAGGLE_KEY
python scripts/train.py      # one-time model training

uvicorn main:app --reload    # http://localhost:8000

# Frontend (separate terminal)
cd ../frontend
npm install
npm run dev                  # http://localhost:5173
```

---

## Making changes

```bash
git checkout -b feat/your-feature   # or fix/, docs/, refactor/
# make changes
git commit -m "feat: short description of what changed"
git push origin feat/your-feature
# open a PR on GitHub
```

---

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add symptom autocomplete
fix: correct trailing slash in predict URL
docs: update API reference
refactor: split chat_engine into loader and responder
test: add unit tests for symptom normalizer
chore: upgrade scikit-learn to 1.6.1
```

---

## Code style

**Python**
- PEP 8, formatted with `black` or `ruff`
- Type-annotate all function signatures
- `async/await` for all I/O — no blocking calls in route handlers
- Docstrings on all public functions and classes

**TypeScript / React**
- Functional components only, no class components
- All props typed with explicit interfaces
- No inline styles — use CSS classes from `index.css`
- `useCallback` / `useMemo` for any expensive operation

**CSS**
- Use `var(--color-*)` tokens — no hardcoded hex values inline
- Mobile-first breakpoints

**ML**
- Any change to `trainer.py` must include accuracy numbers in the PR description
- New entries in `symptom_normalizer.py` should be verified with `python -m scripts.test_normalizer`
- Never commit `.pkl` model files or dataset CSVs

---

## PR checklist

- [ ] All existing tests pass
- [ ] New code has tests where it makes sense
- [ ] No secrets or binary assets committed
- [ ] Docs updated if API or behaviour changed

---

## Good first issues

Look for issues labelled `good first issue`. Areas where help is most useful:

- Expanding the `symptom_normalizer.py` phrase mappings
- Writing `pytest` unit tests for the ML modules
- Improving accessibility (ARIA labels, keyboard nav)
- Docker Compose setup for one-command deployment
- Adding more diseases / training data

---

## Questions

Open a [Discussion](https://github.com/ashutoshpatraa/healthcopilot-ai/discussions) or an [Issue](https://github.com/ashutoshpatraa/healthcopilot-ai/issues).
