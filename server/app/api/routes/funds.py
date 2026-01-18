from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
import os
from supabase import create_client, Client
from app.services.funds_svc import normalize_holdings, generate_unique_fund_id, create_fund_draft, patch_fund_metadata
from app.services.ai_enrichment import enrich_fund_metadata

router = APIRouter()

# Initialize Supabase client
def get_supabase() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase credentials not configured on server")
    return create_client(url, key)

class FundPublishRequest(BaseModel):
    id: str
    name: str
    thesis: str
    description: Optional[str] = None
    status: str = "Live"
    holdings: List[Any]
    tags: List[str]
    owner_id: Optional[str] = None
    created_by: str = "Anonymous"
    
    # Financials (Initial)
    returns_month: float = 0
    returns_inception: float = 0
    liquidity_score: float = 0
    aum: float = 0
    nav: float = 10
    max_drawdown: float = 0
    top_concentration: float = 0
    sharpe: float = 0
    
    # Generated Artifacts
    report_markdown: Optional[str] = None
    proposal_json: Optional[Dict] = None
    report_pdf: Optional[str] = None
    proposal_json: Optional[Dict] = None
    report_pdf: Optional[str] = None
    categories: List[str] = []

@router.get("")
def get_all_funds():
    """Fetch all funds from the database."""
    try:
        supabase = get_supabase()
        res = supabase.table("funds").select("*").execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{fund_id}")
def get_fund(fund_id: str):
    """Fetch a specific fund by ID."""
    try:
        supabase = get_supabase()
        res = supabase.table("funds").select("*").eq("id", fund_id).execute()
        
        if not res.data:
            # Fallback: check draft/pending if needed, or just return 404
             raise HTTPException(status_code=404, detail="Fund not found")
             
        return res.data[0]
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error fetching fund {fund_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def publish_fund(fund: FundPublishRequest):
    try:
        supabase = get_supabase()
        
        # 1. Normalize Holdings
        # Convert Pydantic models to dict if needed (holdings is List[Any] currently)
        holdings_data = fund.holdings
        # If they are pydantic models, dump them
        if holdings_data and hasattr(holdings_data[0], "dict"):
             holdings_data = [h.dict() for h in holdings_data]
             
        normalized_holdings = normalize_holdings(holdings_data)

        # 2. Build Base Data
        # Generate ID if not provided or valid (though frontend sends one, we enforce unique one or respect it if valid?)
        # Requirement: "Generates a unique alphanumeric fund id (not derived from name)"
        # Requirement: "Generate a unique fund Id (server-side)" overrides frontend UUID
        # BUT: Frontend generates draft.id. If we overwrite it, the redirect on frontend might break 
        # unless we return the new ID. Let's generate a new short ID for the published fund.
        
        new_fund_id = generate_unique_fund_id(supabase)
        
        fund_data = {
            "id": new_fund_id,
            "name": fund.name,
            "owner_id": fund.owner_id,
            "created_by": fund.created_by,
            "status": "Live", # or fund.status
            "holdings": normalized_holdings,
            "volume": 0, # Initial volume
            "description": fund.description,
            "thesis": fund.thesis,
            "tags": fund.tags,
            "categories": fund.categories,
            
            # Persist generated artifacts if present
            "report_markdown": fund.report_markdown,
            "report_pdf": fund.report_pdf,
            "proposal_json": fund.proposal_json or {},
            
            # Initial Metrics
            "returns_month": 0,
            "returns_inception": 0,
            "liquidity_score": fund.liquidity_score,
            "aum": 0,
            "nav": 10,
            "max_drawdown": 0,
            "top_concentration": 0, # Re-calc?
            "sharpe": 0
        }
        
        # Recalculate top concentration from normalized weights
        if normalized_holdings:
            fund_data["top_concentration"] = max(h["weightPct"] for h in normalized_holdings)

        print(f"Creating Fund Draft: {fund.name} (ID: {new_fund_id})")

        # 3. Insert Initial Row (Safety persist)
        create_fund_draft(supabase, fund_data)
        
        # 4. AI Enrichment (Only if missing fields)
        # Check what's missing
        existing_data = {
             "thesis": fund.thesis,
             "description": fund.description,
             "tags": fund.tags,
             "categories": fund.categories
        }
        
        # We run enrichment in foreground for simplicity as requested "finalize fund logic"
        # In prod, this could be background task.
        enriched_metadata = enrich_fund_metadata(fund.name, normalized_holdings, existing_data)
        
        if enriched_metadata:
             print(f"Enriching Fund {new_fund_id} with AI metadata...")
             patch_fund_metadata(supabase, new_fund_id, enriched_metadata)
             # Update local dict for return
             fund_data.update(enriched_metadata)

        return {
            "status": "success", 
            "fund_id": new_fund_id, 
            "message": "Fund published successfully",
            "fund": fund_data # Return full data including new attributes
        }
        
    except Exception as e:
        print(f"Error publishing fund: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
