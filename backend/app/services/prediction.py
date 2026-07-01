from collections.abc import Sequence


DISEASE_RULES: dict[str, tuple[list[str], str]] = {
    "Influenza": (["fever", "cough", "body ache", "fatigue"], "General Physician"),
    "Migraine": (["headache", "nausea", "light sensitivity"], "Neurologist"),
    "Gastroenteritis": (["vomiting", "diarrhea", "abdominal pain"], "Gastroenterologist"),
    "Allergic Rhinitis": (["sneezing", "runny nose", "itchy eyes"], "ENT Specialist"),
}


def predict_disease(symptoms: Sequence[str]) -> tuple[str, float, float, str]:
    normalized = {symptom.strip().lower() for symptom in symptoms if symptom.strip()}
    best_disease = "General Consultation"
    best_match_count = 0
    best_specialist = "General Physician"

    for disease, (keywords, specialist) in DISEASE_RULES.items():
        match_count = len(normalized.intersection({keyword.lower() for keyword in keywords}))
        if match_count > best_match_count:
            best_disease = disease
            best_match_count = match_count
            best_specialist = specialist

    confidence = min(0.55 + (0.12 * best_match_count), 0.96)
    risk_score = min(0.35 + (0.18 * len(normalized)), 0.98)
    return best_disease, round(confidence, 2), round(risk_score, 2), best_specialist
