from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class RiskLimits(BaseModel):
    max_position_pct: float = Field(..., description="Max % of bankroll in one market")
    min_liquidity_usd: float = Field(..., description="Min liquidity required to enter")
    max_spread_pct: float = Field(..., description="Max bid-ask spread allowed")

class PortfolioDefinition(BaseModel):
    id: str
    name: str
    description: str
    keywords: List[str]
    universe_filters: dict
    default_risk: RiskLimits

class ResearchResult(BaseModel):
    keywords: List[str]
    risk_flags: List[str]
    evidence_items: List[dict]
    summary: str
    needs_more_info: bool = False
    research_gaps: Optional[str] = None

class Trade(BaseModel):
    market_id: str
    outcome: str
    side: Literal["BUY", "SELL"]
    amount_usd: float
    reason: str

class TargetAllocation(BaseModel):
    market_id: str
    market_slug: Optional[str] = None
    event_title: Optional[str] = None
    question: Optional[str] = None
    outcome: str
    weight: float
    rationale: str
    citation_url: Optional[str] = None
    volume_usd: Optional[float] = 0.0
    liquidity_usd: Optional[float] = 0.0
    last_price: Optional[float] = 0.0

class AllocationPlan(BaseModel):
    targets: List[TargetAllocation]
    trades: List[Trade]
    warnings: List[str]

class RebalanceRequest(BaseModel):
    portfolio_id: Optional[str] = None
    topic: Optional[str] = None
    description: Optional[str] = None
    user_id: Optional[str] = "default_user"

class RebalanceResponse(BaseModel):
    recommendation: str
    plan: AllocationPlan
    research: ResearchResult
