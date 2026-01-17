import httpx
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()
BASE_URL = os.getenv("POLYMARKET_API_URL", "https://gamma-api.polymarket.com")

async def fetch_markets(
    keywords: List[str],
    limit: int = 20,
    tags: Optional[str] = None
) -> List[Dict]:
    """
    Fetch markets from Polymarket Gamma API based on keywords (query).
    """
    markets = []
    async with httpx.AsyncClient() as client:
        # We'll try searching for each keyword or just the first one to keep it simple
        # In a real app we might combine them or parallelize
        query = " ".join(keywords)
        params = {
            "limit": limit,
            "q": query,
            "closed": "false"
        }
        if tags:
            params["tag"] = tags

        try:
            resp = await client.get(f"{BASE_URL}/events", params=params)
            resp.raise_for_status()
            data = resp.json()
            # Gamma returns a list of events. We need to extract markets.
            # Simplified for this scaffold: just taking the first market of each event
            # Gamma API search is fuzzy/broken, often returning trending items.
            # We MUST filter client-side to ensure relevance.
            for event in data:
                slug = event.get("slug")
                title = event.get("title")
                if event.get("markets"):
                    for m in event["markets"]:
                        # Inject parent event slug and title
                        m["event_slug"] = slug
                        m["event_title"] = title
                        
                        # Client-side Relevance Check
                        question_text = m.get("question", "").lower()
                        # Check if ANY keyword matches
                        if any(k.lower() in question_text for k in keywords):
                            markets.append(m)
        except Exception as e:
            print(f"Error fetching markets: {e}")
            return []

    return markets

async def fetch_market_by_id(market_id: str) -> Optional[Dict]:
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"{BASE_URL}/markets/{market_id}")
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"Error fetching market {market_id}: {e}")
            return None

async def fetch_event_by_slug(slug: str) -> List[Dict]:
    """
    Fetch markets for a given event slug.
    """
    markets = []
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"{BASE_URL}/events", params={"slug": slug})
            resp.raise_for_status()
            data = resp.json()
            for event in data:
                slug = event.get("slug")
                if event.get("markets"):
                    for m in event["markets"]:
                        m["event_slug"] = slug
                        markets.append(m)
        except Exception as e:
            print(f"Error fetching event {slug}: {e}")
    return markets
