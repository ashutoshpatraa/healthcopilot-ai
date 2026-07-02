"""
Medical Chat Engine for HealthCopilot AI
Uses NLTK for text processing and sentence-transformers + FAISS for
semantic FAQ retrieval. Falls back to keyword rules if models aren't loaded.
"""
import logging
import re
from typing import Optional

import nltk

logger = logging.getLogger(__name__)

# ─── Download required NLTK data (idempotent) ─────────────────────────────────
def _ensure_nltk():
    for resource in ["punkt", "stopwords", "wordnet", "averaged_perceptron_tagger"]:
        try:
            nltk.data.find(f"tokenizers/{resource}")
        except LookupError:
            try:
                nltk.data.find(f"corpora/{resource}")
            except LookupError:
                nltk.download(resource, quiet=True)

# ─── Built-in Medical FAQ Knowledge Base ─────────────────────────────────────
MEDICAL_FAQ = [
    {
        "q": "What are the symptoms of diabetes?",
        "a": "Common symptoms of diabetes include frequent urination, excessive thirst, unexplained weight loss, fatigue, blurred vision, and slow-healing sores. Type 1 diabetes may develop rapidly, while Type 2 symptoms can be gradual. Consult an endocrinologist for diagnosis."
    },
    {
        "q": "What causes high blood pressure?",
        "a": "Hypertension can result from excess salt intake, obesity, physical inactivity, smoking, excessive alcohol, stress, age, genetics, or underlying conditions like kidney disease. Regular monitoring and lifestyle changes are key. A cardiologist can provide a tailored management plan."
    },
    {
        "q": "What are the symptoms of a heart attack?",
        "a": "Heart attack symptoms include chest pain or pressure, pain radiating to the arm, jaw, neck or back, shortness of breath, nausea, cold sweat, and lightheadedness. Call emergency services immediately if these occur — time is critical."
    },
    {
        "q": "How do I know if I have asthma?",
        "a": "Asthma symptoms include recurrent wheezing, shortness of breath, chest tightness, and coughing (especially at night or early morning). A pulmonologist can confirm diagnosis via spirometry testing and prescribe appropriate inhalers."
    },
    {
        "q": "What are common signs of an allergic reaction?",
        "a": "Allergic reactions can cause hives, itching, swelling (especially of face/lips/throat), runny nose, watery eyes, sneezing, and in severe cases (anaphylaxis): difficulty breathing and a drop in blood pressure. Seek immediate care for severe reactions."
    },
    {
        "q": "What are symptoms of anxiety?",
        "a": "Anxiety symptoms include persistent worry, restlessness, fatigue, difficulty concentrating, irritability, muscle tension, and sleep disturbances. A mental health professional can help with CBT or medication if symptoms are impacting daily life."
    },
    {
        "q": "What are the warning signs of a stroke?",
        "a": "Use the FAST method: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. Other signs include sudden severe headache, vision loss, and confusion. Stroke is a medical emergency — act within minutes."
    },
    {
        "q": "What causes migraines?",
        "a": "Migraines can be triggered by hormonal changes, certain foods (caffeine, aged cheeses, alcohol), sleep disruption, stress, sensory stimuli, and weather changes. A neurologist can prescribe preventive or acute treatments."
    },
    {
        "q": "What are symptoms of kidney disease?",
        "a": "Symptoms include swelling in legs/ankles, fatigue, changes in urination frequency, foamy urine, back pain below the ribs, high blood pressure, and nausea. A nephrologist should evaluate persistent symptoms via blood and urine tests."
    },
    {
        "q": "How do I manage type 2 diabetes?",
        "a": "Type 2 diabetes management involves healthy diet (low glycaemic index foods), regular physical activity (150 min/week), weight management, blood sugar monitoring, and medications (metformin, insulin if needed). Regular HbA1c testing is essential. Work with an endocrinologist."
    },
    {
        "q": "What are symptoms of iron deficiency anaemia?",
        "a": "Symptoms include fatigue, weakness, pale skin, shortness of breath, dizziness, cold hands and feet, brittle nails, and headache. A complete blood count (CBC) confirms diagnosis. Iron-rich foods and supplements are prescribed by your physician."
    },
    {
        "q": "What causes joint pain?",
        "a": "Joint pain can be caused by arthritis (osteoarthritis, rheumatoid), gout, bursitis, tendinitis, lupus, or injury. A rheumatologist can identify the cause via blood tests, imaging, and physical examination."
    },
    {
        "q": "What are symptoms of thyroid problems?",
        "a": "Hypothyroidism: fatigue, weight gain, cold sensitivity, dry skin, constipation, depression. Hyperthyroidism: weight loss, rapid heartbeat, sweating, anxiety, tremors. An endocrinologist diagnoses via TSH, T3, T4 blood tests."
    },
    {
        "q": "What should I do if I have chest pain?",
        "a": "Chest pain can be cardiac, gastrointestinal, or musculoskeletal in origin. Any sudden, severe chest pain — especially with arm pain, sweating or nausea — should be treated as a potential heart attack. Call emergency services immediately. Do not drive yourself."
    },
    {
        "q": "What are symptoms of COVID-19?",
        "a": "COVID-19 symptoms include fever, cough, shortness of breath, fatigue, loss of taste or smell, sore throat, body aches, headache, and diarrhoea. Isolate, get tested, and seek emergency care if breathing becomes difficult or oxygen levels drop below 94%."
    },
    {
        "q": "What is a normal blood pressure reading?",
        "a": "Normal blood pressure is below 120/80 mmHg. Elevated: 120–129 systolic. Stage 1 hypertension: 130–139/80–89. Stage 2: 140+/90+. A hypertensive crisis (180+/120+) requires emergency care."
    },
    {
        "q": "How can I lower my cholesterol?",
        "a": "Reduce saturated fats and trans fats, eat high-fibre foods (oats, beans, fruits), exercise regularly, quit smoking, limit alcohol, and maintain healthy weight. If lifestyle changes aren't enough, a cardiologist may prescribe statins."
    },
    {
        "q": "What are symptoms of depression?",
        "a": "Depression symptoms include persistent sadness, hopelessness, loss of interest in activities, appetite changes, sleep disruption, fatigue, difficulty concentrating, and in severe cases, thoughts of self-harm. Please seek a mental health professional or call a crisis helpline."
    },
    {
        "q": "I have a fever. What should I do?",
        "a": "Rest and stay hydrated. Take paracetamol or ibuprofen as directed to reduce fever. Monitor temperature — seek care if fever exceeds 39.5°C (103°F), lasts more than 3 days, or is accompanied by stiff neck, rash, or difficulty breathing."
    },
    {
        "q": "What causes shortness of breath?",
        "a": "Shortness of breath can be caused by asthma, COPD, heart failure, anaemia, anxiety, pneumonia, pulmonary embolism, or COVID-19. Sudden severe breathlessness is a medical emergency — seek immediate care."
    },
]

# Emergency keyword patterns
EMERGENCY_PATTERNS = [
    r"\b(heart attack|cardiac arrest|stroke|can'?t breathe|chest pain|unconscious|"
    r"anaphylaxis|severe allergic|bleeding heavily|overdose|seizure|emergency)\b"
]


class MedicalChatEngine:
    """Semantic medical Q&A chatbot using NLTK + sentence-transformers + FAISS."""

    def __init__(self):
        self._embedder = None
        self._index = None
        self._answers: list[str] = []
        self._loaded = False

    def load(self) -> bool:
        """Build FAISS index from FAQ embeddings. Returns True if successful."""
        try:
            _ensure_nltk()
            from sentence_transformers import SentenceTransformer
            import faiss
            import numpy as np

            logger.info("Loading sentence-transformers model for chat engine …")
            self._embedder = SentenceTransformer("all-MiniLM-L6-v2")

            questions = [item["q"] for item in MEDICAL_FAQ]
            self._answers = [item["a"] for item in MEDICAL_FAQ]

            logger.info("Encoding %d FAQ entries …", len(questions))
            embeddings = self._embedder.encode(questions, convert_to_numpy=True)

            dim = embeddings.shape[1]
            self._index = faiss.IndexFlatIP(dim)  # Inner-product (cosine on normalized)
            faiss.normalize_L2(embeddings)
            self._index.add(embeddings)

            self._loaded = True
            logger.info("Chat engine loaded with %d Q&A entries.", len(self._answers))
            return True
        except Exception as e:
            logger.error("Failed to load chat engine: %s", e)
            return False

    def respond(self, message: str) -> str:
        """Generate a response to the user's health query."""
        # Check for emergencies first
        if self._is_emergency(message):
            return (
                "[EMERGENCY] This sounds like a medical emergency. "
                "Please call your local emergency services (911 / 999 / 112) immediately. "
                "Do not wait. If you are experiencing chest pain, difficulty breathing, "
                "loss of consciousness, or severe bleeding — call for help now."
            )

        if self._loaded:
            return self._semantic_respond(message)
        return self._keyword_respond(message)

    def _is_emergency(self, text: str) -> bool:
        text_lower = text.lower()
        for pattern in EMERGENCY_PATTERNS:
            if re.search(pattern, text_lower):
                return True
        return False

    def _semantic_respond(self, message: str) -> str:
        import faiss
        import numpy as np

        query_vec = self._embedder.encode([message], convert_to_numpy=True)
        faiss.normalize_L2(query_vec)
        scores, indices = self._index.search(query_vec, k=1)

        score = float(scores[0][0])
        idx   = int(indices[0][0])

        if score < 0.50:
            # Low confidence — fall back to keyword rules instead of guessing wildly
            return self._keyword_respond(message)

        return (
            f"{self._answers[idx]}\n\n"
            "[Note] This information is for educational purposes only and does not "
            "constitute medical advice. Always consult a qualified healthcare provider."
        )

    def _keyword_respond(self, message: str) -> str:
        msg = message.lower()
        if any(w in msg for w in ["symptom", "feel", "pain", "hurt", "ache"]):
            return (
                "I understand you're experiencing discomfort. Could you describe your "
                "symptoms in more detail? For example, where the pain is, how long it's "
                "been present, and whether anything makes it better or worse."
            )
        if any(w in msg for w in ["medicine", "medication", "drug", "dose", "tablet"]):
            return (
                "For medication advice, please consult your pharmacist or physician. "
                "I can provide general health information but cannot prescribe medications."
            )
        if any(w in msg for w in ["diabetes", "sugar", "glucose", "insulin"]):
            return (
                "Diabetes management involves monitoring blood glucose, a healthy diet, "
                "regular exercise, and medication as prescribed. Consult an endocrinologist "
                "for personalised care."
            )
        return self._general_response(message)

    def _general_response(self, message: str) -> str:
        return (
            "I'm your HealthCopilot AI assistant. I can help answer general health questions, "
            "provide information about symptoms and conditions, and guide you to the right "
            "specialist. Could you please describe your health concern in more detail?\n\n"
            "[Note] This is not a substitute for professional medical advice."
        )


# Singleton instance
chat_engine = MedicalChatEngine()
