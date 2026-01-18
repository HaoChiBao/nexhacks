from fastapi import APIRouter, HTTPException, Depends
from app.services.portfolio_registry import registry
from pydantic import BaseModel
import os
from supabase import create_client, Client
from typing import Dict, Any

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
    fund_logo: str = "" # Optional

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
        portfolio = profile.get("portfolio") or {"funds": []}
        funds = portfolio.get("funds", [])
        
        # Check if already invested
        existing_idx = next((i for i, f in enumerate(funds) if f["id"] == req.fund_id), -1)
        
        if existing_idx >= 0:
            # Update existing position
            funds[existing_idx]["invested_amount"] += req.amount
            funds[existing_idx]["current_value"] += req.amount # Simplified: assume 1:1 for now
        else:
            # Add new position
            funds.append({
                "id": req.fund_id,
                "name": req.fund_name,
                "logo": req.fund_logo,
                "invested_amount": req.amount,
                "current_value": req.amount,
                "shares": req.amount / 10.0, # Mock NAV 10
                "invested_at": "Today" # simple string for now
            })
            
        portfolio["funds"] = funds
        new_balance = current_balance - req.amount
        
        # 4. Save updates
        update_res = supabase.table("profiles").update({
            "balance": new_balance,
            "portfolio": portfolio
        }).eq("id", req.user_id).execute()
        
        return {"status": "success", "new_balance": new_balance, "portfolio": portfolio}

    except Exception as e:
        print(f"Investment error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
