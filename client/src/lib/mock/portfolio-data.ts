import { PortfolioSummary, FundPosition, ProposalItem } from '@/lib/types/portfolio';

export const portfolioSummary: PortfolioSummary = {
  totalNav: 1248320.50,
  dayChange: 13450.20,
  dayChangePct: 12.4,
  buyingPower: 240.00,
};

export const fundPositions: FundPosition[] = [
  {
    id: 'fund-1',
    name: 'US Election 2024 Alpha',
    ticker: 'ELEC',
    nav: 2450120,
    dayChangePct: 18.4,
    markets: [
      {
        id: 'mkt-1',
        title: 'Presidential Winner 2024',
        outcome: 'YES',
        price: 48,
        liquidity: 'High',
        resolvesInDays: 280,
        weightPct: 45,
        role: 'MAIN',
        catalystTags: ['Nov 5 Election', 'Debates'],
      },
      {
        id: 'mkt-2',
        title: 'Senate Control: GOP',
        outcome: 'YES',
        price: 62,
        liquidity: 'Med',
        resolvesInDays: 280,
        weightPct: 30,
        role: 'MAIN',
        catalystTags: ['Polls'],
      },
    ],
  },
  {
    id: 'fund-2',
    name: 'AI Safety & Policy',
    ticker: 'AISF',
    nav: 245000,
    dayChangePct: 3.2,
    markets: [
      {
        id: 'mkt-3',
        title: 'GPT-5 Release 2024',
        outcome: 'NO',
        price: 82,
        liquidity: 'High',
        resolvesInDays: 320,
        weightPct: 40,
        role: 'MAIN',
        catalystTags: ['OpenAI DevDay'],
      },
      {
        id: 'mkt-4',
        title: 'US AI Safety Bill Passed',
        outcome: 'YES',
        price: 34,
        liquidity: 'Low',
        resolvesInDays: 150,
        weightPct: 20,
        role: 'MAIN',
        catalystTags: ['Congress'],
      },
    ],
  },
];

export const proposals: ProposalItem[] = [
  {
    id: 'prop-1',
    title: 'Increase AI Safety Exposure',
    description: 'Proposal to increase allocation by 5% due to new bill passing senate.',
    type: 'REBALANCE',
    status: 'PENDING',
    timestamp: '2h ago',
  },
  {
    id: 'prop-2',
    title: 'Close Short Position on EV',
    description: 'Volatility has decreased below threshold. Take profit.',
    type: 'HEDGE',
    status: 'PENDING',
    timestamp: '5h ago',
  },
];
