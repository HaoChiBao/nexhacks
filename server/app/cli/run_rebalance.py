import asyncio
import argparse
from app.services.portfolio_registry import registry
from app.graphs.supervisor_graph import supervisor_graph
from dotenv import load_dotenv

load_dotenv()

from app.schemas.portfolio import PortfolioDefinition, RiskLimits

async def main():
    parser = argparse.ArgumentParser(description="Run Portfolio Autopilot Rebalance")
    parser.add_argument("--portfolio", type=str, help="Portfolio ID (e.g., ai_policy)")
    parser.add_argument("--topic", type=str, help="Dynamic research topic (e.g. 'LeBron James')")
    parser.add_argument("--bankroll", type=float, default=100.0, help="Investment bankroll USD")
    
    args = parser.parse_args()
    
    pf = None
    if args.topic:
        # Create ephemeral portfolio on the fly
        pf = PortfolioDefinition(
            id="dynamic",
            name=f"Dynamic Fund: {args.topic}",
            description=f"Auto-generated fund for {args.topic}",
            keywords=[args.topic],
            universe_filters={"closed": False}, # No specific tag filter for dynamic
            default_risk=RiskLimits(
                max_position_pct=0.20,  # Reverted: Safety cap (max 20% per bet)
                min_liquidity_usd=1000, # Reverted: Ensure market is active/tradeable
                max_spread_pct=0.05     # Reverted: Avoid wide spreads
            )
        )
    elif args.portfolio:
        pf = registry.get(args.portfolio)
        if not pf:
            print(f"Error: Portfolio '{args.portfolio}' not found.")
            return
    else:
        print("Error: Must provide either --portfolio or --topic")
        return

    print(f"🚀 Starting Rebalance for: {pf.name}")
    print(f"💰 Bankroll: ${args.bankroll}")
    print("-" * 50)
    
    initial_state = {
        "portfolio": pf,
        "bankroll": args.bankroll,
        "user_id": "cli_user",
        "research_completed": False,
        "research_output": None,
        "allocation_plan": None,
        "recommendation_text": None,
        "messages": []
    }
    
    try:
        final_state = await supervisor_graph.ainvoke(initial_state)
        
        # 1. Print Markets to Console
        print("\n✅ WORKFLOW COMPLETE")
        print("\n--- 🛒 PROPOSED TRADES ---")
        # Extract just the allocation part (hacky split, but effective for MVP)
        full_text = final_state["recommendation_text"]
        if "### 🎯 Strategic Allocation" in full_text:
            allocation_part = full_text.split("### 🎯 Strategic Allocation")[1].split("### 📚 Sources")[0]
            print(allocation_part.strip())
        else:
            print("No trades generated.")
        print("--------------------------")
        
        # 2. Save Full Report to Downloads
        import os
        from datetime import datetime
        
        home = os.path.expanduser("~")
        downloads_dir = os.path.join(home, "Downloads")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Clean topic for filename
        safe_topic = (args.topic or args.portfolio).replace(" ", "_").lower()
        filename = f"polymarket_report_{safe_topic}_{timestamp}.md"
        file_path = os.path.join(downloads_dir, filename)
        
        with open(file_path, "w") as f:
            f.write(full_text)

        print(f"\n📄 Full Research Report saved to: {file_path}")
    except Exception as e:
        print(f"\n❌ Error running workflow: {e}")

if __name__ == "__main__":
    asyncio.run(main())
