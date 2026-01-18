import { AuditEvent, LiveAgentStep, OtherAgentActivity, ProposalSummary } from "@/lib/types/audit";

// Mock Data
const MOCK_PROPOSAL: ProposalSummary = {
  id: "2491",
  hashId: "0x8a...4b2",
  title: "Proposal #2491: Liquidity Rebalance",
  status: "PENDING REVIEW",
  createdAgo: "Created 45 mins ago",
  agentName: "AlphaGuard-V2",
  rationale: "Risk Cap Reached",
  analysisText: "Exposure to \"Trump 2024 (Polymarket)\" has exceeded the 25% hard cap due to recent price appreciation. Proposing a trim to redistribute into \"US Senate Control\" to maintain diversification.",
  adjustments: [
    { market: "Trump 2024 Winner", currentWeight: 28.5, proposedWeight: 24.0 },
    { market: "GOP Senate Control", currentWeight: 12.0, proposedWeight: 16.5 },
  ],
  approvals: { required: 2, signed: 1 },
};

const MOCK_OTHER_ACTIVITIES: OtherAgentActivity[] = [
  {
    id: "2490",
    title: "Fee Accumulation Sweep",
    status: "QUEUED",
    tags: ["Profit Taking"],
    scheduleTime: "Scheduled: +2h",
  },
  {
    id: "2489",
    title: "Fed Rate Cut Hedge",
    status: "EXECUTED",
    tags: ["Volatility dampening"],
    hash: "On-chain: 0x7f...a1",
  },
  {
    id: "2488",
    title: "Sentiment Analysis Scan",
    status: "RESEARCHING",
    tags: ["Data Ingestion"],
  }
];

const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "e-1",
    timestampUtc: "2023-10-24T14:02:11Z",
    eventType: "Rebalance",
    description: "Reduced Kamala Harris exposure by 2%",
    initiator: { kind: "agent", name: "Sentinel-AI", avatarUrl: "AI" },
    impact: { kind: "vol", label: "Vol: -0.4%" },
    status: { kind: "onchain", state: "executed", hashOrNote: "0x4a2...99f1" },
  },
  {
    id: "e-2",
    timestampUtc: "2023-10-24T09:30:00Z",
    eventType: "Market Resolution",
    description: "Payout received: \"Fed Sep Rate Unchanged\"",
    initiator: { kind: "oracle", name: "Polymarket Oracle" },
    impact: { kind: "pnl", value: 12450.00, label: "+$12,450.00" },
    status: { kind: "onchain", state: "executed", hashOrNote: "0x8b1...22c4" },
  },
  {
    id: "e-3",
    timestampUtc: "2023-10-23T18:45:22Z",
    eventType: "Parameter Update",
    description: "Max Drawdown Limit changed: 15% → 12%",
    initiator: { kind: "admin", name: "Admin (You)" },
    impact: { kind: "none", label: "--" },
    status: { kind: "onchain", state: "executed", hashOrNote: "0x1c9...88a0" },
  },
  {
    id: "e-4",
    timestampUtc: "2023-10-23T11:20:05Z",
    eventType: "Proposal Rejected",
    description: "Declined \"Short Bitcoin\" hedge proposal",
    initiator: { kind: "admin", name: "Admin (You)" },
    impact: { kind: "fee", label: "Saved 0.5% Fee" },
    status: { kind: "offchain", state: "rejected", hashOrNote: "Off-chain rejection" },
  },
  // Add more rows to demonstrate scrolling if needed
];

// Generate more mock events
for (let i = 5; i <= 20; i++) {
    MOCK_AUDIT_EVENTS.push({
        id: `e-${i}`,
        timestampUtc: "2023-10-22T08:00:00Z",
        eventType: "Execution",
        description: `Routine rebalance step #${i}`,
        initiator: { kind: "agent", name: "AlphaGuard-V2" },
        impact: { kind: "none", label: "--" },
        status: { kind: "onchain", state: "executed", hashOrNote: `0x${i}a...f${i}` },
    });
}

const MOCK_LIVE_FEED: LiveAgentStep[] = [
    { id: "s-1", timestampUtc: new Date().toISOString(), stepType: "search", title: "Querying Polymarket liquidity depth...", detail: "Searching order books for 'Trump 2024' > $100k" },
    { id: "s-2", timestampUtc: new Date(Date.now() - 5000).toISOString(), stepType: "read", title: "Reading macro report", detail: "Ingesting 'Fed Minutes Oct 2023'" },
    { id: "s-3", timestampUtc: new Date(Date.now() - 15000).toISOString(), stepType: "analyze", title: "Calculating correlation risk", detail: "Correlation(BTC, SPX) > 0.8" },
];

export const auditApi = {
  getPendingProposal: async (): Promise<ProposalSummary> => {
    return Promise.resolve(MOCK_PROPOSAL);
  },

  listOtherActivities: async (): Promise<OtherAgentActivity[]> => {
    return Promise.resolve(MOCK_OTHER_ACTIVITIES);
  },

  listAuditEvents: async (filters: any, page: number): Promise<{ rows: AuditEvent[], total: number }> => {
    // Basic pagination mock
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    return Promise.resolve({
        rows: MOCK_AUDIT_EVENTS.slice(start, start + pageSize),
        total: MOCK_AUDIT_EVENTS.length
    });
  },

  // TODO: Connect to backend SSE at /api/agents/:proposalId/stream
  subscribeAgentFeed: (proposalId: string, onMessage: (step: LiveAgentStep) => void) => {
    // Emulate initial historical
    MOCK_LIVE_FEED.forEach(s => onMessage(s));
    
    // Emulate live stream
    const interval = setInterval(() => {
        const types: LiveAgentStep['stepType'][] = ["search", "read", "analyze", "draft"];
        const step: LiveAgentStep = {
            id: `live-${Date.now()}`,
            timestampUtc: new Date().toISOString(),
            stepType: types[Math.floor(Math.random() * types.length)],
            title: "Analyzing real-time tick data...", 
            detail: "Checking slippage tolerance"
        };
        onMessage(step);
    }, 4000);

    return () => clearInterval(interval);
  }
};
