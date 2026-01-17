from typing import List, Optional
from app.schemas.portfolio import PortfolioDefinition, RiskLimits

class PortfolioRegistry:
    def __init__(self):
        self._portfolios = [
            PortfolioDefinition(
                id="ai_policy",
                name="AI Policy Fund",
                description="Markets related to AI regulation and breakthroughs",
                keywords=["artificial intelligence", "AGI", "OpenAI", "regulation", "compute"],
                universe_filters={"tag": "Technology", "closed": False},
                default_risk=RiskLimits(
                    max_position_pct=0.20,
                    min_liquidity_usd=5000,
                    max_spread_pct=0.05
                )
            ),
            PortfolioDefinition(
                id="crypto_policy",
                name="Crypto Regulation Fund",
                description="Betting on crypto ETFs, bills, and SEC actions",
                keywords=["Bitcoin", "ETF", "SEC", "crypto", "stablecoin"],
                universe_filters={"tag": "Crypto", "closed": False},
                default_risk=RiskLimits(
                    max_position_pct=0.15,
                    min_liquidity_usd=10000,
                    max_spread_pct=0.03
                )
            ),
            PortfolioDefinition(
                id="sports_quant",
                name="Sports Quant Details",
                description="Data-driven sports betting opportunities",
                keywords=["NBA", "NFL", "stats", "underdog"],
                universe_filters={"tag": "Sports", "closed": False},
                default_risk=RiskLimits(
                    max_position_pct=0.10,
                    min_liquidity_usd=20000,
                    max_spread_pct=0.02
                )
            )
        ]

    def list_all(self) -> List[PortfolioDefinition]:
        return self._portfolios

    def get(self, portfolio_id: str) -> Optional[PortfolioDefinition]:
        for p in self._portfolios:
            if p.id == portfolio_id:
                return p
        return None

registry = PortfolioRegistry()
