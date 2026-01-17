from app.graphs.state import AgentState
from app.tools.news.search import search_news
from app.tools.news.extract import extract_article_content
from app.schemas.portfolio import ResearchResult
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()

async def research_node(state: AgentState) -> AgentState:
    """
    1. Extract keywords from portfolio
    2. Search news
    3. Extract content from top results
    4. Synthesize with LLM
    """
    pf = state["portfolio"]
    print(f"--- [Research Node] 🧠 Analyst: Starting research for '{pf.name}'...")
    print(f"--- [Research Node] 🔍 Searching news for keywords: {pf.keywords}")
    
    # 1. Search
    evidence_items = []
    # Search for first 2 keywords
    for kw in pf.keywords[:2]:
        results = await search_news(kw)
        evidence_items.extend(results)
    
    # 2. Extract - Enrich the top 5 results with full text
    limit = 5
    print(f"--- [Research Node] 📖 extracting full text from {min(len(evidence_items), limit)} articles...")
    for item in evidence_items[:limit]:
        if item.get("url"):
            content = await extract_article_content(item["url"])
            if content:
                item["content"] = content

    # 3. Synthesize with LLM
    print(f"--- [Research Node] 🤖 Synthesizing findings with LLM...")
    summary_text = "Analysis pending..."
    risk_flags = []
    
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    # Prepare context
    context = ""
    for item in evidence_items[:limit]: # Feed top 5 to LLM
        context += f"Source: {item.get('title', 'Unknown')}\n"
        context += f"URL: {item.get('url')}\n"
        context += f"Content: {item.get('content', item.get('content', 'No content'))[:500]}...\n\n"

    system_prompt = (
        "You are a senior financial analyst for a hedge fund. "
        "Conduct a deep-dive analysis of the provided news for the portfolio theme. "
        "Your output must be structured as follows:\n"
        "1. **Executive Summary**: High-level synthesis.\n"
        "2. **Key Catalysts**: Specific events or drivers (mention dates/names).\n"
        "3. **Risk Factors**: Critical headwinds or uncertainties.\n"
        "4. **Sentiment Analysis**: Bullish/Bearish/Neutral with reasoning.\n\n"
        "Be professional, concise, and citing specific details from the text where possible."
    )
    
    try:
        # We check simply if key indicates placeholder to avoid crashing if user hasn't set it yet
        # But we still run the code if it looks vaguely real or let it fail gracefully
        if "placeholder" not in os.getenv("OPENAI_API_KEY", "placeholder"):
           # Using invoke, unlikely to need batch here for single request
           msg = await llm.ainvoke([
               SystemMessage(content=system_prompt), 
               HumanMessage(content=f"Portfolio: {pf.name}\nContext:\n{context}")
           ])
           summary_text = msg.content
        else:
            summary_text = (
                f"Found {len(evidence_items)} articles. "
                "LLM synthesis skipped (API Key is placeholder). "
                "Market sentiment appears mixed."
            )
    except Exception as e:
        print(f"LLM Error: {e}")
        summary_text = "Error generating summary."

    result = ResearchResult(
        keywords=pf.keywords,
        risk_flags=["High Volatility", "Regulatory Uncertainty"], # In real production, LLM should extract these too
        evidence_items=evidence_items,
        summary=summary_text
    )
    
    return {
        "research_output": result, 
        "research_completed": True,
        "messages": ["Research completed."]
    }

