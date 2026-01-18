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
        res = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        
        # If no profile found, we could return 404, but frontend handles nulls.
        # However, for API consistency:
        if not res.data:
             # Try creating one? Or let frontend handle?
             # Based on previous logic, frontend was handling creation. 
             # Ideally backend handles it too. Let's return 404 and let frontend or logic decide.
             # Actually, let's replicate the "Self-Healing" logic here?
             # No, strictly fetch for now.
             raise HTTPException(status_code=404, detail="Profile not found")
             
        # Fetch investments from user_funds table (New Source of Truth)
        try:
            # We try to fetch rows that look like investments (have invested_amount > 0)
            # Checking columns: fund_id, invested_amount, name
            # Note: The database schema might not have these columns if migration wasn't run.
            # We select * to get whatever is there.
            inv_res = supabase.table("user_funds").select("*").eq("user_id", user_id).execute()
            
            if inv_res.data:
                investments = []
                for row in inv_res.data:
                    # Filter for investments (heuristic: has fund_id and amount)
                    if row.get("fund_id") and float(row.get("invested_amount", 0)) > 0:
                        investments.append({
                            "id": row.get("fund_id"), # Link to public fund
                            "fund_id": row.get("fund_id"),
                            "name": row.get("name"),
                            "invested_amount": float(row.get("invested_amount", 0)),
                            "current_value": float(row.get("current_value") or row.get("invested_amount", 0)),
                            "invested_at": row.get("created_at"),
                            "pnl_percent": 0 # TODO: Calculate real PnL
                        })
                
                # If we found investments in user_funds, they take precedence over the JSON blob
                if investments:
                    # Merge or Replace? User asked to "pull user data based on signed in user"
                    # implying the table data is what matters.
                    # We'll set it as the primary list.
                    profile_data = res.data
                    if not profile_data.get("portfolio"):
                        profile_data["portfolio"] = []
                    
                    # If portfolio is dict {funds: []}, handle that
                    if isinstance(profile_data["portfolio"], dict):
                         profile_data["portfolio"]["funds"] = investments
                    else:
                         profile_data["portfolio"] = investments # List format
                         
                    return profile_data

        except Exception as e:
            # Schema might strictly fail if columns don't exist? Supabase-py select('*') might succeed but return subset?
            # If it fails, strictly fall back to profile['portfolio'] (legacy)
            print(f"Warning: Could not fetch user_funds investments: {e}")

        return res.data
    except Exception as e:
        # Supabase-py might raise specific errors for no rows
        print(f"Error fetching profile: {e}")
        # If it's a "row not found", return 404
        if "PGRST116" in str(e) or "Results contain 0 rows" in str(e):
             raise HTTPException(status_code=404, detail="Profile not found")
        raise HTTPException(status_code=500, detail=str(e))
