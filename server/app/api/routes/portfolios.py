from fastapi import APIRouter, HTTPException, Depends
from app.services.portfolio_registry import registry
from pydantic import BaseModel
import os
from supabase import create_client, Client
from typing import Dict, Any, Optional

router = APIRouter()

# Initialize Supabase client
# Initialize Supabase client
def get_supabase() -> Client:
    url = os.getenv("SUPABASE_URL")
    # Prefer Service Role Key for backend operations to bypass RLS
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        print("CRITICAL: Supabase credentials missing.")
        raise HTTPException(status_code=500, detail="Supabase credentials not configured on server")
    
    # Log which key we are using (safety check)
    key_type = "SERVICE_ROLE" if os.getenv("SUPABASE_SERVICE_ROLE_KEY") else "ANON/DEFAULT"
    print(f"Initializing Supabase Client ({key_type})")
    
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
    print(f"💰 INVESTMENT REQUEST: User={req.user_id} Fund={req.fund_id} Amount={req.amount}")
    try:
        supabase = get_supabase()
        
        # 1. Fetch current profile
        print("Step 1: Fetching user profile...")
        res = supabase.table("profiles").select("*").eq("id", req.user_id).execute()
        if not res.data:
            print("❌ Profile not found!")
            raise HTTPException(status_code=404, detail="User profile not found")
            
        profile = res.data[0]
        current_balance = float(profile.get("balance", 0))
        print(f"Current Balance: {current_balance}")
        
        # 2. Check Balance
        if current_balance < req.amount:
             print("❌ Insufficient funds")
             raise HTTPException(status_code=400, detail="Insufficient balance")
        print("✅ Balance sufficient.")
             
        # 3. Update Portfolio Structure (Legacy/Compatibility)
        raw_portfolio = profile.get("portfolio")
        
        if raw_portfolio is None:
            portfolio = {"funds": []}
        elif isinstance(raw_portfolio, list):
            portfolio = {"funds": raw_portfolio}
        elif isinstance(raw_portfolio, dict):
            portfolio = raw_portfolio
        else:
            portfolio = {"funds": []}

        funds = portfolio.get("funds", [])
        if not isinstance(funds, list):
            funds = []
        
        # Check if already invested
        existing_idx = next((i for i, f in enumerate(funds) if isinstance(f, dict) and f.get("id") == req.fund_id), -1)
        
        if existing_idx >= 0:
            funds[existing_idx]["invested_amount"] = funds[existing_idx].get("invested_amount", 0) + req.amount
            funds[existing_idx]["current_value"] = funds[existing_idx].get("current_value", 0) + req.amount
        else:
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
        print("Step 3: Updating Profile Balance & Portfolio Blob...")
        update_res = supabase.table("profiles").update({
            "balance": new_balance,
            "portfolio": portfolio
        }).eq("id", req.user_id).execute()
        print("✅ Profile updated.")

        # 5. Update Fund AUM
        print("Step 4: Updating Fund AUM...")
        fund_res = supabase.table("funds").select("aum").eq("id", req.fund_id).execute()
        if fund_res.data:
            current_aum = float(fund_res.data[0].get("aum") or 0)
            new_aum = current_aum + req.amount
            
            supabase.table("funds").update({
                "aum": new_aum
            }).eq("id", req.fund_id).execute()
            print(f"✅ Fund AUM updated: {current_aum} -> {new_aum}")
        else:
            print("⚠️ Fund not found in 'funds' table, skipping AUM update.")
        
        # 6. Update/Insert into user_funds
        print("Step 5: Syncing to user_funds table...")
        try:
            uf_res = supabase.table("user_funds").select("*")\
                .eq("user_id", req.user_id)\
                .eq("fund_id", req.fund_id)\
                .execute()
                
            if uf_res.data and len(uf_res.data) > 0:
                print("Updating existing user_fund record...")
                existing_record = uf_res.data[0]
                new_invested = float(existing_record.get("invested_amount", 0)) + req.amount
                supabase.table("user_funds").update({
                    "invested_amount": new_invested,
                    "updated_at": "now()"
                }).eq("id", existing_record["id"]).execute()
            else:
                print("Inserting new user_fund record...")
                supabase.table("user_funds").insert({
                    "user_id": req.user_id,
                    "fund_id": req.fund_id,
                    "name": req.fund_name, 
                    "invested_amount": req.amount,
                    "is_public": True, 
                    "allocation_plan": {}
                }).execute()
            print("✅ user_funds synced.")
                
        except Exception as uf_error:
            print(f"⚠️ Warning: Failed to update user_funds table: {uf_error}")

        print("🎉 Investment Transaction Completed Successfully.")
        return {"status": "success", "new_balance": new_balance, "portfolio": portfolio}

    except Exception as e:
        print(f"❌ MAJOR INVESTMENT ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
