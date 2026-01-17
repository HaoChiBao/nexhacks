from typing import TypedDict, Optional, List
from app.schemas.portfolio import PortfolioDefinition, RiskLimits, ResearchResult, AllocationPlan

class AgentState(TypedDict):
    # Inputs
    portfolio: PortfolioDefinition
    bankroll: float
    user_id: str
    
    # State flags
    research_completed: bool
    
    # Outputs
    research_output: Optional[ResearchResult]
    allocation_plan: Optional[AllocationPlan]
    recommendation_text: Optional[str]
    messages: List[str]  # Log of steps
