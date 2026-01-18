from typing import List, Dict, Any, Optional
from supabase import Client
from app.utils.ids import generate_id
import math

def normalize_holdings(holdings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Validates and normalizes holdings.
    - Ensures total weight is 100%.
    - Add canonical URL if missing.
    - Preserves Polymarket fields.
    """
    if not holdings:
        return []

    # 1. Total Weight Normalization
    total_target = sum(h.get("targetWeight", 0) for h in holdings)
    if total_target <= 0:
        total_target = 100 # Avoid div by zero

    normalized = []
    running_sum = 0
    
    for i, h in enumerate(holdings):
        # Calculate raw percentage
        raw_pct = (h.get("targetWeight", 0) / total_target) * 100
        
        # Round to 2 decimals
        weight_pct = round(raw_pct, 2)
        
        # Adjust last item to ensure sum is exactly 100
        if i == len(holdings) - 1:
            weight_pct = round(100 - running_sum, 2)
        
        running_sum += weight_pct

        # 2. Build canonical URL if missing
        url = h.get("url")
        slug = h.get("slug")
        if not url and slug:
            url = f"https://polymarket.com/market/{slug}"
        elif not url:
             # Fallback if no slug (shouldn't happen based on requirements, but safe guard)
             url = "https://polymarket.com"

        # 3. Construct Normalized Object (preserving numeric fields)
        # 3. Construct Normalized Object (preserving numeric fields)
        # Mapping to target schema:
        # ticker, prob, side, expiry, rationale, allocation, description, name
        
        question = h.get("question")
        
        # Generate Ticker (e.g. "NFLX-JAN")
        ticker = h.get("ticker")
        if not ticker and slug:
             parts = slug.split("-")
             if len(parts) > 0:
                 ticker = parts[0].upper()
                 if len(parts) > 1:
                     ticker += f"-{parts[-1][:3].upper()}"
        if not ticker:
            ticker = "POLY"

        # Probability (0-100)
        prob = h.get("prob")
        if prob is None:
             last_price = h.get("lastPrice")
             if last_price is not None:
                 prob = round(last_price * 100, 1) if last_price <= 1 else last_price
             else:
                 prob = 50 # Default

        expiry = h.get("expiryDate") or h.get("expiry")
        # Format expiry if needed (e.g. "Dec 31") - keeping ISO for now/or raw string is fine
        
        norm_item = {
            "marketId": h.get("id") or h.get("marketId"),
            "slug": slug,
            "question": question,
            "outcome": h.get("outcome"),
            "source": "Polymarket",
            "url": url,
            "targetWeight": h.get("targetWeight", 0),
            "weightPct": weight_pct,
            
            # Target Schema Fields
            "name": h.get("name") or question, # Name often maps to question in raw data
            "ticker": ticker,
            "prob": prob,
            "side": h.get("outcome") or h.get("side"),
            "expiry": expiry,
            "rationale": h.get("reasoning") or h.get("rationale"),
            "allocation": h.get("targetWeight", 0), # Redundant but requested
            "description": question, # Description maps to question
            
            # Raw/Extra Fields
            "lastPrice": h.get("lastPrice"),
            "liquidity": h.get("liquidity"),
            "marketVolume": h.get("volume"), 
            "expiryDate": expiry,
            "asset_id": h.get("asset_id"),
            "meta": h.get("meta", {})
        }
        normalized.append(norm_item)

    return normalized

def generate_unique_fund_id(supabase: Client) -> str:
    """Generate a unique ID checking against database collisions."""
    for _ in range(5):
        new_id = generate_id(12)
        # Check collision
        res = supabase.table("funds").select("id").eq("id", new_id).execute()
        if not res.data:
            return new_id
    raise Exception("Failed to generate unique fund ID after 5 attempts")

def create_fund_draft(supabase: Client, fund_data: Dict[str, Any]) -> str:
    """Inserts the initial fund draft into Supabase."""
    response = supabase.table("funds").insert(fund_data).execute()
    # supabase-py v2 returns response with .data on success
    return fund_data["id"]

def patch_fund_metadata(supabase: Client, fund_id: str, metadata: Dict[str, Any]):
    """Updates the fund with enriched metadata."""
    if not metadata:
        return
    supabase.table("funds").update(metadata).eq("id", fund_id).execute()
