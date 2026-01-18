import httpx
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
BASE_URL = os.getenv("POLYMARKET_API_URL", "https://gamma-api.polymarket.com")

async def test_tags():
    async with httpx.AsyncClient() as client:
        # 1. Try fetching by slug
        print("--- Testing /tags?slug=nba ---")
        try:
            resp = await client.get(f"{BASE_URL}/tags", params={"slug": "nba"})
            print(f"Status: {resp.status_code}")
            print(f"Data: {resp.json()}")
        except Exception as e:
            print(f"Error: {e}")

        # 2. Try fetching by label? (Unlikely but worth a shot)
        print("\n--- Testing /tags?label=NBA ---")
        try:
            resp = await client.get(f"{BASE_URL}/tags", params={"label": "NBA"})
            print(f"Status: {resp.status_code}")
            print(f"Response (first 200 chars): {str(resp.json())[:200]}")
        except Exception as e:
            print(f"Error: {e}")

        # 3. Targeted Scan for Stocks / Finance
        print("\n--- Scanning for Stocks & Finance ---")
        targets = [
            # General
            "stocks", "stock market", "finance", "economy", "economics", "investing", "ipo",
            # Indices
            "sp500", "s&p 500", "nasdaq", "dow jones",
            # Major Tickers / Companies
            "nvidia", "nvda", "tesla", "tsla", "apple", "aapl", 
            "microsoft", "msft", "amazon", "amzn", "google", "goog", "alphabet",
            "meta", "facebook", "netflix", "nflx",
            "gamestop", "gme", "amc", "coinbase", "coin"
        ]
        found_map = {}
        
        for offset in range(0, 3000, 100):
            try:
                # print(f"Fetching offset {offset}...")
                resp = await client.get(f"{BASE_URL}/tags", params={"limit": 100, "offset": offset})
                data = resp.json()
                if not data:
                    break
                
                for t in data:
                    slug = t.get("slug", "").lower()
                    label = t.get("label", "").lower()
                    for target in targets:
                        if target == slug or target == label: # Exact match preferred
                            found_map[target] = t
                        elif target in slug: # Partial backup
                            if target not in found_map: # Don't overwrite exact match
                                found_map[f"{target}_partial"] = t

            except Exception as e:
                print(f"Error at offset {offset}: {e}")
        
        print("\n--- Found Tags ---")
        for k, v in found_map.items():
            print(f"{k}: ID={v['id']} (Slug: {v['slug']}, Label: {v['label']})")

if __name__ == "__main__":
    asyncio.run(test_tags())
