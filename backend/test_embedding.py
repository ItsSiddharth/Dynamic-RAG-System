from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-large-en-v1.5")

text = "How should we respond to phishing attacks?"

embedding = model.encode(text)

print(len(embedding))

# This script takes around 1.5GB to run