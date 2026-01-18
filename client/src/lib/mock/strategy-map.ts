import { StrategyNode, StrategyEdge } from "../types/portfolio";

export const MOCK_STRATEGY_NODES: StrategyNode[] = [
  // F1: AI Safety Fund Cluster
  { id: "f1", type: "FUND", x: 400, y: 300, label: "AI Safety & Policy", meta: { nav: "340,290 PM", return: "+12.5%" } },
  { id: "m1", type: "MARKET", x: 600, y: 200, label: "US Safety Bill Passed", meta: { outcome: "YES", price: 68 } },
  { id: "m2", type: "MARKET", x: 650, y: 350, label: "GPT-5 Release 2024", meta: { outcome: "NO", price: 82 } },
  { id: "h1", type: "HEDGE", x: 200, y: 300, label: "Tech Index Volatility", meta: { outcome: "YES", price: 12 } },

  // F2: US Policy Fund Cluster
  { id: "f2", type: "FUND", x: 400, y: 800, label: "US Policy 2025", meta: { nav: "128,400 PM", return: "+4.2%" } },
  { id: "m5", type: "MARKET", x: 600, y: 700, label: "Reg. Chief Confirmed", meta: { outcome: "YES", price: 91 } },
  { id: "m6", type: "MARKET", x: 600, y: 900, label: "Tax Bill Intro", meta: { outcome: "NO", price: 33 } },

  // Shared Catalysts
  { id: "c1", type: "CATALYST", x: 800, y: 500, label: "Nov 5 Election", meta: { risk: "High" } },
];

export const MOCK_STRATEGY_EDGES: StrategyEdge[] = [
  // F1 Connections
  { id: "e1", source: "f1", target: "m1", type: "CORRELATION", strength: 1 },
  { id: "e2", source: "f1", target: "m2", type: "CORRELATION", strength: 1 },
  { id: "e3", source: "h1", target: "f1", type: "HEDGE", label: "Protects Downside", strength: 0.8 },
  
  // F2 Connections
  { id: "e4", source: "f2", target: "m5", type: "CORRELATION", strength: 1 },
  { id: "e5", source: "f2", target: "m6", type: "CORRELATION", strength: 1 },

  // Cross-Fund / Catalyst Connections
  { id: "e6", source: "m1", target: "c1", type: "CATALYST", strength: 0.5 },
  { id: "e7", source: "m5", target: "c1", type: "CATALYST", strength: 0.5 },
  { id: "e8", source: "m1", target: "m5", type: "CORRELATION", label: "ρ=0.65", strength: 0.3 }, // Correlation between bill and confirmation
];
