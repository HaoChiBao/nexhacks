import { StrategyNode, StrategyEdge } from '@/lib/types/portfolio';
import { fundPositions } from './portfolio-data';

// Generate nodes from funds
const nodes: StrategyNode[] = [];
const edges: StrategyEdge[] = [];

let startX = 100;
let startY = 100;

fundPositions.forEach((fund, index) => {
  const fundNodeId = `node-${fund.id}`;
  
  // Fund Node
  nodes.push({
    id: fundNodeId,
    type: 'FUND',
    x: startX + (index * 600),
    y: startY,
    label: fund.name,
    meta: fund,
  });

  // Market Nodes
  fund.markets.forEach((market, mIndex) => {
    const marketNodeId = `node-mkt-${market.id}`;
    
    nodes.push({
      id: marketNodeId,
      type: 'MARKET',
      x: startX + (index * 600) + (mIndex % 2 === 0 ? 250 : -250),
      y: startY + 250 + (mIndex * 50),
      label: market.title,
      meta: market,
    });

    // Edge from Fund to Market
    edges.push({
      id: `edge-${fund.id}-${market.id}`,
      from: fundNodeId,
      to: marketNodeId,
      type: 'CORRELATION', 
      label: `Weight ${market.weightPct}%`,
    });
  });
});

// Add a mock Hedge Node
nodes.push({
  id: 'node-hedge-1',
  type: 'HEDGE',
  x: 400,
  y: 600,
  label: 'S&P 500 Put Dec \'24',
  meta: { price: 45, liquidity: 'High' },
});

// Edge to a market
edges.push({
  id: 'edge-hedge-1',
  from: 'node-hedge-1',
  to: 'node-mkt-1',
  type: 'HEDGE',
  label: 'Protects',
});

// Mock Parlay Edge
if (nodes.length >= 4) {
    edges.push({
        id: 'edge-parlay-1',
        from: nodes[2].id, // Market from fund 2
        to: nodes[1].id, // Market from fund 1
        type: 'PARLAY',
        label: 'Parlay',
    });
}


export const strategyNodes = nodes;
export const strategyEdges = edges;
