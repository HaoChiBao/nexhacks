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
    from app.utils.logger import AgentLogger

    # Initialize Logger
    if "structured_logs" not in state:
        state["structured_logs"] = []
    logger = AgentLogger("Research Agent", state["structured_logs"])
    
    pf = state["portfolio"]
    logger.start(f"Starting research for '{pf.name}'")
    logger.think(f"Strategy: I will search for {pf.keywords} to gather broad context, then use LLM to synthesize findings into an investment thesis.")
    
    # 1. Search
    evidence_items = []
    logger.tool_call("Tavily Search", str(pf.keywords[:2]))
    
    # Search for first 2 keywords
    for kw in pf.keywords[:2]:
        results = await search_news(kw)
        evidence_items.extend(results)
    
    logger.tool_result("Tavily Search", f"Found {len(evidence_items)} initial articles")
    
    # 2. Extract - Enrich the top 2 results with full text
    limit = 2
    logger.info(f"Extracting full text from {min(len(evidence_items), limit)} articles...")
    
    for item in evidence_items[:limit]:
        if item.get("url"):
            try:
                content = await extract_article_content(item["url"])
                if content:
                    item["content"] = content
            except:
                logger.error(f"Failed to extract {item.get('url')}")
    
    # 3. Synthesize with LLM
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
        if "placeholder" not in os.getenv("OPENAI_API_KEY", "placeholder"):
           # 3a. Deep Thinking Injection
           logger.think("Synthesizing data... I need to identify if the gathered news confirms the user's thesis or contradicts it. I am looking for specific dates and volume triggers.")
           
           msg = await llm.ainvoke([
               SystemMessage(content=system_prompt), 
               HumanMessage(content=f"Portfolio: {pf.name}\nDescription/Context: {pf.description}\nContext:\n{context}")
           ])
           summary_text = msg.content
           
           # 3b. Reflection & Loop (Max 1 retry)
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
                logger.think(f"Gaps detected in research. I need to find specific details about: {search_query}")
                logger.tool_call("Tavily Search (Follow-up)", search_query)
                
                # Search 2
                new_results = await search_news(search_query)
                for item in new_results[:2]: # Limit 2 for follow-up
                    if item.get("url"):
                        c = await extract_article_content(item["url"])
                        if c:
                            item["content"] = c
                            evidence_items.append(item)
                
                # Re-Synthesize
                context = ""
                for item in evidence_items[:7]: # Top 7 now
                    context += f"Source: {item.get('title', 'Unknown')}\n"
                    context += f"URL: {item.get('url')}\n"
                    context += f"Content: {item.get('content', item.get('content', 'No content'))[:500]}...\n\n"
                
                logger.think("Re-evaluating thesis with new data points...")
                msg = await llm.ainvoke([
                    SystemMessage(content=system_prompt), 
                    HumanMessage(content=f"Portfolio: {pf.name}\nContext:\n{context}")
                ])
                summary_text = msg.content
           else:
               logger.think("Research coverage is sufficient to form a thesis.")

        else:
            summary_text = (
                f"Found {len(evidence_items)} articles. "
                "LLM synthesis skipped (API Key is placeholder). "
                "Market sentiment appears mixed."
            )
            logger.info("Skipping LLM (No API Key)")
            
    except Exception as e:
        logger.error(f"LLM Error: {e}")
        summary_text = f"Error generating summary: {e}"

    logger.end("Research phase complete.")

    result = ResearchResult(
        keywords=pf.keywords,
        risk_flags=["High Volatility", "Regulatory Uncertainty"], 
        evidence_items=evidence_items,
        summary=summary_text,
        needs_more_info=False 
    )
    
    return {
        "research_output": result, 
        "research_completed": True,
        "messages": ["Research completed."],
        "structured_logs": state["structured_logs"]
    }

