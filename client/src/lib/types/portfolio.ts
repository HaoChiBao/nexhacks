export type StrategyNodeType = 'FUND' | 'MARKET' | 'HEDGE';
export type StrategyEdgeType = 'CORRELATION' | 'CATALYST' | 'HEDGE' | 'PARLAY';

export interface PortfolioSummary {
  totalNav: number;
  dayChange: number;
  dayChangePct: number;
  buyingPower: number;
}

export interface MarketPosition {
  id: string;
  title: string;
  outcome: 'YES' | 'NO';
  price: number; // in cents
  liquidity: 'High' | 'Med' | 'Low';
  resolvesInDays: number;
  weightPct: number;
  role: 'MAIN' | 'HEDGE';
  catalystTags: string[];
}

export interface FundPosition {
  id: string;
  name: string;
  ticker: string; // e.g., "ELEC", "AI"
  nav: number; // PM credits
  dayChangePct: number;
  markets: MarketPosition[];
}

export interface ProposalItem {
  id: string;
  title: string;
  description: string;
  type: 'REBALANCE' | 'EXECUTION' | 'HEDGE';
  status: 'PENDING' | 'APPROVED';
  timestamp: string;
}

export interface StrategyNode {
  id: string;
  type: StrategyNodeType;
  x: number;
  y: number;
  label: string;
  meta?: any; // Hold reference to FundPosition or MarketPosition
}

export interface StrategyEdge {
  id: string;
  from: string;
  to: string;
  type: StrategyEdgeType;
  label?: string;
  strength?: number; // 0-1 for correlation
}
