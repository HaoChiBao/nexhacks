import { MarketLine } from '../types/market-line';
import { BacktestResult, UniverseRules } from '../types/fund-builder';
import { toMarketLine } from '../adapters/toMarketLine';

const RAW_LINES = [
  {
    id: 'mkt-001',
    question: 'US AI Safety Bill passed in 2024?',
    source: 'Polymarket',
    volume: 842000,
    liquidity: 125000,
    expiryDate: '2024-12-31',
    category: 'AI Regulation',
    correlationScore: 0.85,
    cluster: 'High Liquidity',
    tags: ['AI', 'US', 'Politics'],
    lastPrice: 0.34
  },
  {
    id: 'mkt-002',
    question: 'EU AI Act enforcement by Dec?',
    source: 'Polymarket',
    volume: 1200000,
    liquidity: 450000,
    expiryDate: '2024-12-31',
    category: 'AI Regulation',
    correlationScore: 0.91,
    cluster: 'High Liquidity',
    tags: ['AI', 'EU', 'Politics'],
    lastPrice: 0.65
  },
  {
    id: 'mkt-003',
    question: 'SEC targets major AI labs?',
    source: 'Polymarket',
    volume: 120000,
    liquidity: 15000,
    expiryDate: '2025-03-15',
    category: 'AI Regulation',
    correlationScore: 0.96,
    cluster: 'High Correlation',
    tags: ['AI', 'US', 'Regulatory'],
    lastPrice: 0.12
  },
  {
    id: 'mkt-004',
    question: 'Compute cap limits globally?',
    source: 'Polymarket',
    volume: 45000,
    liquidity: 5000,
    expiryDate: '2025-06-01',
    category: 'AI Compute',
    correlationScore: 0.89,
    cluster: 'High Correlation',
    tags: ['AI', 'Global', 'Tech'],
    lastPrice: 0.08
  },
  {
    id: 'mkt-005',
    question: 'GPT-5 Release before Nov 2024?',
    source: 'Polymarket',
    volume: 2500000,
    liquidity: 800000,
    expiryDate: '2024-11-01',
    category: 'AI Tech',
    correlationScore: 0.45,
    cluster: 'Diversification',
    tags: ['AI', 'Tech', 'Events'],
    lastPrice: 0.22
  },
  {
    id: 'mkt-006',
    question: 'OpenAI IPO in 2024?',
    source: 'Polymarket',
    volume: 670000,
    liquidity: 120000,
    expiryDate: '2024-12-31',
    category: 'Finance',
    correlationScore: 0.30,
    cluster: null,
    tags: ['AI', 'Finance'],
    lastPrice: 0.05
  },
  {
    id: 'mkt-007',
    question: 'China implements strict AI export controls?',
    source: 'Polymarket',
    volume: 320000,
    liquidity: 85000,
    expiryDate: '2024-10-15',
    category: 'Geopolitics',
    correlationScore: 0.72,
    cluster: 'Diversification',
    tags: ['AI', 'China', 'Geopolitics'],
    lastPrice: 0.44
  },
  {
    id: 'mkt-008',
    question: 'NVIDIA Market Cap > 4T by EOY?',
    source: 'Polymarket',
    volume: 4100000,
    liquidity: 1500000,
    expiryDate: '2024-12-31',
    category: 'Stocks',
    correlationScore: 0.60,
    cluster: 'High Liquidity',
    tags: ['AI', 'Stocks', 'Tech'],
    lastPrice: 0.55
  }
];

const BASE_LINES: MarketLine[] = RAW_LINES.map(line => toMarketLine(line));

export async function scanMarketUniverse(rules: UniverseRules): Promise<MarketLine[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Filter based on simple mock logic
  if (rules.includeTags.some(t => t.toLowerCase().includes('ai'))) {
      return BASE_LINES;
  }
  
  // Default fallback if no specific match
  return BASE_LINES.slice(0, 4);
}

export function generateBacktestData(): BacktestResult {
  const points = 30;
  const startValue = 100;
  const chartData = [];
  let currentValue = startValue;

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.4) * 2; // slightly positive bias
    currentValue = currentValue * (1 + change / 100);
    chartData.push({
      date: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: currentValue
    });
  }

  return {
    sharpe: 2.4,
    sortino: 3.1,
    beta: 0.45,
    maxDrawdown: -3.1,
    totalReturn: ((currentValue - startValue) / startValue) * 100,
    chartData
  };
}
