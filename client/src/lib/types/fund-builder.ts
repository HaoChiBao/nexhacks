export type FundBuilderStage = 'RESEARCH' | 'LINE_POPULATION' | 'WEIGHTING' | 'FINALIZE';

export interface UniverseRules {
  includeTags: string[];
  excludeTags: string[];
  minLiquidity: number;
  minVolume: number;
  expiryWindow: {
    minDays: number;
    maxDays: number;
  };
  sources: string[]; // e.g., ['Polymarket']
}

export interface RiskRules {
  maxWeightPerLine: number; // percentage 0-100
  minLiquidityScore: number;
  maxDrawdownLimit: number;
}

export interface MarketLine {
  id: string;
  question: string;
  slug?: string;
  source: string; // 'Polymarket'
  volume: number;
  liquidity: number;
  expiryDate: string;
  category: string;
  // Computed/Mock properties
  correlationScore: number; // 0-1
  cluster: string | null; // e.g., 'High Liquidity', 'High Probability'
  tags: string[];
  outcome?: string; // 'YES' or 'NO'
  lastPrice: number;
  reasoning?: string;
}

export interface Holding extends MarketLine {
  targetWeight: number; // percentage 0-100
  locked: boolean; // if true, weight is pinned during rebalancing normalization
}

export interface FundDraft {
  id: string;
  name: string;
  thesis: string;
  category: string;
  cadence: 'Daily' | 'Weekly' | 'Monthly' | 'Event-Driven';
  universeRules: UniverseRules;
  riskRules: RiskRules;
  holdings: Holding[];
  status: 'DRAFT' | 'PUBLISHED';
  reportMarkdown?: string;
}

export interface AgentEvent {
  id: string;
  timestamp: string; // ISO
  title: string;
  message: string;
  status: 'running' | 'done' | 'failed';
  type: 'thinking' | 'resource' | 'doc';
  resourceLink?: string; // external or internal link
  docId?: string;
}

export interface CreatedDoc {
  id: string;
  title: string;
  type: 'markdown' | 'json';
  content: string;
  createdAt: string;
}

// Mock Data Interfaces
export interface BacktestResult {
  sharpe: number;
  sortino: number;
  beta: number;
  maxDrawdown: number;
  totalReturn: number;
  chartData: { date: string; value: number }[];
}
