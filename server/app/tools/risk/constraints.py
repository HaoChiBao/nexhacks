from typing import List, Dict
from app.schemas.portfolio import RiskLimits

def filter_markets(markets: List[Dict], limits: RiskLimits) -> List[Dict]:
    """
    Filter markets based on liquidity, spread, and other risk constraints.
    Expects markets to have 'liquidity', 'spread' keys (or we calculate them).
    """
    valid_markets = []
    
    for m in markets:
        # Mocking extraction of liquidity/spread from market dict
        # In reality, you'd merge this with CLOB data
        liq = float(m.get("liquidity", 0)) if m.get("liquidity") else 0
        
        # If liquidity is too low, skip
        if liq < limits.min_liquidity_usd:
            continue
            
        # Simplified: check hardcoded spread if available, else assume 0 for scaffold
        spread = 0.01 
        if spread > limits.max_spread_pct:
            continue
            
        valid_markets.append(m)
        
    return valid_markets
