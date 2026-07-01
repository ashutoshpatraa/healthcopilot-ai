"""
Symptom Normalizer for HealthCopilot AI
Maps natural-language user input to the medical vocabulary the ML model was trained on.
The itachi9604 dataset uses underscore-separated medical terms as features.
"""
import re

# ─── Phrase → medical term mappings ──────────────────────────────────────────
# Ordered longest-first so multi-word phrases match before single words
SYMPTOM_MAP: list[tuple[str, str]] = [
    # Respiratory / ENT
    ("water from nose", "runny_nose continuous_sneezing congestion"),
    ("runny nose", "runny_nose continuous_sneezing"),
    ("running nose", "runny_nose continuous_sneezing"),
    ("watery nose", "runny_nose continuous_sneezing"),
    ("blocked nose", "congestion sinus_pressure"),
    ("stuffy nose", "congestion sinus_pressure"),
    ("sinus pressure", "sinus_pressure"),
    ("blocked ears", "congestion"),
    ("redness of eyes", "redness_of_eyes"),
    ("red eyes", "redness_of_eyes"),
    ("watery eyes", "redness_of_eyes"),
    ("sore throat", "throat_irritation"),
    ("painful throat", "throat_irritation"),
    ("scratchy throat", "throat_irritation"),
    ("sour throat", "throat_irritation"),
    ("swollen glands neck", "swelled_lymph_nodes"),
    ("swollen neck", "swelled_lymph_nodes"),
    ("sore neck", "stiff_neck throat_irritation"),
    ("stiff neck", "stiff_neck"),
    ("neck pain", "stiff_neck"),
    ("neck stiffness", "stiff_neck"),
    ("sour neck", "throat_irritation stiff_neck"),
    ("general malaise", "malaise fatigue"),
    ("feeling unwell", "malaise fatigue"),
    ("not feeling well", "malaise fatigue"),
    ("feel sick", "malaise nausea"),
    ("shortness of breath", "breathlessness"),
    ("short of breath", "breathlessness"),
    ("hard to breathe", "breathlessness"),
    ("difficulty breathing", "breathlessness"),
    ("can't breathe", "breathlessness"),
    ("wheezing", "breathlessness"),
    ("chest tightness", "chest_pain breathlessness"),
    ("chest pain", "chest_pain"),
    ("chest pressure", "chest_pain"),
    ("sneezing a lot", "continuous_sneezing"),
    ("sneezing", "continuous_sneezing"),
    ("dry cough", "cough"),
    ("wet cough", "cough mucoid_sputum phlegm"),
    ("cough with phlegm", "cough phlegm mucoid_sputum"),
    ("phlegm", "phlegm mucoid_sputum"),
    ("mucus", "phlegm congestion"),
    ("cough", "cough"),

    # Temperature
    ("high fever", "high_fever chills"),
    ("very hot", "high_fever chills"),
    ("feeling cold", "chills"),
    ("cold chills", "chills"),
    ("chills", "chills"),
    ("shivering", "chills"),
    ("mild fever", "mild_fever"),
    ("fever", "high_fever chills"),
    ("temperature", "high_fever"),
    ("sweating", "sweating"),
    ("night sweats", "sweating"),

    # Head / Neuro
    ("bad headache", "headache"),
    ("head pain", "headache"),
    ("headache", "headache"),
    ("migraine", "headache"),
    ("dizziness", "dizziness"),
    ("dizzy", "dizziness"),
    ("lightheaded", "dizziness"),
    ("vertigo", "dizziness"),
    ("blurred vision", "blurred_and_distorted_vision"),
    ("blurry vision", "blurred_and_distorted_vision"),
    ("can't see clearly", "blurred_and_distorted_vision"),
    ("confusion", "altered_sensorium"),

    # Stomach / GI
    ("tummy ache", "stomach_pain belly_pain abdominal_pain"),
    ("tummy pain", "stomach_pain belly_pain abdominal_pain"),
    ("stomach ache", "stomach_pain"),
    ("stomach pain", "stomach_pain"),
    ("belly pain", "stomach_pain abdominal_pain belly_pain"),
    ("abdominal pain", "abdominal_pain"),
    ("black poop", "bloody_stool stomach_bleeding"),
    ("dark poop", "bloody_stool stomach_bleeding"),
    ("blood in poop", "bloody_stool"),
    ("blood in stool", "bloody_stool"),
    ("bloody poop", "bloody_stool"),
    ("nausea", "nausea"),
    ("feel like vomiting", "nausea vomiting"),
    ("want to vomit", "nausea vomiting"),
    ("vomiting", "vomiting"),
    ("throwing up", "vomiting"),
    ("diarrhoea", "diarrhoea"),
    ("diarrhea", "diarrhoea"),
    ("loose stools", "diarrhoea"),
    ("loose motion", "diarrhoea"),
    ("constipation", "constipation"),
    ("heartburn", "acidity"),
    ("acid reflux", "acidity"),
    ("indigestion", "indigestion"),
    ("loss of appetite", "loss_of_appetite"),
    ("no appetite", "loss_of_appetite"),
    ("not hungry", "loss_of_appetite"),

    # Skin
    ("skin rash", "skin_rash"),
    ("rash", "skin_rash"),
    ("itchy skin", "itching skin_rash"),
    ("itching", "itching"),
    ("yellow skin", "yellowing_of_skin yellowish_skin"),
    ("yellow eyes", "yellowing_of_skin"),
    ("jaundice", "yellowing_of_skin yellowish_skin"),
    ("pimples", "pus_filled_pimples"),
    ("acne", "pus_filled_pimples blackheads"),

    # Body / Musculoskeletal
    ("joint pain", "joint_pain"),
    ("joint ache", "joint_pain"),
    ("muscle pain", "muscle_pain"),
    ("muscle ache", "muscle_pain"),
    ("body ache", "muscle_pain joint_pain"),
    ("body pain", "muscle_pain"),
    ("back pain", "back_pain"),
    ("weak", "fatigue weakness"),
    ("weakness", "weakness"),
    ("fatigue", "fatigue"),
    ("tired", "fatigue"),
    ("very tired", "fatigue"),
    ("no energy", "fatigue"),
    ("weight loss", "weight_loss"),
    ("losing weight", "weight_loss"),

    # Urinary
    ("frequent urination", "frequent_urination polyuria"),
    ("going to toilet a lot", "frequent_urination"),
    ("burning urination", "burning_micturition"),
    ("pain when urinating", "burning_micturition"),
    ("dark urine", "dark_urine"),

    # Other
    ("swollen lymph nodes", "swelled_lymph_nodes"),
    ("swollen glands", "swelled_lymph_nodes"),
    ("loss of taste", "loss_of_taste"),
    ("loss of smell", "loss_of_smell"),
    ("anxiety", "anxiety"),
    ("depression", "depression"),
    ("insomnia", "insomnia"),
    ("can't sleep", "insomnia"),
]

# Compile sorted longest-first for greedy matching
_SORTED_MAP = sorted(SYMPTOM_MAP, key=lambda x: len(x[0]), reverse=True)


def normalize(text: str) -> str:
    """
    Convert natural-language symptom text to medical vocabulary terms.
    Preserves unmatched words to avoid losing context.
    """
    text = text.lower().strip()
    # Remove punctuation but keep spaces (do not strip underscores)
    text = re.sub(r"[,;.\-/\\()]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    matched_terms: list[str] = []
    remaining = text

    for phrase, medical_terms in _SORTED_MAP:
        if phrase in remaining:
            matched_terms.append(medical_terms)
            remaining = remaining.replace(phrase, " ").strip()

    # Keep any leftover words (could still be valid training vocab)
    remaining = re.sub(r"\s+", " ", remaining).strip()
    all_terms = matched_terms + ([remaining] if remaining else [])

    result = " ".join(all_terms)
    return result if result.strip() else text  # fallback to original if nothing matched
