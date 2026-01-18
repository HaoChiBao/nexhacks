from fastapi import APIRouter, HTTPException
import os
from supabase import create_client, Client

router = APIRouter()

def get_supabase() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase credentials not configured")
    return create_client(url, key)

@router.get("/{user_id}/profile")
def get_user_profile(user_id: str):
    """
    Fetch a user's profile (balance, portfolio) by ID.
    Used for AuthProvider and PortfolioPage.
    """
    try:
        supabase = get_supabase()
        
        # 1. Fetch from 'profiles' table (Primary Source)
        res = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        
        if not res.data:
             raise HTTPException(status_code=404, detail="Profile not found")
             
        profile = res.data
        
        # 2. Portfolio Parsing & Normalization
        # The 'portfolio' column might be a JSONB (list/dict) or Text (string).
        # We ensure it's returned as a usable list.
        import json
        
        raw_portfolio = profile.get("portfolio")
        
        if isinstance(raw_portfolio, str):
            try:
                # Attempt to parse stringified JSON
                raw_portfolio = json.loads(raw_portfolio)
            except json.JSONDecodeError:
                raw_portfolio = []
        
        final_portfolio_list = []
        
        # Handle dict format (legacy) vs list format
        if isinstance(raw_portfolio, dict):
            final_portfolio_list = raw_portfolio.get("funds", [])
        elif isinstance(raw_portfolio, list):
            final_portfolio_list = raw_portfolio
        
        # 3. Enrichment from 'user_funds' (Source of Truth for Investments)
        # We prefer data from the 'user_funds' table if available, as it tracks performance.
        try:
            inv_res = supabase.table("user_funds").select("*").eq("user_id", user_id).execute()
            if inv_res.data:
                enriched_investments = []
                for row in inv_res.data:
                    # Filter for actual investments
                    if float(row.get("invested_amount", 0)) > 0:
                        enriched_investments.append({
                            "fund_id": row.get("fund_id"),
                            "fundName": row.get("name"), # Map for frontend
                            "fundCategory": "Active",    # Default category
                            "investedPm": float(row.get("invested_amount", 0)),
                            "currentNavPm": float(row.get("current_value") or row.get("invested_amount", 0)),
                            "return30dPct": float(row.get("pnl_percent") or 0),
                            "topMarkets": [] # Could fetch these if needed
                        })
                
                if enriched_investments:
                    final_portfolio_list = enriched_investments
                    
        except Exception as e:
            print(f"Warning: Could not fetch user_funds enrichment: {e}")

        # Update the profile object with the clean portfolio list
        profile["portfolio"] = final_portfolio_list
        
        # Data Mapping for Frontend Convention (CamelCase / Specific Keys)
        # The frontend expects 'avatarUrl' but DB has 'avatar_url'
        # We can transform it here or in frontend. Let's provide both or transform.
        profile["avatarUrl"] = profile.get("avatar_url", "")
        profile["name"] = profile.get("full_name", profile.get("email", "User"))
        profile["handle"] = profile.get("email", "").split("@")[0] # Simple handle derivation

        return profile

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))
