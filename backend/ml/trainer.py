"""
ML Trainer for HealthCopilot AI
Downloads datasets from Kaggle and trains a symptom-to-disease classifier.

Datasets used:
  - itachi9604/disease-symptom-description-dataset  (133 diseases, 17 symptoms each)
  - niyarrbarman/symptom2disease                    (natural-language symptom descriptions)
"""
import json
import logging
import shutil
from pathlib import Path

import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

logger = logging.getLogger(__name__)

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).resolve().parent.parent
DATA_DIR   = BASE_DIR.parent / "datasets"
MODEL_DIR  = BASE_DIR.parent / "trained_models"
DATA_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH   = MODEL_DIR / "symptom_classifier.pkl"
ENCODER_PATH = MODEL_DIR / "label_encoder.pkl"
META_PATH    = MODEL_DIR / "model_meta.json"

# ─── Specialist mapping ───────────────────────────────────────────────────────
SPECIALIST_MAP = {
    "Fungal infection": "Dermatologist",
    "Allergy": "Allergist",
    "GERD": "Gastroenterologist",
    "Chronic cholestasis": "Gastroenterologist",
    "Drug Reaction": "General Physician",
    "Peptic ulcer diseae": "Gastroenterologist",
    "AIDS": "Infectious Disease Specialist",
    "Diabetes": "Endocrinologist",
    "Gastroenteritis": "Gastroenterologist",
    "Bronchial Asthma": "Pulmonologist",
    "Hypertension": "Cardiologist",
    "Migraine": "Neurologist",
    "Cervical spondylosis": "Orthopedist",
    "Paralysis (brain hemorrhage)": "Neurologist",
    "Jaundice": "Hepatologist",
    "Malaria": "Infectious Disease Specialist",
    "Chicken pox": "Dermatologist",
    "Dengue": "Infectious Disease Specialist",
    "Typhoid": "Infectious Disease Specialist",
    "hepatitis A": "Hepatologist",
    "Hepatitis B": "Hepatologist",
    "Hepatitis C": "Hepatologist",
    "Hepatitis D": "Hepatologist",
    "Hepatitis E": "Hepatologist",
    "Alcoholic hepatitis": "Hepatologist",
    "Tuberculosis": "Pulmonologist",
    "Common Cold": "General Physician",
    "Pneumonia": "Pulmonologist",
    "Dimorphic hemmorhoids(piles)": "Proctologist",
    "Heart attack": "Cardiologist",
    "Varicose veins": "Vascular Surgeon",
    "Hypothyroidism": "Endocrinologist",
    "Hyperthyroidism": "Endocrinologist",
    "Hypoglycemia": "Endocrinologist",
    "Osteoarthritis": "Rheumatologist",
    "Arthritis": "Rheumatologist",
    "(vertigo) Paroymsal  Positional Vertigo": "ENT Specialist",
    "Acne": "Dermatologist",
    "Urinary tract infection": "Urologist",
    "Psoriasis": "Dermatologist",
    "Impetigo": "Dermatologist",
}


def _setup_kaggle_credentials(username: str, key: str) -> None:
    """Write kaggle.json to the expected location."""
    import json as _json
    kaggle_dir = Path.home() / ".kaggle"
    kaggle_dir.mkdir(exist_ok=True)
    cred_file = kaggle_dir / "kaggle.json"
    cred = {"username": username, "key": key}
    with open(cred_file, "w") as f:
        _json.dump(cred, f)
    cred_file.chmod(0o600)
    logger.info("Kaggle credentials written to %s", cred_file)


def download_datasets(username: str = "", key: str = "") -> None:
    """Download all required Kaggle datasets using the kaggle package."""
    if username and key:
        _setup_kaggle_credentials(username, key)

    import kaggle
    kaggle.api.authenticate()

    datasets = [
        ("itachi9604", "disease-symptom-description-dataset"),
        ("niyarrbarman", "symptom2disease"),
    ]
    for owner, name in datasets:
        dest = DATA_DIR / name
        if dest.exists() and any(dest.iterdir()):
            logger.info("Dataset '%s' already downloaded – skipping.", name)
            continue
        dest.mkdir(parents=True, exist_ok=True)
        logger.info("Downloading dataset: %s/%s …", owner, name)
        kaggle.api.dataset_download_files(
            f"{owner}/{name}", path=str(dest), unzip=True
        )
        logger.info("Downloaded to: %s", dest)


def _load_symptom_dataset() -> pd.DataFrame:
    """Load and normalise the itachi9604 dataset."""
    ds_dir = DATA_DIR / "disease-symptom-description-dataset"
    if not ds_dir.exists():
        logger.warning("itachi9604 dataset not found at %s", ds_dir)
        return pd.DataFrame(columns=["disease", "symptoms_text"])

    csv_candidates = list(ds_dir.glob("*.csv"))
    if not csv_candidates:
        logger.warning("No CSV files found in %s", ds_dir)
        return pd.DataFrame(columns=["disease", "symptoms_text"])

    # Prefer the symptom-disease mapping file (not descriptions or precautions)
    mapping = [f for f in csv_candidates if "dataset" in f.name.lower()]
    exclude = [f for f in csv_candidates if any(x in f.name.lower() for x in ["description", "precaution", "severity"])]
    usable = [f for f in csv_candidates if f not in exclude]
    csv_path = mapping[0] if mapping else (usable[0] if usable else csv_candidates[0])
    logger.info("Loading itachi9604 from: %s", csv_path.name)

    df = pd.read_csv(csv_path)
    # Normalise column names
    col_map = {}
    for c in df.columns:
        cl = c.strip().lower()
        if "disease" in cl:
            col_map[c] = "disease"
        else:
            col_map[c] = c.strip().lower().replace(" ", "_")
    df = df.rename(columns=col_map)

    symptom_cols = [c for c in df.columns if c != "disease"]
    df["symptoms_text"] = df[symptom_cols].apply(
        lambda row: " ".join(
            str(v).strip().replace("_", " ").lower()
            for v in row
            if pd.notna(v) and str(v).strip() not in ("", "nan")
        ),
        axis=1,
    )
    result = df[["disease", "symptoms_text"]].copy()
    result["disease"] = result["disease"].str.strip()
    logger.info("Loaded itachi9604: %d rows", len(result))
    return result


def _load_symptom2disease() -> pd.DataFrame:
    """Load and normalise the niyarrbarman symptom2disease dataset."""
    ds_dir = DATA_DIR / "symptom2disease"
    if not ds_dir.exists():
        return pd.DataFrame(columns=["disease", "symptoms_text"])

    csv_candidates = list(ds_dir.glob("*.csv"))
    if not csv_candidates:
        return pd.DataFrame(columns=["disease", "symptoms_text"])

    df = pd.read_csv(csv_candidates[0])
    col_map = {}
    for c in df.columns:
        cl = c.strip().lower()
        if cl in ("label", "disease", "class"):
            col_map[c] = "disease"
        elif cl in ("text", "symptoms", "symptom", "description"):
            col_map[c] = "symptoms_text"
    df = df.rename(columns=col_map)

    if "disease" not in df.columns or "symptoms_text" not in df.columns:
        logger.warning("Could not map symptom2disease columns: %s", list(df.columns))
        return pd.DataFrame(columns=["disease", "symptoms_text"])

    df["disease"] = df["disease"].str.strip()
    df["symptoms_text"] = df["symptoms_text"].astype(str)
    logger.info("Loaded symptom2disease: %d rows", len(df))
    return df[["disease", "symptoms_text"]]


def _builtin_dataset() -> pd.DataFrame:
    """Compact built-in dataset as an absolute fallback if Kaggle is unavailable."""
    records = [
        ("Common Cold", "cough runny nose sore throat sneezing mild fever fatigue"),
        ("Influenza", "high fever chills muscle aches headache fatigue cough"),
        ("Pneumonia", "chest pain cough fever shortness of breath chills"),
        ("Bronchial Asthma", "wheezing shortness of breath chest tightness cough"),
        ("Tuberculosis", "persistent cough blood sputum fever night sweats weight loss"),
        ("Diabetes", "frequent urination excessive thirst weight loss fatigue blurred vision"),
        ("Hypertension", "headache dizziness blurred vision chest pain shortness of breath"),
        ("Heart attack", "chest pain arm pain sweating nausea shortness of breath"),
        ("Migraine", "severe headache nausea vomiting light sensitivity throbbing pain"),
        ("Dengue", "high fever severe headache pain behind eyes joint pain muscle pain rash"),
        ("Malaria", "cyclic fever chills sweating headache nausea vomiting"),
        ("Typhoid", "prolonged fever abdominal pain headache loss of appetite weakness"),
        ("Hepatitis B", "fatigue jaundice dark urine abdominal pain nausea vomiting"),
        ("Jaundice", "yellowing skin yellow eyes dark urine fatigue abdominal pain"),
        ("Allergy", "sneezing runny nose skin rash itching watery eyes"),
        ("GERD", "heartburn regurgitation chest pain difficulty swallowing dry cough"),
        ("Gastroenteritis", "diarrhoea vomiting nausea stomach cramps fever"),
        ("Urinary tract infection", "burning urination frequent urination cloudy urine pelvic pain"),
        ("Arthritis", "joint pain joint stiffness swelling reduced range of motion"),
        ("Hypothyroidism", "fatigue weight gain cold sensitivity dry skin constipation depression"),
        ("Hyperthyroidism", "weight loss rapid heartbeat sweating anxiety tremors heat intolerance"),
        ("Acne", "pimples blackheads whiteheads oily skin skin inflammation"),
        ("Psoriasis", "red patches silver scales dry skin itching burning"),
        ("Chicken pox", "itchy blisters fever tiredness loss of appetite headache"),
        ("AIDS", "weight loss fever night sweats fatigue swollen lymph nodes"),
        ("Fungal infection", "skin itching skin rash nodal skin eruptions dischromic patches"),
        ("Hypoglycemia", "sweating trembling dizziness hunger confusion rapid heartbeat"),
        ("Peptic ulcer diseae", "stomach pain burning sensation nausea vomiting"),
        ("Osteoarthritis", "joint pain stiffness swelling reduced motion bone spurs"),
        ("Varicose veins", "leg swelling heaviness aching twisted veins skin discolouration"),
    ]
    df = pd.DataFrame(records, columns=["disease", "symptoms_text"])
    # Augment with duplicates + variation
    augmented = []
    for _, row in df.iterrows():
        for _ in range(8):
            augmented.append(row)
    logger.info("Using built-in fallback dataset: %d rows", len(augmented))
    return pd.DataFrame(augmented)


def train_model() -> dict:
    """Train TF-IDF + RandomForest pipeline on combined datasets."""
    logger.info("Loading datasets …")
    df1 = _load_symptom_dataset()
    df2 = _load_symptom2disease()
    df  = pd.concat([df1, df2], ignore_index=True)

    # Fall back to built-in data if no Kaggle data available
    if len(df) < 50:
        logger.warning("Insufficient data from Kaggle (%d rows). Using built-in dataset.", len(df))
        df = _builtin_dataset()

    df = df.dropna(subset=["disease", "symptoms_text"])
    df = df[df["symptoms_text"].str.strip() != ""]

    logger.info("Combined training set: %d samples, %d diseases", len(df), df["disease"].nunique())

    le = LabelEncoder()
    y  = le.fit_transform(df["disease"])
    X  = df["symptoms_text"]

    # Ensure enough samples per class for stratified split
    class_counts = pd.Series(y).value_counts()
    min_count = class_counts.min()
    test_size = 0.15 if min_count >= 7 else 0.1

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42,
        stratify=y if min_count >= 2 else None
    )

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=8000,
            sublinear_tf=True,
            strip_accents="unicode",
        )),
        ("clf", RandomForestClassifier(
            n_estimators=200,
            max_depth=None,
            random_state=42,
            n_jobs=-1,
        )),
    ])

    logger.info("Training model …")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    logger.info("Test accuracy: %.4f (%.1f%%)", acc, acc * 100)

    # Save artefacts
    joblib.dump(pipeline, MODEL_PATH)
    joblib.dump(le, ENCODER_PATH)

    meta = {
        "accuracy": float(acc),
        "n_classes": int(len(le.classes_)),
        "classes": list(le.classes_),
        "specialist_map": SPECIALIST_MAP,
    }
    with open(META_PATH, "w") as f:
        json.dump(meta, f, indent=2)

    logger.info("Model saved → %s", MODEL_PATH)
    return meta


def is_trained() -> bool:
    return MODEL_PATH.exists() and ENCODER_PATH.exists() and META_PATH.exists()
