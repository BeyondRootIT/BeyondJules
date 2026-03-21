import feedparser
import trafilatura
import google.generativeai as genai
import json
import os
from datetime import datetime
import hashlib
import time

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "DUMMY_KEY_FOR_BUILD"))

def fetch_rss_feeds(urls):
    articles = []
    for url in urls:
        print(f"Fetching {url}")
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:3]: # Take top 3 from each feed to limit API calls/time
                articles.append({
                    "title": entry.title,
                    "link": entry.link,
                    "published": entry.get("published", datetime.now().strftime("%Y-%m-%d"))
                })
        except Exception as e:
            print(f"Error fetching feed {url}: {e}")
    return articles

def extract_text(url):
    print(f"Extracting text from {url}")
    try:
        downloaded = trafilatura.fetch_url(url)
        if downloaded:
            text = trafilatura.extract(downloaded)
            return text
    except Exception as e:
        print(f"Error extracting text from {url}: {e}")
    return None

def summarize_events(articles_with_text):
    # This is a mock function for the build to succeed if API key is invalid
    events = []
    try:
        if os.environ.get("GEMINI_API_KEY") and os.environ.get("GEMINI_API_KEY") != "DUMMY_KEY_FOR_BUILD":
            model = genai.GenerativeModel('gemini-1.5-pro-latest')
            prompt = f"Group the following cybersecurity news articles (including their full text) into unique events. For each event, provide a 2 sentence summary. Return the result strictly as a JSON array of objects with keys 'title', 'summary', and 'sources' (array of links). Articles: \n\n {json.dumps(articles_with_text)}"
            response = model.generate_content(prompt)

            content = response.text.strip()
            if content.startswith("```json"):
                content = content[7:-3]
            events = json.loads(content)
        else:
            raise Exception("No real API key")
    except Exception as e:
        print(f"Using fallback summary generation due to: {e}")
        # Fallback if Gemini fails or is not configured
        for i, article in enumerate(articles_with_text[:3]):
            events.append({
                "id": hashlib.md5(article['title'].encode()).hexdigest(),
                "title": article['title'],
                "date": article['published'],
                "summary": "Automated summary generation disabled or failed. " + (article.get('title', '')),
                "sources": [article['link']]
            })
    return events

if __name__ == "__main__":
    rss_feeds = [
        "https://feeds.feedburner.com/TheHackersNews",
        "https://www.bleepingcomputer.com/feed/"
    ]

    articles = fetch_rss_feeds(rss_feeds)
    print(f"Found {len(articles)} articles from feeds.")

    # Extract text for each article
    articles_with_text = []
    for article in articles:
        text = extract_text(article['link'])
        # Limit text length to avoid token limits on Gemini
        article['text'] = text[:2000] if text else "Content could not be extracted."
        articles_with_text.append(article)
        time.sleep(1) # Be polite

    events = summarize_events(articles_with_text)

    # Ensure ID and Date are present
    for idx, event in enumerate(events):
        if 'id' not in event:
            event['id'] = f"evt_{idx}"
        if 'date' not in event:
            event['date'] = datetime.now().strftime("%Y-%m-%d")

    os.makedirs('src/data', exist_ok=True)
    with open('src/data/events.json', 'w') as f:
        json.dump(events, f, indent=2)
    print("Events saved to src/data/events.json")
