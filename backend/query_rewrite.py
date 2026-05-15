import requests
from config import *


def rewrite_query(user_query):

    prompt = f"""
You are a cybersecurity query rewriting assistant.

Rewrite the user's query into:
- a clearer
- retrieval-friendly
- cybersecurity-focused search query

Rules:
- Preserve meaning
- Add cybersecurity terminology if useful
- Keep it concise
- Do not answer the question

USER QUERY:
{user_query}

REWRITTEN QUERY:
"""

    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False
    }

    response = requests.post(
        OLLAMA_URL,
        json=payload
    )

    data = response.json()

    rewritten = data["message"]["content"].strip()

    return rewritten