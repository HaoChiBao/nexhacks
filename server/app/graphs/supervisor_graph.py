from langgraph.graph import StateGraph, START, END
from app.graphs.state import AgentState
from app.agents.research import research_node
from app.agents.allocator import allocator_node
from app.agents.orchestrator import orchestrator_node

def build_graph():
    graph = StateGraph(AgentState)
    
    # Add Nodes
    graph.add_node("research", research_node)
    graph.add_node("allocator", allocator_node)
    graph.add_node("orchestrator", orchestrator_node)
    
    # Edges
    # START -> Research -> Allocator -> Orchestrator -> END
    # In a complex app, Orchestrator would be a conditional node deciding where to go.
    # For this linear flow:
    graph.add_edge(START, "research")
    graph.add_edge("research", "allocator")
    graph.add_edge("allocator", "orchestrator")
    graph.add_edge("orchestrator", END)
    
    return graph.compile()

supervisor_graph = build_graph()
