import asyncio
from app.tools.polymarket.gamma_client import fetch_event_by_slug

async def main():
    slug = "epl-which-clubs-get-relegated"
    print(f"Fetching markets for slug: {slug}")
    markets = await fetch_event_by_slug(slug)
    
    found = False
    for m in markets:
        # Look for Man City market
        q = m.get("question", "")
        if "Man City" in q:
            found = True
            print(f"\n--- Market Found: {q} ---")
            print(f"ID: {m.get('id')}")
            print(f"Outcomes: {m.get('outcomes')}")
            print(f"Outcome Prices: {m.get('outcomePrices')}")
            
            # Simulate our sizing logic
            import json
            raw_prices = m.get("outcomePrices")
            if isinstance(raw_prices, str):
                prices = json.loads(raw_prices)
            else:
                prices = raw_prices
            
            print(f"Parsed Prices: {prices}")
            if len(prices) >= 2:
                print(f"YES Price: {float(prices[0]) if prices[0] else 0}")
                print(f"NO Price: {float(prices[1]) if prices[1] else 0}")

    if not found:
        print("Man City market not found in this event slug.")

if __name__ == "__main__":
    asyncio.run(main())
