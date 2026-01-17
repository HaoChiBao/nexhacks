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
    
    # Phase 1: Score & Filter Candidates
    candidates = []
    
    for m in markets:
        event_title = m.get("event_title")
        question = m.get("question")
        specific_rationale = base_rationale
        outcome = "YES"
        confidence = 50 # Default low-ish confidence
        
        # Determine Rationale/Side/Confidence
        match_data = None
        if event_rationales:
            if question and question in event_rationales:
                match_data = event_rationales[question]
            elif event_title and event_title in event_rationales:
                match_data = event_rationales[event_title]
                
        if match_data:
            if isinstance(match_data, dict):
                specific_rationale = match_data.get("reasoning", base_rationale)
                outcome = match_data.get("side", "YES").upper()
                confidence = match_data.get("confidence", 50)
            else:
                specific_rationale = str(match_data)
        
        # Only keep high conviction trades (e.g. > 70)
        if confidence >= 70:
            candidates.append({
                "market": m,
                "outcome": outcome,
                "rationale": specific_rationale,
                "confidence": confidence,
                "citation": citation
            })
            
    if not candidates:
        return AllocationPlan(targets=[], trades=[], warnings=["No markets met the 70% confidence threshold."])

    # Phase 2: Select Top Pick Per Event
    # Group by Event Title
    from itertools import groupby
    candidates.sort(key=lambda x: x["market"].get("event_title", ""))
    
    final_picks = []
    for event_title, group in groupby(candidates, key=lambda x: x["market"].get("event_title")):
        group_list = list(group)
        # Sort by confidence descending
        group_list.sort(key=lambda x: x["confidence"], reverse=True)
        # Pick top 1
        final_picks.append(group_list[0])
        
    # Phase 3: Allocate
    # Equal weight across Final Picks
    count = len(final_picks)
    raw_weight = 1.0 / count
    weight = min(raw_weight, risk.max_position_pct)
    
    for pick in final_picks:
        m = pick["market"]
        target_usd = weight * bankroll
        
        targets.append(TargetAllocation(
            market_id=m.get("id"),
            market_slug=m.get("event_slug"),
            event_title=m.get("event_title"),
            question=m.get("question"),
            outcome=pick["outcome"],
            weight=weight,
            rationale=pick["rationale"] + f" (Confidence: {pick['confidence']}%)",
            citation_url=pick["citation"]
        ))
        
        trades.append(Trade(
            market_id=m.get("id"),
            outcome=pick["outcome"],
            side="BUY", 
            amount_usd=target_usd,
            reason="High conviction top pick"
        ))
        
        total_alloc_usd += target_usd

    return AllocationPlan(
        targets=targets,
        trades=trades,
        warnings=[f"Allocated ${total_alloc_usd} out of ${bankroll} across {len(final_picks)} high-conviction events."]
    )
