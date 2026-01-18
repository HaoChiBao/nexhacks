from app.graphs.state import AgentState
from app.tools.output.formatter import format_recommendation
from app.tools.output.generator import generate_scientific_report, generate_allocation_proposal, generate_scientific_pdf

async def orchestrator_node(state: AgentState) -> AgentState:
    """
    Final step: Formats the output and generates professional docs.
    """
    print("--- [Orchestrator Node] Generating professional documentation...")
    
    plan = state["allocation_plan"]
    research = state["research_output"]
    pf = state["portfolio"]
    
    # Standard Chat Recommendation
    text = format_recommendation(
        plan=plan,
        research=research,
        portfolio_name=pf.name
    )
    
    # Professional Research Report
    report_pdf_b64 = generate_scientific_pdf(research, pf)
    
    return {
        "recommendation_text": text,
        "summary_markdown": None,
        "proposal_json": None,
        "report_pdf": report_pdf_b64,
        "messages": ["FanFunds research unit completed behavioral mapping and generated PDF report."]
    }
