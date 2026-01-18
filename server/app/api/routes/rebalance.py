from fastapi import APIRouter, HTTPException
from app.schemas.portfolio import RebalanceRequest, RebalanceResponse, PortfolioDefinition, RiskLimits
from app.services.portfolio_registry import registry
from app.graphs.supervisor_graph import supervisor_graph

router = APIRouter()

@router.post("/", response_model=RebalanceResponse)
async def run_rebalance(req: RebalanceRequest):
    # 1. Get Portfolio
    pf = None
    if req.topic:
        pf = PortfolioDefinition(
            id="dynamic",
            name=f"Dynamic Fund: {req.topic}",
            description=req.description or f"Auto-generated fund for {req.topic}",
            keywords=[req.topic],
            universe_filters={"closed": False},
            default_risk=RiskLimits(
                max_position_pct=0.20,
                min_liquidity_usd=1000, 
                max_spread_pct=0.05
            )
        )
    elif req.portfolio_id:
        pf = registry.get(req.portfolio_id)
        if pf and req.description:
            pf.description = req.description
    
    if not pf:
        raise HTTPException(status_code=404, detail="Portfolio not found or topic missing")
        
    # 2. Init State
    initial_state = {
        "portfolio": pf,
        "bankroll": 100.0, # Default bankroll for logic

        "user_id": req.user_id,
        "research_completed": False,
        "research_output": None,
        "allocation_plan": None,
        "recommendation_text": None,
        "messages": []
    }
    
    # 3. Run Graph
    final_state = await supervisor_graph.ainvoke(initial_state)
    
    # 4. Return Output
    return RebalanceResponse(
        recommendation=final_state["recommendation_text"],
        plan=final_state["allocation_plan"],
        research=final_state["research_output"]
    )
