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
    
    # 1. Search Phase
    # We want a diverse pool, so we search for ALL keywords first
    candidate_pools = {} # {keyword: [articles]}
    total_candidates = 0
    
    # Use top 5 keywords to avoid explosion but ensure diversity
    target_keywords = pf.keywords[:5] 
    
    for kw in target_keywords:
        logger.think(f"Hypothesis: Searching for '{kw}' will reveal broad market sentiment and potential catalysts.")
        logger.think(f"Action: Querying search engine for '{kw}'...")
        logger.tool_call("Tavily Search", kw)
        
        results = await search_news(kw)
        candidate_pools[kw] = results
        total_candidates += len(results)
        
        logger.tool_result("Tavily Search", f"Returned {len(results)} links for '{kw}'.")
        
        titles = [r.get('title') for r in results[:3]]
        if titles:
            logger.think(f"Observation: Found articles: {titles}.")

    logger.think(f"Status: Gathered {total_candidates} candidates across {len(target_keywords)} keywords. Starting Round-Robin extraction to build a balanced dataset (Target: 10 articles).")

    # 2. Round-Robin Extraction Loop
    evidence_items = []
    MAX_ITEMS = 10
    
    # We cycle through keywords until we hit MAX_ITEMS or run out of candidates
    while len(evidence_items) < MAX_ITEMS and any(candidate_pools.values()):
        for kw in target_keywords:
            if len(evidence_items) >= MAX_ITEMS:
                break
                
            pool = candidate_pools.get(kw, [])
            if not pool:
                continue
                
            # Try getting ONE working article for this keyword in this round
            found_for_keyword = False
            
            while pool and not found_for_keyword:
                item = pool.pop(0) # Take next candidate
                url = item.get("url")
                title = item.get("title", "Unknown Title")
                
                # Deduplicate by URL
                if any(x.get("url") == url for x in evidence_items):
                    continue

                if url:
                     logger.think(f"Intent: [Round-Robin: {kw}] Attempting to read '{title}' ({url})...")
                     logger.think(f"Action: Parsing full content of '{title}'...")
                     try:
                        content = await extract_article_content(url)
                        if content:
                            item["content"] = content
                            evidence_items.append(item)
                            found_for_keyword = True
                            
                            # Insight Log
                            snippet = content[:200].replace("\n", " ")
                            logger.think(f"Insight from '{title}': \"{snippet}...\" -> Successfully added to dataset.")
                        else:
                            logger.think(f"Result: Content extraction failed (or empty) for '{title}'. Trying next candidate for '{kw}'...")
                     except Exception as e:
                        logger.error(f"Failed to extract {url}: {e}")
            
            if not found_for_keyword:
                logger.think(f"Warning: Exhausted candidates for keyword '{kw}' without success in this round.")
                
    logger.think(f"Status: Extraction complete. Gathered {len(evidence_items)} high-quality articles.")
    
    # 3. Synthesize with LLM
    summary_text = "Analysis pending..."
    risk_flags = []
    
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    # Prepare context
    context = ""
    for item in evidence_items: # Feed all gathered items to LLM
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

