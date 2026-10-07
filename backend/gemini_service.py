import os
from typing import Optional

SYSTEM_CONTEXT = """
You are the educational assistant inside DermaAI, a skin-lesion classification
research/education prototype using the HAM10000 label set. Do not diagnose,
prescribe medication, or claim that an AI prediction confirms a disease.
Explain results in plain language, mention uncertainty, and advise professional
dermatology evaluation when a lesion is concerning, changing, bleeding, painful,
or otherwise worrying.
"""

def _client():
    key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not key:
        return None
    from google import genai
    return genai.Client(api_key=key)

def explain(predicted_class: str, full_name: str, confidence: float, language: str = "English") -> str:
    client = _client()
    if client is None:
        return (
            f"Educational context: the model's highest-scoring class is "
            f"{full_name} ({confidence:.1%}). This is not a diagnosis. "
            "A dermatologist should assess any persistent or concerning lesion."
        )

    prompt = f"""
{SYSTEM_CONTEXT}
Give a concise educational explanation for:
Predicted class: {full_name} ({predicted_class})
Model confidence: {confidence:.1%}
Language: {language}

Include:
1. What the class generally refers to.
2. Common visible/contextual features.
3. General warning signs that should prompt medical review.
4. What a dermatologist may consider for evaluation.
5. Safe next steps.

Do not give a medication prescription or say the user has the disease.
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return getattr(response, "text", None) or "No educational explanation was returned."

def answer(
    question: str,
    predicted_class: str,
    full_name: str,
    confidence: float,
    language: str = "English",
) -> str:
    client = _client()
    if client is None:
        return (
            "Gemini is not configured. Add GEMINI_API_KEY to the environment. "
            "For medical decisions, consult a qualified dermatologist."
        )

    prompt = f"""
{SYSTEM_CONTEXT}
Answer this user's educational question:
{question}

Context:
Predicted class: {full_name} ({predicted_class})
Confidence: {confidence:.1%}
Language: {language}

Keep the answer practical and concise. Do not diagnose or prescribe.
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return getattr(response, "text", None) or "No answer was returned."
