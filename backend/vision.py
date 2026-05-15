import base64
import requests
from config import *

def encode_image(image_path):

    with open(image_path, "rb") as image_file:

        return base64.b64encode(
            image_file.read()
        ).decode("utf-8")


def vision_describe(image_path):

    base64_image = encode_image(image_path)

    prompt = """
You are a cybersecurity vision assistant.

Analyze this image carefully.

The image may contain:
- phishing emails
- security alerts
- network diagrams
- logs
- screenshots
- malware indicators
- suspicious activity
- cybersecurity text

Your task:
1. Extract all relevant information, act like an OCR expert and write out whatever you can see in the image
2. Describe the image semantically
3. Produce a retrieval-friendly cybersecurity query based off of the OCR analysis you did and the semantic description
4. Be concise but detailed
5. Never make up information that is not in the image.
5. If image is not highly relevant in the cyber security context, thats fine, just describe it. But NEVER make up information.

Do NOT hallucinate.

OUTPUT FORMAT:

IMAGE_DESCRIPTION:
...

RAG_QUERY:
...
"""

    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt,
                "images": [base64_image]
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