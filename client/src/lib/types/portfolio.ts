export type MarketOutcome = "YES" | "NO";
export type MarketRole = "MAIN" | "HEDGE";
export type LiquidityLevel = "High" | "Med" | "Low";
export type ProposalStatus = "NEEDS_APPROVAL" | "APPROVED" | "EXECUTED";
export type ProposalType = "REBALANCE" | "HEDGE_PACKAGE" | "EXECUTION";

export type NodeType = "FUND" | "MARKET" | "HEDGE" | "CATALYST";
export type EdgeType = "CORRELATION" | "CATALYST" | "HEDGE" | "THEMATIC";

export interface StrategyNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  label: string;
  meta?: any; // efficient for storing node-specific data (nav, price, etc)
}

export interface StrategyEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  strength?: number; // 0-1 for opacity/thickness
}

export interface MarketPosition {
  id: string;
  title: string;
  outcome: MarketOutcome;
  priceCents: number;
  liquidity: LiquidityLevel;
  resolvesInDays: number;
  weightPct: number;
  role: MarketRole;
  catalystTags: string[];
  correlationGroup?: string;
  convictionScore?: number; // 0-100
}

export interface FundPosition {
  id: string;
  name: string;
  categoryTag: string;
  navCredits: number;
  return30dPct: number;
  hedgedPct: number;
  riskFlags: string[];
  markets: MarketPosition[]; // Separate main markets
  hedges: MarketPosition[]; // Specific hedge markets
  hedgeContributionCredits30d: number;
  lastAuditSnippet?: string;
  logo?: string;
  description?: string;
}

export interface ProposalItem {
  id: string;
  type: ProposalType;
  title: string;
  summary: string;
  createdAgo: string;
  status: ProposalStatus;
  fundId?: string;
  impactMetrics?: {
      label: string;
      value: string;
      delta?: string; // e.g. "+2.5%"
      positive?: boolean;
  }[];
}

export interface NavDataPoint {
    date: string;
    nav: number;
    hedgeImpact?: number;
}

export interface PortfolioSummary {
  totalNavCredits: number;
  changeTodayCredits: number;
  return30dPct: number;
  navSeries: NavDataPoint[];
  allocationByFund: { name: string; pct: number; color: string }[];
  allocationByCategory: { name: string; pct: number; color: string }[];
  mainVsHedge: { mainPct: number; hedgePct: number };
  risk: {
    maxDrawdown30dPct: number;
    expiryConcentrationLabel: "Low" | "Med" | "High";
    liquidityScoreLabel: "Low" | "Med" | "High";
    catalystConcentrationTop: { label: string; pct: number };
  };
}
