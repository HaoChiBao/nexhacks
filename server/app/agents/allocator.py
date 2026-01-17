from app.graphs.state import AgentState
from app.tools.polymarket.gamma_client import fetch_markets
from app.tools.risk.constraints import filter_markets
from app.tools.risk.sizing import create_allocation_plan

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
    print(f"--- [Allocator Node] 📉 Found {len(markets)} raw markets from Polymarket API")

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
    
    # 3. Size
    plan = create_allocation_plan(valid_markets, state["bankroll"], risk)
    
    return {
        "allocation_plan": plan,
        "messages": [f"Allocator finished. {len(plan.trades)} trades generated."]
    }
