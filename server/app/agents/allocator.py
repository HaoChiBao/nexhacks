from app.graphs.state import AgentState
from app.tools.polymarket.gamma_client import fetch_markets
from app.tools.risk.constraints import filter_markets
from app.tools.risk.sizing import create_allocation_plan
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import os

async def allocator_node(state: AgentState) -> AgentState:
    """
    1. Fetch markets from Polymarket based on Research keywords
    2. Filter markets (Liquidity, Spread - constraints.py)
    3. Calculate sizing (sizing.py)
    """
    from app.utils.logger import AgentLogger
    
    # Init Logger (or continue from existing)
    if "structured_logs" not in state:
        state["structured_logs"] = []
    logger = AgentLogger("Allocator Agent", state["structured_logs"])
    
    logger.start("Starting allocation strategy...")

    research = state["research_output"]
    pf = state["portfolio"]
    risk = pf.default_risk
    
    # 1. Fetch
    keywords = research.keywords if research else pf.keywords
    logger.think(f"I need to find liquid markets for keywords: {keywords}. I will first query the Gamma API, and if insufficient, I will perform an agentic search.")
    
    logger.tool_call("Polymarket Gamma API", f"q={keywords}, tags={pf.universe_filters.get('tag')}")
    markets = await fetch_markets(keywords=keywords, tags=pf.universe_filters.get("tag"))
    logger.tool_result("Polymarket Gamma API", f"Found {len(markets)} raw markets")

    # Fallback: Agentic Search if API fails
    if not markets and keywords:
        logger.info("API returned 0 results. Attempting Agentic Search via Tavily...")
        from app.tools.news.search import search_news
        from app.tools.polymarket.gamma_client import fetch_event_by_slug
        
        query = f"polymarket event {keywords[0]}"
        logger.tool_call("Tavily Search", query)
        results = await search_news(query, max_results=5)
        
        slugs = set()
        for r in results:
            url = r.get("url", "")
            if "polymarket.com/event/" in url:
                parts = url.split("polymarket.com/event/")
                if len(parts) > 1:
                    slug = parts[1].split("?")[0].split("/")[0]
                    slugs.add(slug)
        
        logger.tool_result("Tavily Search", f"Found slugs: {list(slugs)}")
        
        for slug in slugs:
            logger.info(f"Fetching markets for slug: {slug}")
            slug_markets = await fetch_event_by_slug(slug)
            markets.extend(slug_markets)
            
    # 2. Filter (Double check liquidity/spread/vol again just in case)
    logger.think("Applying final risk constraints (Liquidity > $1k, Spread < 5%)...")
    risk_markets = filter_markets(markets, risk)
    logger.info(f"{len(risk_markets)} markets passed risk filter (out of {len(markets)})")
    
    # Skip semantic filter - the gamma_client should already filter by keywords
    valid_markets = risk_markets
    logger.think(f"Using all {len(valid_markets)} risk-filtered markets.")

    
    # 3. Generate Agentic Reasoning (The "Why")
    event_rationales = {}
    if valid_markets and research and "placeholder" not in os.getenv("OPENAI_API_KEY", "placeholder"):
        logger.think("I must now decide WHICH side (YES/NO) to take for each market. I will use the research summary to derive correlations.")
        try:
            market_questions = [f"Event: {m.get('event_title', 'Unknown')} | Question: {m.get('question', 'Unknown')}" for m in valid_markets]
            market_questions = list(set(market_questions))

            llm = ChatOpenAI(model="gpt-4o", temperature=0)
            prompt = (
                f"Topic: {pf.name}\n"
                f"Fund Description: {pf.description}\n"
                f"Research Summary:\n{research.summary[:2000]}\n\n"
                f"Market Questions to Evaluate: {market_questions}\n\n"
                "Task: For EACH specific 'Question' in the list, determine:\n"
                "1. **Side**: 'YES' if likely to happen, 'NO' if unlikely (e.g. if research says they will lose). Do NOT hesitate to vote 'NO'.\n"
                "2. **Reasoning**: A 1-sentence analysis specific to THAT question.\n"
                "3. **Confidence**: A score from 0-100 (int) representing conviction level.\n"
                "Format: JSON Object { 'Exact Question String': { 'side': 'YES' or 'NO', 'reasoning': '...', 'confidence': 85 } }\n"
                "IMPORTANT: The keys in JSON must match the 'Question' part exactly."
            )
            
            msg = await llm.ainvoke([SystemMessage(content="You are a Portfolio Manager."), HumanMessage(content=prompt)])
            
            import json
            raw_content = msg.content.replace("```json", "").replace("```", "").strip()
            
            # Parse
            try:
                event_rationales = json.loads(raw_content)
                # Log summary instead of full dump
                logger.think(f"analyzed {len(event_rationales)} markets. Determining conviction levels based on research matches.")
            except:
                 # Fallback if strict JSON parsing fails
                 event_rationales = {}
                 logger.error("Failed to parse reasoning JSON.")
        except Exception as e:
            logger.error(f"Error generating rationale: {e}")
            
    # 4. Size
    logger.think("Calculating Kelly Criterion weights for final basket...")
    plan = create_allocation_plan(
        valid_markets, 
        state["bankroll"], 
        risk, 
        research=state["research_output"],
        event_rationales=event_rationales
    )
    
    logger.end(f"Allocation complete. Generated {len(plan.trades)} target positions.")
    
    return {
        "allocation_plan": plan,
        "messages": [f"Allocator finished. {len(plan.trades)} trades generated."],
        "structured_logs": state["structured_logs"]
    }
