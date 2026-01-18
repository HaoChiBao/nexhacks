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
            # Skip known non-parseable domains
            if "youtube.com" in url or "youtu.be" in url:
                print(f"Skipping video content: {url}")
                return None

            # Stronger User-Agent to pass Wikipedia/News sites
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            
            soup = BeautifulSoup(resp.text, "html.parser")
            
            # Remove scripts and styles
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            
            # Simple heuristic: get all paragraph text
            # In a real prod app, use trafilatura or similar
            paragraphs = soup.find_all("p")
            text = "\n\n".join([p.get_text().strip() for p in paragraphs if len(p.get_text()) > 40])
            
            return text[:5000] # truncate to avoid huge context
            
        except Exception as e:
            print(f"Error extracting content from {url}: {e}")
            return None
