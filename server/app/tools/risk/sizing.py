from typing import List, Dict
from app.schemas.portfolio import RiskLimits, AllocationPlan, TargetAllocation, Trade

def create_allocation_plan(
    markets: List[Dict], 
    bankroll: float, 
    risk: RiskLimits
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
    
    for m in markets:
        # Determine outcome: usually 'YES' for thematic portfolios
        outcome = "YES"
        
        target_usd = weight * bankroll
        targets.append(TargetAllocation(
            market_id=m.get("id"),
            market_slug=m.get("event_slug"),
            event_title=m.get("event_title"),
            outcome=outcome,
            weight=weight,
            rationale=f"Equal weight allocation for {m.get('question')}"
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
