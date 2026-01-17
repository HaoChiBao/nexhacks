from app.graphs.state import AgentState
from app.tools.output.formatter import format_recommendation

async def orchestrator_node(state: AgentState) -> AgentState:
    """
    Final step: Formats the output.
    """
    print("--- [Orchestrator Node] Formatting output...")
    
    text = format_recommendation(
        plan=state["allocation_plan"],
        research=state["research_output"],
        portfolio_name=state["portfolio"].name
    )
    
    return {
        "recommendation_text": text,
        "messages": ["Orchestrator finished."]
    }
