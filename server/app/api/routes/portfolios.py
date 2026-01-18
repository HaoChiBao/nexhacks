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
    # User provided key might be under SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SECRET_KEY")
    
    if key:
        print("Using Service Role/Secret Key (Bypassing RLS)")
    else:
        print("⚠️ WARNING: Service Role Key is missing! Using SUPABASE_KEY (Anon). RLS is likely to block writes.")
        key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        print("CRITICAL: Supabase credentials missing.")
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
             
        # 3. Update Portfolio Structure (JSON List)
        # Expected Format: [{ "fund_id": "...", "pnl_percent": ..., "purchase_date": "...", "invested_amount": ... }]
        
        raw_portfolio = profile.get("portfolio")
        
        # Normalize to list
        if raw_portfolio is None:
            portfolio = []
        elif isinstance(raw_portfolio, list):
            portfolio = raw_portfolio
        elif isinstance(raw_portfolio, dict):
             # Handle legacy { "funds": [...] }
            portfolio = raw_portfolio.get("funds", [])
            if not isinstance(portfolio, list):
                portfolio = []
        else:
            portfolio = []

        # Find existing investment
        from datetime import datetime
        
        existing_item = next((item for item in portfolio if isinstance(item, dict) and item.get("fund_id") == req.fund_id), None)
        
        if existing_item:
            # Update existing
            current_amt = float(existing_item.get("invested_amount", 0))
            existing_item["invested_amount"] = current_amt + req.amount
            # Preserve purchase_date and pnl_percent
        else:
            # Add new
            new_item = {
                "fund_id": req.fund_id,
                "pnl_percent": 0,   # Default
                "purchase_date": datetime.utcnow().isoformat(),
                "invested_amount": req.amount
            }
            portfolio.append(new_item)
            
        new_balance = current_balance - req.amount
        
        # 4. Save updates to Profile
        print("Step 3: Updating Profile Balance & Portfolio JSON...")
        update_res = supabase.table("profiles").update({
            "balance": new_balance,
            "portfolio": portfolio # Now a list, matching request
        }).eq("id", req.user_id).execute()
        
        if not update_res.data:
             print("❌ Failed to update profile (Rows affected: 0). Possible RLS issue.")
             raise HTTPException(status_code=500, detail="Database update failed (Profile). Check server logs/permissions.")
             
        print("✅ Profile updated.")

        # 5. Update Fund AUM
        print("Step 4: Updating Fund AUM...")
        fund_res = supabase.table("funds").select("aum").eq("id", req.fund_id).execute()
        if fund_res.data:
            current_aum = float(fund_res.data[0].get("aum") or 0)
            new_aum = current_aum + req.amount
            
            aum_update_res = supabase.table("funds").update({
                "aum": new_aum
            }).eq("id", req.fund_id).execute()
            
            if not aum_update_res.data:
                 print("⚠️ Failed to update Fund AUM. RLS blocking?")
            else:
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
                res = supabase.table("user_funds").update({
                    "invested_amount": new_invested,
                    "updated_at": "now()"
                }).eq("id", existing_record["id"]).execute()
                
                if not res.data:
                    raise Exception("Failed to update user_funds record (0 rows).")
            else:
                print("Inserting new user_fund record...")
                res = supabase.table("user_funds").insert({
                    "user_id": req.user_id,
                    "fund_id": req.fund_id,
                    "name": req.fund_name, 
                    "invested_amount": req.amount,
                    "is_public": True, 
                    "allocation_plan": {}
                }).execute()
                
                if not res.data:
                     raise Exception("Failed to insert user_funds record.")
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
