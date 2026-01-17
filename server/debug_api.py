import httpx
import asyncio
import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

async def test():
    # Strategy: "Agentic Search"
    # 1. Search Google/Tavily for "polymarket lebron james"
    # 2. Extract slugs from URLs
    # 3. Fetch from Gamma
    
    query = "polymarket event LeBron James"
    print(f"Searching Tavily for: {query}")
    
    tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    results = tavily.search(query=query, search_depth="basic", max_results=5)
    
    slugs = []
    for r in results.get("results", []):
        url = r.get("url", "")
        if "polymarket.com/event/" in url:
            # Extract slug: https://polymarket.com/event/slug-name?tid=...
            parts = url.split("polymarket.com/event/")
            if len(parts) > 1:
                slug = parts[1].split("?")[0].split("/")[0]
                slugs.append(slug)
                print(f"Found Slug: {slug}")

    if not slugs:
        print("No slugs found via Tavily.")
        return

    # Verify with Gamma
    async with httpx.AsyncClient() as client:
        for slug in slugs:
            url = f"https://gamma-api.polymarket.com/events?slug={slug}"
            print(f"Fetching Gamma: {url}")
            resp = await client.get(url)
            data = resp.json()
            if data:
                print(f"✅ FOUND market via slug! Title: {data[0].get('title')}")
            else:
                print("❌ Slug not found in Gamma")

if __name__ == "__main__":
    asyncio.run(test())
