"""
ML Predictor for HealthCopilot AI
Loads the trained model and runs inference on symptom text.
Falls back to a rule-based system if model is not yet trained.
"""
import json
import logging
from pathlib import Path
from typing import Optional
from ml.symptom_normalizer import normalize as normalize_symptoms

logger = logging.getLogger(__name__)

BASE_DIR   = Path(__file__).resolve().parent.parent
MODEL_DIR  = BASE_DIR.parent / "trained_models"
MODEL_PATH   = MODEL_DIR / "symptom_classifier.pkl"
ENCODER_PATH = MODEL_DIR / "label_encoder.pkl"
META_PATH    = MODEL_DIR / "model_meta.json"

# ─── Rule-based fallback ──────────────────────────────────────────────────────
RULE_BASED_MAP = {
    "cough": ("Common Cold", "General Physician"),
    "fever": ("Influenza", "General Physician"),
    "headache": ("Migraine", "Neurologist"),
    "chest pain": ("Heart attack", "Cardiologist"),
    "rash": ("Allergy", "Dermatologist"),
    "fatigue": ("Anaemia", "General Physician"),
    "nausea": ("Gastroenteritis", "Gastroenterologist"),
    "vomiting": ("Gastroenteritis", "Gastroenterologist"),
    "shortness of breath": ("Bronchial Asthma", "Pulmonologist"),
    "joint pain": ("Arthritis", "Rheumatologist"),
    "back pain": ("Cervical spondylosis", "Orthopedist"),
    "skin itching": ("Psoriasis", "Dermatologist"),
    "yellow skin": ("Jaundice", "Hepatologist"),
    "frequent urination": ("Diabetes", "Endocrinologist"),
}


class SymptomPredictor:
    """Loads a trained TF-IDF + RandomForest pipeline and runs predictions."""

    def __init__(self):
        self._pipeline = None
        self._label_encoder = None
        self._meta: dict = {}
        self._loaded = False

    def load(self) -> bool:
        """Attempt to load model from disk. Returns True if successful."""
        try:
            import joblib
            if not MODEL_PATH.exists() or not ENCODER_PATH.exists():
                logger.warning("Model not found at %s – using rule-based fallback.", MODEL_PATH)
                return False
            self._pipeline = joblib.load(MODEL_PATH)
            self._label_encoder = joblib.load(ENCODER_PATH)
            if META_PATH.exists():
                with open(META_PATH) as f:
                    self._meta = json.load(f)
            self._loaded = True
            n_cls = self._meta.get("n_classes", "?")
            acc   = self._meta.get("accuracy", 0)
            logger.info("Symptom classifier loaded – %s classes, accuracy=%.4f", n_cls, acc)
            return True
        except Exception as e:
            logger.error("Failed to load model: %s", e)
            return False

    def predict(self, symptoms_text: str) -> dict:
        """
        Run inference on raw symptom text.
        Normalizes natural language to medical vocabulary before inference.
        Returns: {disease, confidence, specialist}
        """
        symptoms_text = symptoms_text.strip().lower()
        # Normalize natural language → medical vocabulary
        normalized = normalize_symptoms(symptoms_text)
        logger.debug("Symptom normalization: %r → %r", symptoms_text, normalized)

        if self._loaded and self._pipeline is not None:
            return self._ml_predict(normalized)
        return self._rule_predict(normalized)

    def _ml_predict(self, text: str) -> dict:
        proba = self._pipeline.predict_proba([text])[0]
        top_idx = int(proba.argmax())
        confidence = float(proba[top_idx])
        disease = self._label_encoder.inverse_transform([top_idx])[0]

        specialist_map = self._meta.get("specialist_map", {})
        specialist = specialist_map.get(disease, "General Physician")

        # Top 3 differential diagnoses
        top3_idx = proba.argsort()[::-1][:3]
        differentials = [
            {
                "disease": self._label_encoder.inverse_transform([i])[0],
                "confidence": float(proba[i]),
            }
            for i in top3_idx
        ]

        # If model is not confident enough, be honest rather than guessing
        LOW_CONFIDENCE_THRESHOLD = 0.35
        if confidence < LOW_CONFIDENCE_THRESHOLD:
            return {
                "disease": "Symptoms unclear — please describe more specifically",
                "confidence": round(confidence, 4),
                "specialist": "General Physician",
                "differentials": differentials,
                "model": "local_rf_v1",
                "low_confidence": True,
            }

        return {
            "disease": disease,
            "confidence": round(confidence, 4),
            "specialist": specialist,
            "differentials": differentials,
            "model": "local_rf_v1",
        }

    def _rule_predict(self, text: str) -> dict:
        for keyword, (disease, specialist) in RULE_BASED_MAP.items():
            if keyword in text:
                return {
                    "disease": disease,
                    "confidence": 0.70,
                    "specialist": specialist,
                    "differentials": [],
                    "model": "rule_based_fallback",
                }
        return {
            "disease": "Undetermined – please consult a physician",
            "confidence": 0.0,
            "specialist": "General Physician",
            "differentials": [],
            "model": "rule_based_fallback",
        }

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    @property
    def model_info(self) -> dict:
        return {
            "loaded": self._loaded,
            "n_classes": self._meta.get("n_classes", 0),
            "accuracy": self._meta.get("accuracy", 0),
        }


# Singleton instance loaded at app startup
predictor = SymptomPredictor()
