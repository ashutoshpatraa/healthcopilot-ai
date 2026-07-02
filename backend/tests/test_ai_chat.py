import pytest
from ml.chat_engine import chat_engine

@pytest.fixture(scope="module")
def chat():
    # Load semantic models
    chat_engine.load()
    return chat_engine

CHAT_TEST_CASES = [
    # --- Exact Keyword / Rule matches (Emergency) ---
    ("I am having a heart attack", "[EMERGENCY]"),
    ("My dad has chest pain and can't breathe", "[EMERGENCY]"),
    ("stroke symptoms happening now", "[EMERGENCY]"),
    ("emergency i need help", "[EMERGENCY]"),
    ("severe allergic reaction with swelling", "[EMERGENCY]"),
    ("anaphylaxis after eating peanuts", "[EMERGENCY]"),
    ("someone is unconscious", "[EMERGENCY]"),
    ("he is bleeding heavily", "[EMERGENCY]"),
    ("my friend had a seizure", "[EMERGENCY]"),
    ("overdose on pills", "[EMERGENCY]"),

    # --- Keyword matches (Symptoms / Meds) ---
    ("my head hurts so much", "Could you describe your symptoms"),
    ("I feel a sharp pain in my leg", "Could you describe your symptoms"),
    ("What dose of paracetamol should I take?", "pharmacist or physician"),
    ("Can I take this medication with food?", "pharmacist or physician"),
    ("My sugar levels are high", "endocrinologist for personalised care"),
    ("how much insulin should I inject", "endocrinologist for personalised care"),

    # --- Semantic RAG Matches (from MEDICAL_FAQ) ---
    ("Tell me about diabetes symptoms", "frequent urination"),
    ("Why is my blood pressure high?", "excess salt intake"),
    ("What are the signs of a heart attack?", "[EMERGENCY]"),
    ("Do I have asthma?", "recurrent wheezing"),
    ("What happens in an allergic reaction?", "hives, itching, swelling"),
    ("I feel anxious all the time", "persistent worry"),
    ("What are the warning signs of a stroke?", "[EMERGENCY]"),
    ("Why do I get migraines?", "hormonal changes"),
    ("What are symptoms of kidney disease?", "foamy urine"),
    ("How do I manage type 2 diabetes?", "low glycaemic index foods"),
    ("Am I iron deficient?", "brittle nails"),
    ("Why do my joints hurt?", "rheumatologist"),
    ("What are thyroid problem symptoms?", "TSH, T3, T4"),
    ("What should I do if I experience chest pain", "[EMERGENCY]"),
    ("What are COVID-19 symptoms?", "loss of taste or smell"),
    ("What is normal blood pressure?", "120/80 mmHg"),
    ("How do I lower cholesterol?", "statins"),
    ("What are the symptoms of depression?", "persistent sadness"),
    ("I have a fever of 101, what to do", "paracetamol or ibuprofen"),
    ("I am short of breath", "pulmonary embolism"),

    # --- Noisy Semantic (Should still match correctly) ---
    ("sugar disease signs", "frequent urination"),
    ("why do I get migraines and light sensitivity", "hormonal changes"), # Migraine
    ("my cholesterol is too high", "statins"),
    ("covid signs", "loss of taste or smell"),
    ("symptoms of depression like sadness and no motivation", "persistent sadness"),

    # --- Low Confidence / Unrelated (Should fallback) ---
    ("What is the capital of France?", "HealthCopilot AI assistant"),
    ("Who won the super bowl?", "HealthCopilot AI assistant"),
    ("How do I fix my car engine?", "HealthCopilot AI assistant"),
    ("Tell me a joke", "HealthCopilot AI assistant"),
    ("Write a python script", "HealthCopilot AI assistant"),
    ("Who is the president?", "HealthCopilot AI assistant"),
    ("What's the weather today?", "HealthCopilot AI assistant"),
    ("Can you play music?", "HealthCopilot AI assistant"),
    ("Are you a real doctor?", "HealthCopilot AI assistant"),
]

@pytest.mark.parametrize("query, expected_substring", CHAT_TEST_CASES)
def test_chat_engine(chat, query, expected_substring):
    response = chat.respond(query)
    assert expected_substring.lower() in response.lower(), f"Expected '{expected_substring}' in response '{response}' for query '{query}'"
