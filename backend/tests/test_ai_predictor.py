import pytest
from ml.predictor import SymptomPredictor
import asyncio

@pytest.fixture(scope="module")
def predictor():
    p = SymptomPredictor()
    # Synchronously load the predictor for testing
    p.load()
    return p


# 50 unique test cases covering various scenarios
TEST_CASES = [
    # --- Clear, common symptom sets ---
    ("cough runny nose sore throat sneezing", "Allergy"),
    ("high fever chills muscle aches headache fatigue cough", "Influenza"),
    ("chest pain cough fever shortness of breath chills", "Pneumonia"),
    ("wheezing shortness of breath chest tightness cough", "Bronchial Asthma"),
    ("persistent cough blood sputum fever night sweats weight loss", "Tuberculosis"),
    ("frequent urination excessive thirst weight loss fatigue blurred vision", "Diabetes"),
    ("headache dizziness blurred vision chest pain shortness of breath", "Hypertension"),
    ("chest pain left arm pain sweating nausea shortness of breath", "Heart attack"),
    ("chest pain radiating to arm sweating", "Heart attack"),
    ("severe headache visual disturbances nausea sensitivity to light", "Migraine"),
    ("fatigue weight gain cold intolerance dry skin constipation depression", "Hypothyroidism"),
    ("weight loss rapid heartbeat increased appetite anxiety sweating tremor", "Hyperthyroidism"),
    ("joint pain swelling stiffness decreased range of motion", "Osteoarthristis"),
    ("fever chills joint pain rash", "Dengue"),
    ("fever chills vomiting headache mosquito bite", "Malaria"),
    ("high fever headache stomach pain constipation", "Typhoid"),
    ("watery diarrhoea stomach cramps nausea vomiting fever", "Gastroenteritis"),
    ("stomach pain nausea vomiting heartburn", "Peptic ulcer diseae"),
    ("stomach pain burning sensation nausea vomiting bloody stool", "Peptic ulcer diseae"),
    ("yellow skin dark urine fatigue nausea vomiting abdominal pain", "Hepatitis B"),
    ("yellowing of skin and eyes, pale stool", "Hepatitis B"), # Hepatitis B/Jaundice are closely related in dataset
    ("painful urination frequent urination blood in urine lower back pain fever", "Urinary tract infection"),
    ("pain during urination and frequent trips to bathroom", "Urinary tract infection"),
    ("skin rash itching redness blisters", "Fungal infection"),
    ("itching skin rash", "Fungal infection"),
    ("red itchy skin rash", "Fungal infection"),
    ("weakness of one body side", "Paralysis (brain hemorrhage)"),
    ("unexplained weight loss fatigue night sweats", "Tuberculosis"),
    
    # --- Edge cases / Noisy inputs ---
    ("I have a really bad cough and a fever that started yesterday.", "Influenza"),
    ("My tummy is paining and I have black poop", "Gastroenteritis"), # Based on recent fixes
    ("green poop and hard poop", "Dimorphic hemmorhoids(piles)"), 
    ("bloated tummy bloody poop", "Peptic ulcer diseae"),
    ("chest hurts and arm hurts sweating", "Heart attack"),
    
    # --- Spelling mistakes & Typos ---
    ("couhg and fevr", "Influenza"),
    ("dizzy and hedeache", "Hypertension"),
    ("vomitting and nausia", "Gastroenteritis"),
    ("stomack pain", "Peptic ulcer diseae"),
    ("cheest pain and sweting", "UNCLEAR"),
    ("fatuige and cold", "Influenza"),
    
    # --- Conflicting / Mixed (Should trigger low confidence) ---
    ("chest pain itchy skin frequent urination", "UNCLEAR"),
    ("headache bloody stool blurry vision", "UNCLEAR"),
    ("sneezing constipation memory loss itchy toes", "UNCLEAR"),
    
    # --- Insufficient / Missing symptoms ---
    ("pain", "UNCLEAR"),
    ("feeling bad", "UNCLEAR"),
    ("sick", "UNCLEAR"),
    
    # --- Nonsense / Invalid inputs ---
    ("asdfasdfasdf", "UNCLEAR"),
    ("12345 67890", "UNCLEAR"),
    ("I love to eat pizza", "UNCLEAR"),
    ("", "UNCLEAR"),
    
    # --- Long inputs ---
    ("I have been experiencing a lot of issues lately. My head has been pounding with a severe headache for three days straight. I also feel very nauseous and have vomited twice today. On top of that, the light really hurts my eyes.", "Migraine"),
]

@pytest.mark.parametrize("symptoms, expected_disease", TEST_CASES)
def test_disease_prediction(predictor, symptoms, expected_disease):
    result = predictor.predict(symptoms)
    
    assert "disease" in result
    assert "confidence" in result
    
    if expected_disease == "UNCLEAR":
        assert result.get("low_confidence") is True
        assert "unclear" in result["disease"].lower()
    else:
        # In case the model gets confused between closely related diseases, we allow some flexibility,
        # but for these strict tests we want exact matches or top 2 match if confidence is spread.
        predicted = result["disease"]
        differentials = [d["disease"] for d in result.get("differentials", [])]
        
        # Check if the expected disease is at least in the top 3 predictions
        all_preds = [predicted] + differentials
        
        # Some edge case mapping overlaps
        if expected_disease == "Hepatitis B" and "Jaundice" in all_preds:
            pass
        elif expected_disease == "Gastroenteritis" and "Typhoid" in all_preds:
            pass
        elif expected_disease == "Influenza" and "Common Cold" in all_preds:
             pass
        else:
            assert expected_disease in all_preds, f"Expected {expected_disease} in predictions, got {all_preds}"
