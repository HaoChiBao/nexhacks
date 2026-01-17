import pytest
from app.tools.risk.constraints import filter_markets
from app.schemas.portfolio import RiskLimits

def test_filter_liquidity():
    limits = RiskLimits(max_position_pct=0.1, min_liquidity_usd=1000, max_spread_pct=0.1)
    
    markets = [
        {"id": "1", "liquidity": 500, "description": "Low Liq"},
        {"id": "2", "liquidity": 1500, "description": "High Liq"},
    ]
    
    filtered = filter_markets(markets, limits)
    assert len(filtered) == 1
    assert filtered[0]["id"] == "2"

def test_filter_spread():
    # Note: scaffold constraints.py currently has mocked spread logic
    # This test verifies the function runs without error
    limits = RiskLimits(max_position_pct=0.1, min_liquidity_usd=0, max_spread_pct=0.001)
    markets = [{"id": "1", "liquidity": 100}] # Mock spread is 0.01 in stub
    
    filtered = filter_markets(markets, limits)
    # 0.01 > 0.001 -> should be filtered out
    assert len(filtered) == 0
