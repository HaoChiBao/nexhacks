from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import os

async def extract_search_keywords(topic: str, description: str) -> list[str]:
    """
    Extracts specific search keywords from a topic and description.
    Returns a list of strings (e.g. ["NBA", "NFL", "MLB"]).
    """
    if "placeholder" in os.getenv("OPENAI_API_KEY", "placeholder"):
        return [topic]

    llm = ChatOpenAI(model="gpt-4o", temperature=0)

    prompt = (
        f"Topic: '{topic}'\n"
        f"Context/Thesis: '{description}'\n\n"
        "Task: Extract 3-5 SPECIFIC, short search keywords to find relevant prediction markets.\n"
        "IMPORTANT: Keep keywords SIMPLE and search-friendly. Avoid formal suffixes like 'Inc.', 'Corp', 'Ltd'.\n"
        "Examples:\n"
        "- 'Apple Inc.' → 'Apple'\n"
        "- 'Toronto Raptors' → 'Raptors'\n"
        "- 'Bitcoin cryptocurrency' → 'Bitcoin'\n\n"
        "CRITICAL RULES:\n"
        "1. If the topic is a SPECIFIC team/company/person (e.g. 'Raptors', 'Lakers', 'Apple'), use ONLY that keyword. DO NOT expand.\n"
        "2. ONLY expand if the topic is VERY BROAD with NO specific entity mentioned:\n"
        "   - 'Sports' (generic) → 'NBA, NFL, MLB, NHL, Premier League'\n"
        "   - 'Technology' (generic) → 'Apple, Google, Microsoft, Tesla'\n"
        "   - 'Crypto' (generic) → 'Bitcoin, Ethereum, Solana'\n"
        "3. If user mentions a team name like 'Raptors', 'Warriors', 'Lakers',output ONLY that team name.\n\n"
        "Output ONLY a comma-separated list of keywords. Do not number them."
    )

    msg = await llm.ainvoke([SystemMessage(content="You are a search optimizer."), HumanMessage(content=prompt)])
    content = msg.content.strip()
    
    # Cleaning
    keywords = [k.strip().replace('"', '') for k in content.split(',')]
    return keywords
