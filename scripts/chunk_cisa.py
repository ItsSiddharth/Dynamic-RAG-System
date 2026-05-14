from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
import json

input_path = Path("data/CISA/raw/cisa_phishing_test.txt")

with open(input_path, "r", encoding="utf-8") as f:
    text = f.read()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=100,
)

chunks = splitter.split_text(text)

output = []

for idx, chunk in enumerate(chunks):
    output.append({
        "id": idx,
        "text": chunk,
        "source": "CISA",
        "topic": "phishing",
        "url": "https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks"
    })

output_path = Path("data/CISA/processed/cisa_chunks_test.json")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

print(f"Created {len(chunks)} chunks")