
import sys
import os

# Add server directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.tools.risk.sizing import create_allocation_plan
from app.schemas.portfolio import RiskLimits

# Mock classes
class MockRisk:
    max_position_pct = 1.0 # Allow up to 100% for easy math

def test_weighting():
    print("Testing Weighting Logic...")
    
    # Case 1: Spread
    print("\nCase 1: Scores [80, 82, 85] -> Expect Min-Max norm")
    markets = [
        {"id": "1", "event_title": "A", "question": "Q1"},
        {"id": "2", "event_title": "B", "question": "Q2"},
        {"id": "3", "event_title": "C", "question": "Q3"},
    ]
    # We will mock the Phase 2 selection by pretending these are the final picks internally
    # But wait, create_allocation_plan takes markets and filters them.
    # To test logic properly without mocking too much, we need to pass event_rationales.
    
    rationales = {
        "Q1": {"confidence": 80, "side": "YES"},
        "Q2": {"confidence": 82, "side": "YES"},
        "Q3": {"confidence": 85, "side": "YES"},
    }
    
    plan = create_allocation_plan(markets, bankroll=100, risk=MockRisk(), event_rationales=rationales)
    
    for t in plan.targets:
        print(f"Target {t.question}: Weight {t.weight:.4f}")
        
    # Validation
    # Min = 80, Max = 85. Range = 5.
    # Q1: (80-80)/5 = 0.0 -> Weight 0
    # Q2: (82-80)/5 = 0.4 
    # Q3: (85-80)/5 = 1.0
    # Total Score = 1.4
    # Weights should be normalized by total score * max_total_exposure (which is 1.0 here since count=3, max_pos=1.0)
    # W1 = 0
    # W2 = 0.4 / 1.4 = 0.2857
    # W3 = 1.0 / 1.4 = 0.7142
    
    # Case 2: Equal
    print("\nCase 2: Scores [80, 80] -> Expect Equal Weight")
    markets2 = [
        {"id": "1", "event_title": "A", "question": "Q1"},
        {"id": "2", "event_title": "B", "question": "Q2"},
    ]
    rationales2 = {
        "Q1": {"confidence": 80},
        "Q2": {"confidence": 80},
    }
    plan2 = create_allocation_plan(markets2, bankroll=100, risk=MockRisk(), event_rationales=rationales2)
    for t in plan2.targets:
        print(f"Target {t.question}: Weight {t.weight:.4f}")

    # Case 3: Single
    print("\nCase 3: Single Score [90] -> Expect 1.0 (or max pos)")
    markets3 = [
        {"id": "1", "event_title": "A", "question": "Q1"},
    ]
    rationales3 = {"Q1": {"confidence": 90}}
    plan3 = create_allocation_plan(markets3, bankroll=100, risk=MockRisk(), event_rationales=rationales3)
    for t in plan3.targets:
        print(f"Target {t.question}: Weight {t.weight:.4f}")

if __name__ == "__main__":
    test_weighting()
