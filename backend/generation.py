import requests
from config import *


def generate_answer(query, retrieved_chunks):

    context = "\n\n".join(
        chunk["text"]
        for chunk in retrieved_chunks
    )

    prompt = f"""
You are a cybersecurity assistant.

Use ONLY the provided context to answer the user's question.

If the context does not contain enough information, say:
"I could not find sufficient information."

Provide:
- concise
- practical
- professional
- actionable cybersecurity guidance

Do NOT hallucinate.

================ CONTEXT ================

{context}

================ QUESTION ================

{query}

================ ANSWER ================
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

    return data["message"]["content"]