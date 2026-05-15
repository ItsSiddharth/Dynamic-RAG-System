import requests
from config import *


def build_citation_block(retrieved_chunks):

    citations = []

    for idx, chunk in enumerate(retrieved_chunks):

        citations.append(
            f"[Source {idx+1}] "
            f"Collection: {chunk['collection']} | "
            f"Topic: {chunk.get('topic', 'N/A')} | "
            f"Score: {chunk['retrieval_score']:.4f}"
        )

    return "\n".join(citations)


def generate_answer(query, retrieved_chunks):

    context = "\n\n".join(
        chunk["text"]
        for chunk in retrieved_chunks
    )

    citation_block = build_citation_block(
        retrieved_chunks
    )

    prompt = f"""
        You are a cybersecurity assistant.

        Use ONLY the provided context.

        If insufficient information exists, say:
        "I could not find sufficient information."

        Requirements:
        - concise
        - actionable
        - cybersecurity-focused
        - professional
        - no hallucinations
        - cite sources when relevant

        ================ SOURCES ================

        {citation_block}

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