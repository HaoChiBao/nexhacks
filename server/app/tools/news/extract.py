import httpx
from bs4 import BeautifulSoup
from typing import Optional

async def extract_article_content(url: str) -> Optional[str]:
    """
    Fetch URL and extract main body text using BeautifulSoup.
    """
    if not url:
        return None
        
    async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
        try:
            # Fake user agent to avoid basic blocks
            headers = {"User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/0.1)"}
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            
            soup = BeautifulSoup(resp.text, "html.parser")
            
            # Simple heuristic: get all paragraph text
            # In a real prod app, use trafilatura or similar
            paragraphs = soup.find_all("p")
            text = "\n\n".join([p.get_text().strip() for p in paragraphs if len(p.get_text()) > 50])
            
            return text[:5000] # truncate to avoid huge context
            
        except Exception as e:
            print(f"Error extracting content from {url}: {e}")
            return None
