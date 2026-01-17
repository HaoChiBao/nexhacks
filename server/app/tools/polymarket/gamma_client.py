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
        # Strategy:
        # 1. Try specific query first (cheap)
        # 2. If 0 results, fetch "Firehose" (top 100 active events) and filter locally
        
        # Attempt 1: Specific Query
        query = " ".join(keywords)
        params = {"limit": limit, "q": query, "closed": "false"}
        if tags:
            params["tag"] = tags

        try:
            resp = await client.get(f"{BASE_URL}/events", params=params)
            resp.raise_for_status()
            data = resp.json()
            
            # Helper to process events
            def process_events(event_list):
                found = []
                for event in event_list:
                    slug = event.get("slug")
                    title = event.get("title")
                    if event.get("markets"):
                        for m in event["markets"]:
                            m["event_slug"] = slug
                            m["event_title"] = title
                            
                            # Strict Relevance Check
                            # Check against both Event Title and Market Question
                            text_corpus = (m.get("question", "") + " " + (title or "")).lower()
                            if any(k.lower() in text_corpus for k in keywords):
                                found.append(m)
                return found

            markets = process_events(data)
            
            # Attempt 2: Firehose if Attempt 1 failed
            if not markets:
                print(f"--- [Gamma Client] ⚠️ Query '{query}' returned 0 results. Switching to Firehose (Top 500)...")
                # Fetch top 500 trending/active events
                firehose_params = {"limit": 500, "closed": "false", "order": "volume24hr"}
                if tags:
                    firehose_params["tag"] = tags
                
                resp = await client.get(f"{BASE_URL}/events", params=firehose_params)
                resp.raise_for_status()
                firehose_data = resp.json()
                markets = process_events(firehose_data)

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
