import httpx
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
BASE_URL = os.getenv("POLYMARKET_API_URL", "https://gamma-api.polymarket.com")

async def find_tag_by_parent_id():
    # Strategy: Fetch 'Gaming' (36) and 'Video Games' (3) markets and look for sub-tags
    parent_ids = ["36", "3", "65"] # Gaming, Video Games, LoL
    target_keyword = "valorant"
    
    print(f"--- Searching for '{target_keyword}' via Parent Tags {parent_ids} ---")
    
    async with httpx.AsyncClient() as client:
        found_target = False
        
        for pid in parent_ids:
            try:
                print(f"\nScanning Parent Tag ID: {pid}...")
                params = {"limit": 100, "tag_id": pid, "closed": "false"} # Fetch 100 active markets
                resp = await client.get(f"{BASE_URL}/events", params=params)
                resp.raise_for_status()
                data = resp.json()
                
                if not data:
                    print(f"No markets for tag {pid}")
                    continue

                for event in data:
                    # Check tags
                    for tag in event.get("tags", []):
                        t_id = tag.get("id")
                        t_label = tag.get("label", "")
                        t_slug = tag.get("slug", "")
                        
                        if target_keyword in t_label.lower() or target_keyword in t_slug.lower():
                            print(f"\n🎯 FOUND MATCH!")
                            print(f"Event: {event.get('title')}")
                            print(f"Tag: {t_label} (ID: {t_id}, Slug: {t_slug})")
                            found_target = True
                            
            except Exception as e:
                print(f"Error scanning {pid}: {e}")
        
        if not found_target:
            print("\n❌ Could not find target tag in parent categories.")

if __name__ == "__main__":
    asyncio.run(find_tag_by_parent_id())
