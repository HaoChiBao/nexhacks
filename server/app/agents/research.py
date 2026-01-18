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
    
    # 2. Extract - Enrich the top 2 results with full text
    limit = 2
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
           # 3a. Initial Synthesis
           print(f"--- [Research Node] 🤖 Synthesizing findings with LLM...")
           msg = await llm.ainvoke([
               SystemMessage(content=system_prompt), 
               HumanMessage(content=f"Portfolio: {pf.name}\nDescription/Context: {pf.description}\nContext:\n{context}")
           ])
           summary_text = msg.content
           
           # 3b. Reflection & Loop (Max 1 retry)
           print(f"--- [Research Node] 🤔 Reflecting on data sufficiency...")
           reflection_prompt = (
               "You are a research supervisor. Read the summary below and determine if there is CRITICAL missing information "
               "needed to make an investment decision (e.g., missing specific dates, missing IPO valuation, missing election odds). "
               "If yes, output 'MISSING: <search_query>'. If no, output 'SUFFICIENT'.\n"
               f"Summary:\n{summary_text}"
           )
           reflection_msg = await llm.ainvoke([HumanMessage(content=reflection_prompt)])
           reflection_content = reflection_msg.content.strip()
           
           if reflection_content.startswith("MISSING:"):
                search_query = reflection_content.replace("MISSING:", "").strip()
                print(f"--- [Research Node] 🔄 Gaps detected. Triggering follow-up search for: '{search_query}'")
                
                # Search 2
                new_results = await search_news(search_query)
                print(f"--- [Research Node] 📖 extracting full text from follow-up search...")
                for item in new_results[:2]: # Limit 2 for follow-up
                    if item.get("url"):
                        c = await extract_article_content(item["url"])
                        if c:
                            item["content"] = c
                            evidence_items.append(item)
                
                # Re-Synthesize
                # Rebuild context with ALL evidence
                context = ""
                for item in evidence_items[:7]: # Top 7 now
                    context += f"Source: {item.get('title', 'Unknown')}\n"
                    context += f"URL: {item.get('url')}\n"
                    context += f"Content: {item.get('content', item.get('content', 'No content'))[:500]}...\n\n"
                
                print(f"--- [Research Node] 🤖 Re-synthesizing with combined knowledge...")
                msg = await llm.ainvoke([
                    SystemMessage(content=system_prompt), 
                    HumanMessage(content=f"Portfolio: {pf.name}\nContext:\n{context}")
                ])
                summary_text = msg.content
           else:
               print(f"--- [Research Node] ✅ Research deemed sufficient.")

        else:
            summary_text = (
                f"Found {len(evidence_items)} articles. "
                "LLM synthesis skipped (API Key is placeholder). "
                "Market sentiment appears mixed."
            )
    except Exception as e:
        print(f"LLM Error: {e}")
        summary_text = f"Error generating summary: {e}"

    result = ResearchResult(
        keywords=pf.keywords,
        risk_flags=["High Volatility", "Regulatory Uncertainty"], # In real production, LLM should extract these too
        evidence_items=evidence_items,
        summary=summary_text,
        needs_more_info=False # We resolved it or gave up
    )
    
    return {
        "research_output": result, 
        "research_completed": True,
        "messages": ["Research completed."]
    }

