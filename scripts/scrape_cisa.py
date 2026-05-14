import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from pathlib import Path

URL = "https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks"

response = requests.get(URL)

if response.status_code != 200:
    print("Failed to fetch page")
    exit()

soup = BeautifulSoup(response.text, "lxml")

# Remove useless tags
for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
    tag.decompose()

# Convert HTML to markdown-ish clean text
clean_text = md(str(soup))

# Clean excessive blank lines
clean_text = "\n".join(
    line.strip() for line in clean_text.splitlines() if line.strip()
)

output_path = Path("data/CISA/raw/cisa_phishing.txt")
output_path.parent.mkdir(parents=True, exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    f.write(clean_text)

print(f"Saved cleaned text to {output_path}")