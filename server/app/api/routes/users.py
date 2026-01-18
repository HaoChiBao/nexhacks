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
             
        return res.data
    except Exception as e:
        # Supabase-py might raise specific errors for no rows
        print(f"Error fetching profile: {e}")
        # If it's a "row not found", return 404
        if "PGRST116" in str(e) or "Results contain 0 rows" in str(e):
             raise HTTPException(status_code=404, detail="Profile not found")
        raise HTTPException(status_code=500, detail=str(e))
