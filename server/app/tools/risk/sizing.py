from typing import List, Dict
from app.schemas.portfolio import RiskLimits, AllocationPlan, TargetAllocation, Trade

def create_allocation_plan(
    markets: List[Dict], 
    bankroll: float, 
    risk: RiskLimits,
    research: "ResearchResult" = None,
    event_rationales: Dict = None
) -> AllocationPlan:
    """
    Simple deterministic allocator: equal weight across passing markets.
    """
    if not markets:
        return AllocationPlan(targets=[], trades=[], warnings=["No valid markets found."])
    
    # Simple strategy: Equal Weight
    count = len(markets)
    raw_weight = 1.0 / count
    
    # Cap weight at max_position_pct
    weight = min(raw_weight, risk.max_position_pct)
    
    targets = []
    trades = []
    total_alloc_usd = 0.0
    
    # Extract general reasoning
    base_rationale = "Equal weight allocation aligned with portfolio theme."
    citation = None
    if research:
        # Use the first 200 chars of summary as rationale base
        clean_summary = research.summary.split('\n')[0][:200]
        base_rationale = f"Based on analysis: '{clean_summary}...' Market is consistent with identified themes."
        if research.evidence_items:
            citation = research.evidence_items[0].get("url")
    
    for m in markets:
        # Determine outcome: usually 'YES' for thematic portfolios, unless agent says otherwise
        outcome = "YES"
        
        # Determine specific rationale and side
        event_title = m.get("event_title")
        question = m.get("question")
        specific_rationale = base_rationale
        
        # Try finding exact question match first
        match_data = None
        if event_rationales:
            if question and question in event_rationales:
                match_data = event_rationales[question]
            elif event_title and event_title in event_rationales: # Fallback to event title if needed (backward compat)
                match_data = event_rationales[event_title]
                
        if match_data:
            if isinstance(match_data, dict):
                specific_rationale = match_data.get("reasoning", base_rationale)
                outcome = match_data.get("side", "YES").upper()
            else:
                specific_rationale = str(match_data)
        
        target_usd = weight * bankroll
        targets.append(TargetAllocation(
            market_id=m.get("id"),
            market_slug=m.get("event_slug"),
            event_title=event_title,
            question=question,
            outcome=outcome,
            weight=weight,
            rationale=specific_rationale,
            citation_url=citation
        ))
        
        # For simplicity, assume current portfolio is empty -> full buy
        trades.append(Trade(
            market_id=m.get("id"),
            outcome=outcome,
            side="BUY", 
            amount_usd=target_usd,
            reason="Initial entry"
        ))
        
        total_alloc_usd += target_usd
        
    return AllocationPlan(
        targets=targets,
        trades=trades,
        warnings=[f"Allocated ${total_alloc_usd} out of ${bankroll}"]
    )
