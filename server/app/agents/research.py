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
    logger.start(f"Analyzing '{pf.name}'")
    # 1. Search Phase
    # We want a diverse pool, so we search for ALL keywords first
    candidate_pools = {} # {keyword: [articles]}
    total_candidates = 0
    
    # Use top 5 keywords to avoid explosion but ensure diversity
    target_keywords = pf.keywords[:5] 
    
    for kw in target_keywords:
        logger.think(f"Searching: '{kw}'")
        logger.tool_call("Tavily Search", kw)
        
        results = await search_news(kw)
        candidate_pools[kw] = results
        total_candidates += len(results)
        
        logger.tool_result("Tavily Search", f"Returned {len(results)} links for '{kw}'.")
        
        # logger.tool_result(...)

    logger.think(f"Gathered {total_candidates} results. Extracting top 10...")

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
                     logger.think(f"Reading: '{title}'")
                     try:
                        content = await extract_article_content(url)
                        if content:
                            item["content"] = content
                            evidence_items.append(item)
                            found_for_keyword = True
                            logger.think(f"Added: '{title}'")
                        else:
                            pass
                     except Exception as e:
                        logger.error(f"Failed to extract {url}: {e}")
            
            if not found_for_keyword:
                logger.think(f"Warning: Exhausted candidates for keyword '{kw}' without success in this round.")
                
    logger.think(f"Dataset complete ({len(evidence_items)} articles).")
    
    # 3. Synthesize with LLM
    summary_text = "Analysis pending..."
    thesis_discourse = "Deep analysis pending..."
    risk_flags = ["Analysis Incomplete"]
    
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
        "Your output must be a valid JSON object with the following fields:\n"
        '1. "summary": A concise (3-4 sentence) professional summary.\n'
        '2. "thesis_discourse": A very deep, analytical, and structured discourse (800+ words). '
        'Mirror scholarly "Chain of Thought" depth. Discuss nuances, direct vs indirect catalysts, '
        "and long-tail risks with academic gravity. Use rich, precise language.\n"
        '3. "risk_flags": A list of short strings (e.g. ["Market Volatility", "Policy Shift"]).\n'
        '4. "keywords": Updated keywords based on findings.\n\n'
        "IMPORTANT: Use PLAIN TEXT for JSON values. Do not use Markdown symbols like **bold** or # headings inside the JSON values. "
        "The scientific PDF generator handles the styling."
    )
    
    try:
        if "placeholder" not in os.getenv("OPENAI_API_KEY", "placeholder"):
           logger.think("Synthesizing context & deep thinking...")
           
           from langchain_core.output_parsers import JsonOutputParser
           parser = JsonOutputParser()
           
           msg = await llm.ainvoke([
               SystemMessage(content=system_prompt), 
               HumanMessage(content=f"Portfolio: {pf.name}\nDescription/Context: {pf.description}\nContext:\n{context}")
           ])
           
           try:
               parsed = parser.parse(msg.content)
               summary_text = parsed.get("summary", "Summary generation failed.")
               thesis_discourse = parsed.get("thesis_discourse", "Detailed analysis generation failed.")
               risk_flags = parsed.get("risk_flags", ["High Volatility"])
           except:
               summary_text = msg.content
               thesis_discourse = msg.content
               risk_flags = ["Analysis Complete"]

        else:
            summary_text = f"Found {len(evidence_items)} articles. LLM synthesis skipped (No API Key)."
            thesis_discourse = "Detailed analysis requires an active AI connection."
            risk_flags = ["Simulation Mode"]
            
    except Exception as e:
        logger.error(f"LLM Error: {e}")
        summary_text = f"Error generating summary: {e}"
        thesis_discourse = summary_text

    logger.end("Research phase complete.")

    result = ResearchResult(
        keywords=pf.keywords,
        risk_flags=risk_flags, 
        evidence_items=evidence_items,
        summary=summary_text,
        thesis_discourse=thesis_discourse,
        needs_more_info=False 
    )
    
    return {
        "research_output": result, 
        "research_completed": True,
        "messages": ["Research completed."],
        "structured_logs": state["structured_logs"]
    }

