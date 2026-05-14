from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient

model = SentenceTransformer("BAAI/bge-large-en-v1.5")

client = QdrantClient(path="./qdrant_data")

COLLECTION_NAME = "cybersecurity_knowledge"

query = "How should organizations defend against phishing attacks?"

query_embedding = model.encode(query).tolist()

results = client.query_points(
    collection_name=COLLECTION_NAME,
    query=query_embedding,  # renamed from query_vector
    limit=3,
).points  # .points is needed because query_points returns a wrapper object

print("\nTOP RETRIEVED CHUNKS\n")

# Iterate through the returned points
for idx, result in enumerate(results, start=1):
    print("=" * 80)
    print(f"Rank #{idx}")
    print(f"Score: {result.score:.4f}")
    print(f"Source: {result.payload['source']}")
    print()
    print(result.payload["text"])
    print()

client.close()