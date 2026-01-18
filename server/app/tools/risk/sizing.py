from typing import List, Dict
from app.schemas.portfolio import RiskLimits, AllocationPlan, TargetAllocation, Trade

def get_outcome_price(market: Dict, outcome_label: str) -> float:
    """Helper to find price for a specific outcome label (YES/NO/Team Name)"""
    try:
        # 1. Parse outcomePrices (often a JSON list of strings '["0.5", "0.6"]')
        import json
        raw_prices = market.get("outcomePrices")
        if isinstance(raw_prices, str):
            prices = json.loads(raw_prices)
        else:
            prices = raw_prices or []
            
        # 2. Parse outcomes (labels)
        raw_outcomes = market.get("outcomes")
        if isinstance(raw_outcomes, str):
            outcomes = json.loads(raw_outcomes)
        else:
            outcomes = raw_outcomes or ["No", "Yes"] # Default binary
            
        # 3. Match label to index
        # Normalize: 'YES' -> 'Yes', 'NO' -> 'No'
        normalized_label = outcome_label.title() # 'Yes' or 'No' usually
        
        index = -1
        if normalized_label in outcomes:
            index = outcomes.index(normalized_label)
        elif outcome_label in outcomes: # Try raw (e.g. Trump)
            index = outcomes.index(outcome_label)
            
        # 4. Return price
        if index != -1 and index < len(prices):
            return float(prices[index]) * 100 # Convert 0.55 to 55 cents
            
    except Exception as e:
        print(f"Error parsing price for {outcome_label}: {e}")
        
    return 0.0

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
        
    # Phase 3: Allocate (Confidence Weighted)
    # Apply Min-Max Normalization to create drastic differences
    # (score - min) / (max - min)
    if final_picks:
        confidences = [p["confidence"] for p in final_picks]
        min_c = min(confidences)
        max_c = max(confidences)
        
        # If there is a spread, normalize
        if max_c > min_c:
            for p in final_picks:
                # Replace confidence with normalized score (0.0 to 1.0) multiplied by 100 for readability
                # But actually, the raw value doesn't matter for the ratio, keeping it as 0-100 scale is fine if we want
                # actually, user wants specific "percentage of the difference", so 0 to 1 float is best.
                p["confidence_score"] = (p["confidence"] - min_c) / (max_c - min_c)
        else:
            # If all equal, give them equal score (e.g. 1.0)
            for p in final_picks:
                p["confidence_score"] = 1.0

    # Instead of equal weight, we scale weights by confidence_score
    score_sum = sum(p["confidence_score"] for p in final_picks)
    
    if score_sum <= 0:
        # Fallback to equal weighting if scores are all zero (shouldn't happen with normalization 0-1 unless all min)
        # Actually min-max with all same gives 1.0.
        # If we have single item max=min, we gave it 1.0.
        # just safely handle 0
        for p in final_picks:
            p["final_weight"] = 1.0 / len(final_picks)
    else:
        # Normalize strictly to 1.0 (100%)
        # weight = score / score_sum
        cumulative_weight = 0.0
        for i, pick in enumerate(final_picks):
            # Calculate raw share
            share = pick["confidence_score"] / score_sum
            
            # For the last item, take the remainder to ensure exact 1.0
            if i == len(final_picks) - 1:
                weight = 1.0 - cumulative_weight
            else:
                weight = share
                
            pick["final_weight"] = weight
            cumulative_weight += weight
            
    # Final Pass to build plan
    total_alloc_usd = 0.0
    for pick in final_picks:
        m = pick["market"]
        weight = pick["final_weight"]
        target_usd = weight * bankroll
        
        targets.append(TargetAllocation(
            market_id=m.get("id"),
            market_slug=m.get("event_slug"),
            event_title=m.get("event_title"),
            question=m.get("question"),
            outcome=pick["outcome"],
            weight=weight,
            rationale=pick["rationale"] + f" (Confidence: {pick['confidence']}%)",
            citation_url=pick["citation"],
            volume_usd=float(m.get("volume", 0)),
            liquidity_usd=float(m.get("liquidity", 0)),
            last_price=get_outcome_price(m, pick["outcome"])
        ))
        
        trades.append(Trade(
            market_id=m.get("id"),
            outcome=pick["outcome"],
            side="BUY", 
            amount_usd=target_usd,
            reason=f"Agent-determined weighting ({weight*100:.1f}% alloc based on {pick['confidence']}% confid.)"
        ))
        
        total_alloc_usd += target_usd

    return AllocationPlan(
        targets=targets,
        trades=trades,
        warnings=[f"Agent-driven allocation complete. Allocated 100% of bankroll (${total_alloc_usd:.2f}) across {len(final_picks)} events."]
    )
