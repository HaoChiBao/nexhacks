import pytest
from app.services.funds_svc import normalize_holdings
from app.utils.ids import generate_id

def test_generate_id():
    id1 = generate_id(12)
    id2 = generate_id(12)
    assert len(id1) == 12
    assert id1 != id2
    assert id1.isalnum()

def test_normalize_holdings_sum_100():
    holdings = [
        {"targetWeight": 30},
        {"targetWeight": 30},
        {"targetWeight": 30}
    ]
    normalized = normalize_holdings(holdings)
    total_pct = sum(h["weightPct"] for h in normalized)
    assert total_pct == 100
    # 30+30+30 = 90. total=90. 30/90 = 33.333
    # 33.33 * 3 = 99.99
    # Last item logic should fix it.
    assert normalized[-1]["weightPct"] == 33.34 
    assert normalized[0]["weightPct"] == 33.33

def test_normalize_holdings_url_generation():
    holdings = [
        {"slug": "test-slug", "targetWeight": 100}
    ]
    normalized = normalize_holdings(holdings)
    assert normalized[0]["url"] == "https://polymarket.com/market/test-slug"
    assert normalized[0]["source"] == "Polymarket"

def test_normalize_holdings_empty():
    assert normalize_holdings([]) == []
