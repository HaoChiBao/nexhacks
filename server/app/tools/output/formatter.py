from app.schemas.portfolio import AllocationPlan, ResearchResult

def format_recommendation(
    plan: AllocationPlan,
    research: ResearchResult,
    portfolio_name: str
) -> str:
    lines = []
    lines.append(f"## 🚀 Portfolio Recommendation: {portfolio_name}")
    lines.append("")
    
    lines.append("### 📊 Research Summary")
    lines.append(research.summary)
    lines.append("")
    
    lines.append("### 🎯 Strategic Allocation")
    if not plan.targets:
        lines.append("No suitable markets found matching risk criteria.")
    else:
        # Group by Event Title for clearer display
        from itertools import groupby
        # Sort first (required for groupby)
        sorted_targets = sorted(plan.targets, key=lambda x: x.event_title or "Other")
        
        for event_title, group in groupby(sorted_targets, key=lambda x: x.event_title or "Other"):
            lines.append(f"**Event: {event_title}**")
            for t in group:
                url = f"https://polymarket.com/event/{t.market_slug}" if t.market_slug else "#"
                # If outcome is YES/NO, make it clearer
                outcome_str = t.outcome
                label = t.question if t.question else t.market_id
                lines.append(f"- **{t.weight*100:.1f}%** on [{label}]({url}) ({outcome_str})")
                if t.rationale:
                    lines.append(f"  - 🤔 *Reasoning*: {t.rationale}")
                if t.citation_url:
                    lines.append(f"  - 🔗 *Source*: [{t.citation_url}]({t.citation_url})")
            lines.append("") # Spacer
    lines.append("### ⚠️ Risk Warnings")
    for w in plan.warnings:
        lines.append(f"- {w}")

    lines.append("")
    lines.append("### 📚 Sources")
    for item in research.evidence_items:
        title = item.get("title", "Article")
        url = item.get("url", "#")
        lines.append(f"- [{title}]({url})")
        
    return "\n".join(lines)
