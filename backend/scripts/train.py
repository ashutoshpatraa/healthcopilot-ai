"""
HealthCopilot AI — Model Training Script
Run this once to download datasets from Kaggle and train the local AI models.

Usage (from the /backend directory):
    python scripts/train.py

The script will:
  1. Write Kaggle credentials from .env
  2. Download disease-symptom datasets from Kaggle
  3. Train and save a TF-IDF + RandomForest symptom classifier
  4. Report accuracy on the held-out test set
"""
import sys
import logging
from pathlib import Path

# Add backend root to path so we can import backend modules
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("train")

def main():
    logger.info("=" * 60)
    logger.info("  HealthCopilot AI — Training Pipeline")
    logger.info("=" * 60)

    # Load settings (reads from backend/.env)
    from core.config import settings

    kaggle_user = settings.KAGGLE_USERNAME
    kaggle_key  = settings.KAGGLE_KEY

    if not kaggle_user or not kaggle_key:
        logger.error(
            "KAGGLE_USERNAME and KAGGLE_KEY must be set in backend/.env\n"
            "  KAGGLE_USERNAME=<your_username>\n"
            "  KAGGLE_KEY=<your_api_key>"
        )
        sys.exit(1)

    from ml.trainer import download_datasets, train_model, is_trained, MODEL_DIR

    # ── Step 1: Download datasets ─────────────────────────────────────────────
    logger.info("Step 1/2 — Downloading datasets from Kaggle …")
    try:
        download_datasets(username=kaggle_user, key=kaggle_key)
        logger.info("Datasets ready in: %s", BACKEND_DIR.parent / "datasets")
    except Exception as e:
        logger.error("Dataset download failed: %s", e)
        logger.warning("Will attempt to train on any existing local data …")

    # ── Step 2: Train model ───────────────────────────────────────────────────
    logger.info("Step 2/2 — Training symptom classifier …")
    try:
        meta = train_model()
        logger.info("=" * 60)
        logger.info("  Training Complete!")
        logger.info("  Diseases:   %d", meta["n_classes"])
        logger.info("  Accuracy:   %.2f%%", meta["accuracy"] * 100)
        logger.info("  Model saved: %s", MODEL_DIR / "symptom_classifier.pkl")
        logger.info("=" * 60)
    except Exception as e:
        logger.error("Training failed: %s", e)
        raise

    logger.info("Done! Restart your uvicorn server to load the trained model.")


if __name__ == "__main__":
    main()
