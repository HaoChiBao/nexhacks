import json
import os
from typing import Dict, List, Any, Optional
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def enrich_fund_metadata(
    name: str, 
    holdings: List[Dict[str, Any]], 
    existing_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generates missing metadata for a fund using OpenAI.
    Only generates fields that are missing in `existing_data`.
    """
    
    # Identify missing fields
    required_fields = ["thesis", "secondary_thesis", "description", "tags", "categories"]
    missing_keys = [key for key in required_fields if not existing_data.get(key)]
    
    if not missing_keys:
        return {}

    # Compact holdings summary for context
    holdings_compact = []
    for h in holdings:
        holdings_compact.append(f"- {h.get('question', 'Unknown')} ({h.get('outcome', '?')}): {h.get('weightPct', 0)}%")
    
    holdings_str = "\n".join(holdings_compact[:10]) # Limit to 10 for prompt context
    if len(holdings) > 10:
        holdings_str += f"\n...and {len(holdings) - 10} more."

    prompt = f"""
SYSTEM:
You generate missing human-facing metadata for a prediction-market fund.
Return JSON only. Do NOT include fields that are already provided.

USER:
We have a fund with:
name: "{name}"

Holdings:
{holdings_str}

Already provided fields (do not change):
{json.dumps({k: v for k, v in existing_data.items() if k in required_fields})}

Missing fields to generate (generate ONLY these keys):
{json.dumps(missing_keys)}

Rules:
- thesis: "<Domain> / <Subdomain>" short
- secondary_thesis: one sentence 10–25 words
- description: 1–2 sentences, UI-friendly, no hype
- tags: 3 strings, broad labels
- categories: 3 strings, more specific taxonomy

Output JSON with ONLY the missing keys.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        if not content:
            return {}
            
        return json.loads(content)
        
    except Exception as e:
        print(f"Error extracting metadata from OpenAI: {e}")
        return {}
