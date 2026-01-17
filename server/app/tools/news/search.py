import os
from typing import List, Dict
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

# If no key is present, it will eventually error or we handle gracefully
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

async def search_news(query: str, max_results: int = 5) -> List[Dict]:
    """
    Search for news articles using Tavily API.
    Returns a list of {url, content, title, score}.
    """
    if not TAVILY_API_KEY or "placeholder" in TAVILY_API_KEY:
        print("WARNING: No valid TAVILY_API_KEY found. Returning empty news.")
        return []

    try:
        # Tavily python client is synchronous by default, or we can use the async one if available.
        # For simplicity in this scaffold we'll use the sync client but wrap it or just call it.
        # In a high-concurrency app, run this in a threadpool.
        client = TavilyClient(api_key=TAVILY_API_KEY)
        response = client.search(query=query, search_depth="basic", max_results=max_results)
        return response.get("results", [])
    except Exception as e:
        print(f"Error searching news: {e}")
        return []
