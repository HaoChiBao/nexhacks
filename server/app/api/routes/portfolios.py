from fastapi import APIRouter, HTTPException, Depends
from app.services.portfolio_registry import registry
from pydantic import BaseModel
import os
from supabase import create_client, Client
from typing import Dict, Any, Optional

router = APIRouter()

# Initialize Supabase client
def get_supabase() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase credentials not configured on server")
    return create_client(url, key)

class InvestRequest(BaseModel):
    fund_id: str
    amount: float
    user_id: str
    fund_name: str
    fund_logo: Optional[str] = ""

@router.get("/")
def list_portfolios():
    return registry.list_all()

@router.get("/{portfolio_id}")
def get_portfolio(portfolio_id: str):
    p = registry.get(portfolio_id)
    if not p:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return p

@router.post("/invest")
def invest_in_fund(req: InvestRequest):
    try:
        supabase = get_supabase()
        
        # 1. Fetch current profile
        res = supabase.table("profiles").select("*").eq("id", req.user_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="User profile not found")
            
        profile = res.data[0]
        current_balance = float(profile.get("balance", 0))
        
        # 2. Check Balance
        if current_balance < req.amount:
             raise HTTPException(status_code=400, detail="Insufficient balance")
             
        # 3. Update Portfolio
        # 3. Update Portfolio
        raw_portfolio = profile.get("portfolio")
        
        # Handle cases where portfolio might be initialized as a list or None
        if raw_portfolio is None:
            portfolio = {"funds": []}
        elif isinstance(raw_portfolio, list):
            portfolio = {"funds": raw_portfolio}
        elif isinstance(raw_portfolio, dict):
            portfolio = raw_portfolio
        else:
            # Fallback for unexpected types
            portfolio = {"funds": []}

        funds = portfolio.get("funds", [])
        if not isinstance(funds, list):
            funds = []
        
        # Check if already invested
        # Use .get("id") to safer access in case of malformed data in DB
        existing_idx = next((i for i, f in enumerate(funds) if isinstance(f, dict) and f.get("id") == req.fund_id), -1)
        
        if existing_idx >= 0:
            # Update existing position
            funds[existing_idx]["invested_amount"] = funds[existing_idx].get("invested_amount", 0) + req.amount
            funds[existing_idx]["current_value"] = funds[existing_idx].get("current_value", 0) + req.amount # Simplified
        else:
            # Add new position
            funds.append({
                "id": req.fund_id,
                "name": req.fund_name,
                "logo": req.fund_logo or "", 
                "invested_amount": req.amount,
                "current_value": req.amount,
                "shares": req.amount / 10.0, 
                "invested_at": "Today" 
            })
            
        portfolio["funds"] = funds
        new_balance = current_balance - req.amount
        
        # 4. Save updates to Profile
        update_res = supabase.table("profiles").update({
            "balance": new_balance,
            "portfolio": portfolio
        }).eq("id", req.user_id).execute()

        # 5. Update Fund Volume/AUM (Increment)
        # We need to fetch current volume first to add to it, or use flexible RPC if available.
        # For simplicity/speed, we fetch-and-update. 
        # Ideally this would be a Postgres function/RPC for atomicity: increment_fund_volume(id, amount)
        
        fund_res = supabase.table("funds").select("volume, aum").eq("id", req.fund_id).execute()
        if fund_res.data:
            current_volume = float(fund_res.data[0].get("volume") or 0)
            current_aum = float(fund_res.data[0].get("aum") or 0)
            
            supabase.table("funds").update({
                "volume": current_volume + req.amount,
                "aum": current_aum + req.amount
            }).eq("id", req.fund_id).execute()
        
        return {"status": "success", "new_balance": new_balance, "portfolio": portfolio}

    except Exception as e:
        print(f"Investment error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
