import httpx
import os
from typing import Dict, Optional

CLOB_URL = os.getenv("CLOB_API_URL", "https://clob.polymarket.com")

async def fetch_orderbook(token_id: str) -> Optional[Dict]:
    """
    Fetch top of book to calculate spread and liquidity.
    """
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"{CLOB_URL}/book", params={"token_id": token_id})
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"Error fetching orderbook for {token_id}: {e}")
            return None
