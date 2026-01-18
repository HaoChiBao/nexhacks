import { PortfolioSummary, FundPosition, ProposalItem } from "../types/portfolio";

export const MOCK_PORTFOLIO_SUMMARY: PortfolioSummary = {
  totalNavCredits: 1248320.50,
  changeTodayCredits: 12400.00,
  return30dPct: 12.4,
  navSeries: Array.from({ length: 30 }, (_, i) => {
    const base = 1100000;
    const trend = i * 4000;
    const noise = Math.random() * 15000;
    const hedge = Math.random() * 5000 + (i * 200); 
    return {
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      nav: base + trend + noise,
      hedgeImpact: hedge
    };
  }),
  allocationByFund: [
    { name: "AI Safety & Policy", pct: 55, color: "#10b981" }, 
    { name: "US Policy 2025", pct: 20, color: "#3b82f6" }, 
    { name: "BioTech Longevity", pct: 15, color: "#8b5cf6" }, 
    { name: "Global Lithium", pct: 10, color: "#f59e0b" }, 
  ],
  allocationByCategory: [
    { name: "Tech", pct: 45, color: "#10b981" },
    { name: "Politics", pct: 30, color: "#ef4444" },
    { name: "Health", pct: 15, color: "#8b5cf6" },
    { name: "Commodities", pct: 10, color: "#f59e0b" },
  ],
  mainVsHedge: { mainPct: 85, hedgePct: 15 },
  risk: {
    maxDrawdown30dPct: -2.1,
    expiryConcentrationLabel: "Low",
    liquidityScoreLabel: "High",
    catalystConcentrationTop: { label: "GPT-5 Release", pct: 18 }
  }
};

export const MOCK_FUND_POSITIONS: FundPosition[] = [
  {
    id: "f1",
    name: "AI Safety & Policy",
    categoryTag: "Tech Sector",
    navCredits: 340290,
    return30dPct: 12.5,
    hedgedPct: 22,
    riskFlags: ["Catalyst Heavy"],
    hedgeContributionCredits30d: -2400,
    description: "Thesis: Gridlock benefits large cap tech. Betting on split congress + Crypto regulation tailwinds.",
    markets: [
      { id: "m1", title: "US Safety Bill Passed", outcome: "YES", priceCents: 68, liquidity: "High", resolvesInDays: 45, weightPct: 35, role: "MAIN", catalystTags: ["Senate Vote", "AI Regulation"] },
      { id: "m2", title: "GPT-5 Release 2024", outcome: "NO", priceCents: 82, liquidity: "High", resolvesInDays: 120, weightPct: 25, role: "MAIN", catalystTags: ["Product Launch"] },
      { id: "m3", title: "Anthropic Regulation", outcome: "YES", priceCents: 45, liquidity: "Med", resolvesInDays: 60, weightPct: 15, role: "MAIN", catalystTags: ["AI Regulation"] },
    ],
    hedges: [
        { id: "m4", title: "Tech Index Volatility", outcome: "YES", priceCents: 12, liquidity: "High", resolvesInDays: 30, weightPct: 10, role: "HEDGE", catalystTags: ["Macro"] },
    ],
    lastAuditSnippet: "Verified: Risk parameters maintained during 3/14 rebalance."
  },
  {
    id: "f2",
    name: "US Policy 2025",
    categoryTag: "Politics",
    navCredits: 128400,
    return30dPct: 4.2,
    hedgedPct: 5,
    riskFlags: ["High Volatility"],
    hedgeContributionCredits30d: 450,
    description: "Betting on regulatory clarity post-2024 election cycle.",
    markets: [
      { id: "m5", title: "Regulatory Chief Confirmed", outcome: "YES", priceCents: 91, liquidity: "High", resolvesInDays: 4, weightPct: 60, role: "MAIN", catalystTags: ["Confirmation Hearing"] },
      { id: "m6", title: "Tax Bill Intro", outcome: "NO", priceCents: 33, liquidity: "Med", resolvesInDays: 14, weightPct: 30, role: "MAIN", catalystTags: ["Fiscal Policy"] },
    ],
    hedges: []
  },
  {
    id: "f3",
    name: "BioTech Longevity",
    categoryTag: "Health",
    navCredits: 89150,
    return30dPct: 0.0,
    hedgedPct: 45,
    riskFlags: [],
    hedgeContributionCredits30d: 120,
    description: "Moonshots on life extension tech matching updated FDA guidelines.",
    markets: [
      { id: "m7", title: "CRISPR Approval EU", outcome: "YES", priceCents: 22, liquidity: "Low", resolvesInDays: 180, weightPct: 50, role: "MAIN", catalystTags: ["FDA", "EMA"] },
    ],
    hedges: [
        { id: "m8", title: "Pharma Index Drop", outcome: "YES", priceCents: 8, liquidity: "High", resolvesInDays: 90, weightPct: 45, role: "HEDGE", catalystTags: ["Macro"] },
    ]
  }
];

export const MOCK_PROPOSALS: ProposalItem[] = [
  {
    id: "p1",
    type: "REBALANCE",
    title: "Increase AI Safety Exposure",
    summary: "Proposal to increase allocation by 5% due to new bill passing senate committee.",
    createdAgo: "2h ago",
    status: "NEEDS_APPROVAL",
    fundId: "f1",
    impactMetrics: [
        { label: "Est. Sharpe", value: "2.4", delta: "+0.2", positive: true },
        { label: "Hedge Cost", value: "4.2%", delta: "+0.1%", positive: false }
    ]
  },
  {
    id: "p2",
    type: "HEDGE_PACKAGE",
    title: "Close Hedge Position on EV",
    summary: "Volatility has decreased below threshold. Take profit on existing hedge.",
    createdAgo: "5h ago",
    status: "NEEDS_APPROVAL",
    fundId: "f4",
    impactMetrics: [
        { label: "Credits Released", value: "12,400 PM", delta: "", positive: true }
    ]
  }
];
