from fastapi import APIRouter, HTTPException
from app.schemas.portfolio import RebalanceRequest, RebalanceResponse, PortfolioDefinition, RiskLimits
from app.services.portfolio_registry import registry
from app.graphs.supervisor_graph import supervisor_graph

router = APIRouter()

from fastapi.responses import StreamingResponse
import asyncio
import json
from app.utils.stream import log_queue_var

@router.post("/")
async def run_rebalance(req: RebalanceRequest):
    # 1. Get Portfolio
    pf = None
    if req.topic:
        # Extract better keywords
        from app.agents.clarifier import extract_search_keywords
        keywords = await extract_search_keywords(req.topic, req.description or "")
        print(f"--- [Planner] 🎯 Extracted keywords: {keywords}")

        pf = PortfolioDefinition(
            id="dynamic",
            name=f"Dynamic Fund: {req.topic}",
            description=req.description or f"Auto-generated fund for {req.topic}",
            keywords=keywords,
            universe_filters={"closed": False},
            default_risk=RiskLimits(
                max_position_pct=0.20,
                min_liquidity_usd=100, 
                min_volume_usd=0, 
                max_spread_pct=0.15
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
        "bankroll": 100.0,
        "user_id": req.user_id,
        "research_completed": False,
        "research_output": None,
        "allocation_plan": None,
        "recommendation_text": None,
        "summary_markdown": None,
        "proposal_json": None,
        "messages": []
    }
    
    # 3. Stream Generator
    async def event_generator():
        queue = asyncio.Queue()
        token = log_queue_var.set(queue)
        
        # Run graph in background task
        async def run_graph():
            try:
                final_state = await supervisor_graph.ainvoke(initial_state)
                # Prepare final result
                result = RebalanceResponse(
                    recommendation=final_state["recommendation_text"],
                    plan=final_state["allocation_plan"],
                    research=final_state["research_output"],
                    summary_markdown=final_state.get("summary_markdown"),
                    proposal_json=final_state.get("proposal_json"),
                    report_pdf=final_state.get("report_pdf"),
                    agent_logs=final_state.get("structured_logs", [])
                )
                await queue.put({"type": "result", "payload": result.model_dump()})
            except Exception as e:
                print(f"Graph Error: {e}")
                await queue.put({"type": "error", "message": str(e)})
            finally:
                await queue.put(None) # Sentinel

        task = asyncio.create_task(run_graph())
        
        try:
            while True:
                # Wait for next event
                item = await queue.get()
                if item is None:
                    break
                
                # Check if it's a log or result
                if "payload" in item and item.get("type") == "result":
                    # Final result
                    yield f"data: {json.dumps(item)}\n\n"
                elif "type" in item and item["type"] == "error":
                    yield f"data: {json.dumps(item)}\n\n"
                else:
                    # It's a log entry
                    yield f"data: {json.dumps({'type': 'log', 'content': item})}\n\n"
                    
        finally:
            log_queue_var.reset(token)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
