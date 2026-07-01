from ml.symptom_normalizer import normalize
from ml.predictor import predictor
predictor.load()
tests = [
    "water from nose sour neck",
    "cough fever",
    "cough fever runny nose sneezing sore throat",
    "stomach pain nausea vomiting loose motion",
    "chest pain arm pain sweating",
]
for t in tests:
    norm = normalize(t)
    r = predictor.predict(t)
    disease = r["disease"]
    conf = r["confidence"] * 100
    spec = r["specialist"]
    print(f"IN : {t}")
    print(f"MAP: {norm}")
    print(f"OUT: {disease} ({conf:.1f}%) | {spec}")
    print()
