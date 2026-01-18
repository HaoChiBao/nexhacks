import httpx
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()
BASE_URL = os.getenv("POLYMARKET_API_URL", "https://gamma-api.polymarket.com")

# Tag IDs discovered via test_tags.py (Scanning 2000+ tags)
KNOWN_TAGS = {
    # Sports
    "nba": "745",
    "basketball": "100301", # Olympic/General
    "sports": "1",
    "nfl": "450",
    "football": "102160",
    # NBA Teams (Harvested via API)
    "lakers": "174",
    "la lakers": "174",
    "celtics": "190",
    "warriors": "32",
    "knicks": "33",
    "nets": "109",
    "sixers": "43",
    "76ers": "43",
    "bulls": "59",
    "heat": "117",
    "bucks": "745", # Fallback to NBA if specific tag low volume
    "hawks": "125",
    "hornets": "745", # Fallback
    "wizards": "745", # Fallback
    "magic": "116",
    "cavaliers": "221",
    "cavs": "221",
    "pistons": "30",
    "pacers": "155",
    "raptors": "54",
    "clippers": "34",
    "kings": "49",
    "suns": "745", # Fallback
    "mavericks": "77", 
    "mavs": "101770", # Alternative tag
    "spurs": "745", # Fallback
    "rockets": "48",
    "grizzlies": "745", # Fallback
    "pelicans": "29",
    "timberwolves": "121",
    "wolves": "121",
    "nuggets": "745", # Fallback
    "thunder": "31",
    "jazz": "122",
    "blazers": "45",
    "trail blazers": "45",
    # Crypto
    "crypto": "21",
    "bitcoin": "235",
    "ethereum": "39",
    "solana": "818",
    # Politics / World
    "politics": "2", 
    "election": "339",
    "trump": "126",
    "biden": "15",
    "geopolitics": "100265",
    "war": "79",
    "ukraine": "103027",
    "israel": "180",
    "world": "101982",
    # Business / Tech / Science
    "business": "107",
    "economics": "131", # Interest Rates
    "interest rates": "131",
    "tech": "1401",
    "technology": "22",
    "science": "74",
    "space": "75",
    "ai": "366", # World Affairs often captures AI, mostly broad
    "climate": "87",
    # Pop Culture
    "movies": "53",
    "music": "100",
    "entertainment": "315",
    "pop culture": "315",
    # Gaming / Esports
    "gaming": "36",
    "esports": "36", # Map to gaming if no direct tag
    "video games": "3",
    "league of legends": "65",
    "lol": "65",
    "dota": "102366", # Dota 2
    "dota 2": "102366",
    "csgo": "100635",
    "counter strike": "100635",
    "cs2": "100780",
    "counter strike 2": "100780",
    "cod": "100230",
    "call of duty": "100230",
    "apex": "103126",
    "apex legends": "103126",
    "starcraft": "103064",
    "valorant": "101672",
    "overwatch": "102753",
    # Stocks / Finance
    "stocks": "604",
    "stock market": "604",
    "investing": "603",
    "ipo": "600",
    "ipos": "600",
    "economy": "100328",
    "finance": "120", # Assumed based on previous scans or logical fallback
    "sp500": "604", # Fallback to Stocks
    "nasdaq": "604", # Fallback
    "nvidia": "604", # Fallback
    "nvda": "604",
    "tesla": "728",
    "tsla": "728",
    "amazon": "824",
    "amzn": "824",
    "microsoft": "1098",
    "msft": "1098",
    "meta": "101647", # Meta Platforms
    "facebook": "1564",
    "apple": "604", # Fallback (Apple Music ID 1347 is wrong context)
    "aapl": "604",
    "google": "1100", # Alphabet
    "goog": "1100",
    "alphabet": "1100",
    "netflix": "604", # Fallback
    "gamestop": "100250",
    "gme": "100250",
    "coinbase": "800",
    "coin": "800"
}

async def resolve_semantic_tag(query: str, available_tags: List[str]) -> Optional[str]:
    """
    Uses LLM to find the best matching tag key for a query if exact match fails.
    E.g. "Hoops" -> "Basketball", "FPS" -> "Gaming"
    """
    try:
        # Quick check for very short queries
        if not query or len(query) < 2:
            return None
            
        print(f"--- [Gamma Client] 🧠 Semantic Match Check: '{query}'")
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        
        tag_list_str = ", ".join(available_tags[:50]) # Use subset if too large, or categorized
        # Actually our list is small enough (<100) to pass all
        tag_list_str = ", ".join(available_tags)
        
        prompt = (
            f"You are a routing assistant. Match the User Query to ONE of the Available Tags based on semantic meaning.\n"
            f"User Query: '{query}'\n"
            f"Available Tags: [{tag_list_str}]\n\n"
            f"Rules:\n"
            f"1. Return ONLY the exact tag string from the list that best matches.\n"
            f"2. If there is no reasonable match (e.g. 'Nutrition' vs [Sports, Tech]), return 'None'.\n"
            f"3. Be generous with categories (e.g. 'shooter game' -> 'gaming' or 'cod').\n"
            f"Answer:"
        )
        
        msg = await llm.ainvoke([HumanMessage(content=prompt)])
        result = msg.content.strip().lower()
        
        if result and result != "none" and result in available_tags:
            return result
        return None
        
    except Exception as e:
        print(f"Error in semantic tag resolution: {e}")
        return None

async def fetch_markets(
    keywords: List[str],
    limit: int = 100,
    tags: Optional[str] = None
) -> List[Dict]:
    """
    Fetch markets from Polymarket Gamma API based on keywords (query).
    """
    primary_query = keywords[0] if keywords else ""
    filter_keywords = keywords[1:] if len(keywords) > 1 else []
    print(f"--- [Gamma Client] 🔍 Query: '{primary_query}' | Filter Keywords: {filter_keywords}")
    markets = []
    async with httpx.AsyncClient() as client:
        # Strategy:
        # 1. Try specific query first (cheap)
        # 2. If 0 results, fetch "Firehose" (top 100 active events) and filter locally
        
        # Attempt 1: Specific Query
        # User Strategy: "Query for one word (Fund Name)... then filter by research"
        # We assume keywords[0] is the Fund Name (via clarifier.py prepending)
        query = keywords[0] if keywords else ""
        
        # Fallback if empty (shouldn't happen)
        if not query and keywords:
             query = " ".join(keywords)

        # 1. Direct Lookup
        tag_id_override = KNOWN_TAGS.get(keywords[0].lower()) if keywords else None

        # 2. Semantic Fallback
        if not tag_id_override and keywords and keywords[0]:
            print(f"--- [Gamma Client] ❓ No direct match for '{keywords[0]}'. Attempting semantic resolution...")
            match_key = await resolve_semantic_tag(keywords[0], list(KNOWN_TAGS.keys()))
            if match_key:
                tag_id_override = KNOWN_TAGS.get(match_key)
                print(f"--- [Gamma Client] 🧠 Semantic Match Found: '{keywords[0]}' -> '{match_key}' (ID: {tag_id_override})")
            else:
                 print(f"--- [Gamma Client] ❌ No semantic match found for '{keywords[0]}'. Using raw text search.")
        
        params = {"limit": limit, "closed": "false"}
        
        if tag_id_override:
             print(f"--- [Gamma Client] 🏷️  Auto-mapped '{keywords[0]}' to Tag ID: {tag_id_override}")
             params["tag_id"] = tag_id_override
        else:
             params["q"] = query
             
        if tags and not tag_id_override:
            params["tag_id"] = tags

        try:
            resp = await client.get(f"{BASE_URL}/events", params=params)
            resp.raise_for_status()
            data = resp.json()
            
            # Helper to process events
            def process_events(event_list):
                found = []
                for event in event_list:
                    slug = event.get("slug")
                    title = event.get("title")
                    
                    # Extract tag labels for the corpus
                    tag_labels = [t.get("label", "") for t in event.get("tags", [])]
                    tag_text = " ".join(tag_labels)

                    if event.get("markets"):
                        for m in event["markets"]:
                            m["event_slug"] = slug
                            m["event_title"] = title
                            m["event_tags"] = tag_text
                            
                            # Strict Relevance Check (Restored & Improved)
                            # Check against Event Title, Market Question, Outcomes, AND Tag Labels
                            text_corpus = (m.get("question", "") + " " + (title or "") + " " + tag_text).lower()
                            
                            # Also check outcomes field
                            outcomes_raw = m.get("outcomes", "")
                            if isinstance(outcomes_raw, str):
                                try:
                                    import json
                                    outcomes = json.loads(outcomes_raw)
                                    text_corpus += " " + " ".join(outcomes).lower()
                                except:
                                    text_corpus += " " + outcomes_raw.lower()
                            elif isinstance(outcomes_raw, list):
                                text_corpus += " " + " ".join(str(o) for o in outcomes_raw).lower()
                            
                            # Debug: print what we're checking
                            matched = any(k.lower() in text_corpus for k in keywords)
                            # matched = True # Bypass removed
                            
                            if matched:
                                # print(f"✅ MATCH: '{m.get('question')[:50]}' | Keywords: {keywords}")
                                found.append(m)
                return found

            markets = process_events(data)
            
            
            # Attempt 2: Firehose (ALWAYS fetch to supplement specific query)
            # Fetch broadly without volume filter to catch ALL relevant markets
            print(f"--- [Gamma Client] 🌊 Fetching Firehose (top 500) to ensure coverage...")
            firehose_params = {"limit": 500, "closed": "false"}
            if tags:
                firehose_params["tag"] = tags
            
            try:
                resp = await client.get(f"{BASE_URL}/events", params=firehose_params)
                resp.raise_for_status()
                firehose_data = resp.json()
                firehose_markets = process_events(firehose_data)
                
                # Merge and Deduplicate
                existing_ids = set(m.get("id") for m in markets)
                for fm in firehose_markets:
                    if fm.get("id") not in existing_ids:
                        markets.append(fm)
                        existing_ids.add(fm.get("id"))
                        
            except Exception as e:
                print(f"Error fetching firehose: {e}")
                # Don't fail completely if firehose fails, just return what we have
                pass

        except Exception as e:
            print(f"Error fetching markets: {e}")
            return []

    # Stratified sampling: ensure diversity across keywords
    # Group markets by which keyword they matched, then sample evenly
    if len(keywords) > 1 and len(markets) > 100:
        print(f"--- [Gamma Client] 🎯 Stratifying {len(markets)} markets across {len(keywords)} keywords...")
        keyword_buckets = {k: [] for k in keywords}
        
    # Stratified sampling REMOVED per user request for maximum volume
    # Simply cap at 100 to avoid overloading downstream agents
    if len(markets) > 100:
        print(f"--- [Gamma Client] ⚠️ Capping at 100 markets (found {len(markets)})")
        markets = markets[:100]

    print(f"Polymarket Gamma API returned: Found {len(markets)} markets matching keywords {keywords}")
    return markets

async def fetch_market_by_id(market_id: str) -> Optional[Dict]:
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"{BASE_URL}/markets/{market_id}")
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"Error fetching market {market_id}: {e}")
            return None

async def fetch_event_by_slug(slug: str) -> List[Dict]:
    """
    Fetch markets for a given event slug.
    """
    markets = []
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"{BASE_URL}/events", params={"slug": slug})
            resp.raise_for_status()
            data = resp.json()
            for event in data:
                slug = event.get("slug")
                if event.get("markets"):
                    for m in event["markets"]:
                        m["event_slug"] = slug
                        markets.append(m)
        except Exception as e:
            print(f"Error fetching event {slug}: {e}")
    return markets
