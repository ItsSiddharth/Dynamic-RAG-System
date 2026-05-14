import requests
from bs4 import BeautifulSoup
from pathlib import Path
import json

BASE_URL = "https://www.cisa.gov"

NEWS_URL = "https://www.cisa.gov/news-events/news"

response = requests.get(NEWS_URL)

soup = BeautifulSoup(response.text, "lxml")

links = []

for a in soup.find_all("a", href=True):
    href = a["href"]

    # Filter news article links
    if href.startswith("/news-events/news/"):
        full_url = BASE_URL + href

        if full_url not in links:
            links.append(full_url)

# output_path = Path("data/cisa_links.json")

# with open(output_path, "w") as f:
#     json.dump(links, f, indent=2)
print(links)
print(f"Found {len(links)} links")