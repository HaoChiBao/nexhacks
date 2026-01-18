import httpx
import asyncio
import json

async def main():
    async with httpx.AsyncClient() as client:
        # Mimic the call in gamma_client
        params = {"limit": 10, "q": "Toronto Raptors", "closed": "false"}
        url = "https://gamma-api.polymarket.com/events"
        print(f"Fetching {url}?{params}")
        
        resp = await client.get(url, params=params)
        data = resp.json()
        
        print(f"Found {len(data)} events.")
        
        for i, event in enumerate(data):
            print(f"\n--- Event {i} ---")
            print(f"Title: {event.get('title')}")
            print(f"Slug: {event.get('slug')}")
            
            markets = event.get("markets", [])
            print(f"Markets Count: {len(markets)}")
            
            for j, m in enumerate(markets[:3]): # Show first 3 markets per event
                print(f"  > Market {j}:")
                print(f"    Question: {m.get('question')}")
                print(f"    Group Item Title: {m.get('groupItemTitle')}")
                print(f"    Outcomes: {m.get('outcomes')}")
                print(f"    Outcome Prices: {m.get('outcomePrices')}")

if __name__ == "__main__":
    asyncio.run(main())
