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
    print("--- [Allocator Node] 🧩 Risk Manager: Fetching markets and calculating sizing...")
    research = state["research_output"]
    pf = state["portfolio"]
    risk = pf.default_risk
    
    # 1. Fetch
    # Use keywords found in research or defaults
    keywords = research.keywords if research else pf.keywords
    markets = await fetch_markets(keywords=keywords, tags=pf.universe_filters.get("tag"))
    print(f"--- [Allocator Node] 📉 Native API (Query + Merged Firehose) found {len(markets)} matches")

    # Fallback: Agentic Search if API fails
    if not markets and keywords:
        print(f"--- [Allocator Node] 🕵️ API returned 0 results. Attempting Agentic Search via Tavily...")
        from app.tools.news.search import search_news
        from app.tools.polymarket.gamma_client import fetch_event_by_slug
        
        # Search specifically for Polymarket event pages
        query = f"polymarket event {keywords[0]}"
        print(f"--- [Allocator Node] 🔍 Searching web for: '{query}'")
        results = await search_news(query, max_results=5)
        
        slugs = set()
        for r in results:
            url = r.get("url", "")
            if "polymarket.com/event/" in url:
                # Extract slug: https://polymarket.com/event/slug-name?tid=...
                parts = url.split("polymarket.com/event/")
                if len(parts) > 1:
                    slug = parts[1].split("?")[0].split("/")[0]
                    slugs.add(slug)
        
        print(f"--- [Allocator Node] 🔗 Found {len(slugs)} potential event slugs: {list(slugs)}")
        
        for slug in slugs:
            print(f"--- [Allocator Node] 📥 Fetching markets for slug: {slug}")
            slug_markets = await fetch_event_by_slug(slug)
            markets.extend(slug_markets)
            
        print(f"--- [Allocator Node] 📈 Total markets after agentic search: {len(markets)}")
    
    # 2. Filter
    valid_markets = filter_markets(markets, risk)
    print(f"--- [Allocator Node] ✅ {len(valid_markets)} markets passed liquidity/spread checks")
    
    # 3. Generate Agentic Reasoning (The "Why")
    event_rationales = {}
    if valid_markets and research and "placeholder" not in os.getenv("OPENAI_API_KEY", "placeholder"):
        print(f"--- [Allocator Node] 🧠 Generating specific reasoning for selected markets...")
        try:
            # Extract unique Questions (to avoid duplicates if any, though ID is unique)
            # We want to give the LLM context of the Event + Question
            market_questions = [f"Event: {m.get('event_title', 'Unknown')} | Question: {m.get('question', 'Unknown')}" for m in valid_markets]
            market_questions = list(set(market_questions))  # Dedupe

            # Ask LLM to explain why these events align with the research AND choose a side
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
            
            # Parse fake JSON (or use structured output in future) - for now, simple text parsing or hope for valid JSON
            import json
            raw_content = msg.content.replace("```json", "").replace("```", "").strip()
            event_rationales = json.loads(raw_content)
            print(f"--- [Allocator Node] ✅ Generated reasoning, sides & confidence for {len(event_rationales)} questions.")
        except Exception as e:
            print(f"Error generating rationale: {e}")

    # 4. Size
    plan = create_allocation_plan(
        valid_markets, 
        state["bankroll"], 
        risk, 
        research=state["research_output"],
        event_rationales=event_rationales
    )
    
    return {
        "allocation_plan": plan,
        "messages": [f"Allocator finished. {len(plan.trades)} trades generated."]
    }
