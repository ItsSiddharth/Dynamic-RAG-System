import json
from pathlib import Path
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

# Load embedding model
model = SentenceTransformer("BAAI/bge-large-en-v1.5")

# Initialize Qdrant
client = QdrantClient(path="./qdrant_data")

COLLECTION_NAME = "cybersecurity_knowledge"

# Create collection if not exists
collections = client.get_collections().collections
existing = [c.name for c in collections]

if COLLECTION_NAME not in existing:
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=1024,
            distance=Distance.COSINE,
        ),
    )

# Load chunked data
input_path = Path("data/CISA/processed/cisa_chunks_test.json")

with open(input_path, "r", encoding="utf-8") as f:
    chunks = json.load(f)

points = []

for chunk in chunks:
    embedding = model.encode(chunk["text"]).tolist()

    points.append(
        PointStruct(
            id=chunk["id"],
            vector=embedding,
            payload={
                "text": chunk["text"],
                "source": chunk["source"],
                "topic": chunk["topic"],
                "url": chunk["url"],
            }
        )
    )

# Upload to Qdrant
client.upsert(
    collection_name=COLLECTION_NAME,
    points=points
)

print(f"Inserted {len(points)} chunks into Qdrant")
client.close()