import requests
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient

OLLAMA_URL = "http://localhost:11434/api/chat"

COLLECTION_NAME = "cybersecurity_knowledge"

model = SentenceTransformer("BAAI/bge-large-en-v1.5")

client = QdrantClient(path="./qdrant_data")

query = "Define a phishing attack."

# Retrieve relevant chunks
query_embedding = model.encode(query).tolist()

results = client.query_points(
    collection_name=COLLECTION_NAME,
    query=query_embedding,
    limit=3,
).points

context = "\n\n".join(
    r.payload["text"]
    for r in results
)

print(f"Retrieved Context is: {context}")

prompt = f"""
You are a cybersecurity assistant.

Use ONLY the provided context to answer the user's question.

If the context does not contain the answer, say:
"I could not find sufficient information."

Provide concise and actionable cybersecurity guidelines.

CONTEXT:
{context}

QUESTION:
{query}
"""

payload = {
    "model": "gemma3:12b-it-qat",
    "messages": [
        {
            "role": "user",
            "content": prompt
        }
    ],
    "stream": False
}

response = requests.post(OLLAMA_URL, json=payload)

data = response.json()

print("\nGENERATED ANSWER\n")
print(data["message"]["content"])
client.close()