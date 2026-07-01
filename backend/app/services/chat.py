def generate_medical_reply(message: str) -> str:
    cleaned = message.strip()
    if not cleaned:
        return "Please describe your symptoms or question in one sentence."

    lower_message = cleaned.lower()
    if any(keyword in lower_message for keyword in ["fever", "cough", "pain", "headache", "nausea"]):
        return "I can help triage symptoms, but this is not a diagnosis. Consider a clinician if symptoms are severe or persistent."
    return "I can summarize symptoms, suggest next steps, and explain likely care paths based on the information you provide."
