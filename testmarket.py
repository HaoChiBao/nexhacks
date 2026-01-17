import requests
import time
import json
from pprint import pprint

GAMMA_API = "https://gamma-api.polymarket.com"

response = requests.get(
    f"{GAMMA_API}/markets",
    params={
        "limit": 10,
        "active": True,
        "closed": False,
        "order": "volume24hr",
        "ascending": False
    }
)
markets = response.json()
print(f"Found {len(markets)} markets\n")
for m in markets[:5]:
    print(f"Question: {m['question']}")
    print(f"  Volume 24h: ${m.get('volume24hr', 0):,.0f}")
    print(f"  Liquidity: ${m.get('liquidityNum', 0):,.0f}")
    print(f"  Prices: {m.get('outcomePrices', 'N/A')}")
    print()

market = markets[1]
market
print(f"Market: {market['question']}")
print(f"End Date: {market['endDate']}")
print(f"Condition ID: {market['conditionId']}")
clob_token_ids = market.get('clobTokenIds')
clob_token_ids = json.loads(clob_token_ids)
print(f"Token IDs: {clob_token_ids}")

if len(clob_token_ids) >= 2:
    yes_token_id = clob_token_ids[0]
    no_token_id = clob_token_ids[1]
    print(f"YES token: {yes_token_id}")
    print(f"NO token: {no_token_id}")