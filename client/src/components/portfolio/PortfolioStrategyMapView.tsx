"use client";

import { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  EdgeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FundNode } from './nodes/FundNode';
import { MarketNode } from './nodes/MarketNode';
import { useFundStore } from '@/store/useFundStore';
import { Fund, Holding } from '@/lib/data/funds';

// Define custom node types
const nodeTypes = {
  fund: FundNode,
  market: MarketNode,
};

export function PortfolioStrategyMapView() {
  const { funds, fetchFunds } = useFundStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  useEffect(() => {
    if (!funds || funds.length === 0) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    let currentY = 0;
    const FUND_X = 50;
    const MARKET_X = 500;
    const SPACING_Y = 300; // Space between funds
    const MARKET_SPACING_Y = 200;

    funds.forEach((fund, fundIndex) => {
        // Fund Node
        const fundNodeId = `fund-${fund.id}`;
        // Center the fund node relative to its split-out markets? 
        // Or just stack them top-down. Let's do a simple stacked layout for now.
        // We'll calculate the center Y based on the markets.
        
        const marketNodesForFund: Node[] = [];
        const marketEdgesForFund: Edge[] = [];
        
        // Markets
        fund.holdings.forEach((holding, holdingIndex) => {
            const marketNodeId = `mkt-${fund.id}-${holdingIndex}`;
            
            marketNodesForFund.push({
                id: marketNodeId,
                type: 'market',
                position: { 
                    x: MARKET_X, 
                    y: currentY + (holdingIndex * MARKET_SPACING_Y) 
                },
                data: {
                    label: holding.name,
                    outcome: holding.side,
                    prob: holding.prob,
                    weight: holding.allocation,
                    pnl: holding.return ? holding.return : undefined, // Assuming return is $ pnl or similar, interface says number
                    isHedge: false, // Defaulting, logic could be improved if 'side' opposes thesis
                    ticker: holding.ticker // Passing ticker for potential use in MarketNode
                }
            });

            marketEdgesForFund.push({
                id: `e-${fund.id}-m${holdingIndex}`,
                source: fundNodeId,
                target: marketNodeId,
                animated: true,
                style: { stroke: '#10b981', cursor: 'pointer', strokeWidth: 2 },
                label: 'View Market',
                data: { ticker: holding.ticker } // Store ticker in edge data for click handler
            });
        });

        // HEDGE logic?
        // The current data interface doesn't explicitly mark hedges in holdings, 
        // but the mock data had it. We'll stick to holdings for now.

        // Calculate fund Y position to be roughly in the middle of its markets
        const fundY = marketNodesForFund.length > 0 
            ? marketNodesForFund[0].position.y + ((marketNodesForFund.length - 1) * MARKET_SPACING_Y) / 2
            : currentY;

        newNodes.push({
            id: fundNodeId,
            type: 'fund',
            position: { x: FUND_X, y: fundY },
            data: {
                label: fund.name,
                ticker: fund.id.substring(0, 4).toUpperCase(), // details not in Fund interface fully, approximating
                nav: fund.metrics.nav || 0,
                returnPct: fund.metrics.sharpe ? fund.metrics.sharpe * 5 : 12.5 // Mocking return from sharpe if needed or just placeholder
            }
        });

        newNodes.push(...marketNodesForFund);
        newEdges.push(...marketEdgesForFund);

        // Advance Y for next fund group
        currentY += (Math.max(fund.holdings.length, 1) * MARKET_SPACING_Y) + SPACING_Y;
    });

    setNodes(newNodes);
    setEdges(newEdges);

  }, [funds, setNodes, setEdges]);


  /* Recalculate Parlays when edges change */
  useEffect(() => {
    setNodes((currentNodes) => {
        // Build adjacency map for market nodes
        const adjacency = new Map<string, string[]>();
        
        edges.forEach(edge => {
            // Only care about Market-to-Market edges? 
            // Or Fund-to-Market? Parlay is usually a chain of markets.
            // Let's assume Fund->Market is the "root" and doesn't count as a parlay link itself, 
            // but Market->Market does.
            if (edge.source.startsWith('mkt-') && edge.target.startsWith('mkt-')) {
                if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
                if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);
                
                adjacency.get(edge.source)?.push(edge.target);
                adjacency.get(edge.target)?.push(edge.source);
            }
        });

        // Identify nodes involved in a chain (degree > 0 in the market-market graph)
        // Actually, user said "lines that have 2 or move connects lines".
        // Simplest interpretation: Any market node that has at least one connection to OTHER market nodes is part of a parlay chain.
        // Wait, "2 or more connects lines". 
        // If A -> B. That's 1 connection. Are they a parlay? Yes, usually A+B is a parlay.
        // So any node in the adjacency map is part of a parlay.

        return currentNodes.map(node => {
            if (node.type !== 'market') return node;
            
            const isParlay = adjacency.has(node.id) && (adjacency.get(node.id)?.length || 0) > 0;
            
            // Only update if changed to avoid infinite loop
            if (node.data.isParlay !== isParlay) {
                return { 
                    ...node, 
                    data: { ...node.data, isParlay } 
                };
            }
            return node;
        });
    });
  }, [edges, setNodes]);


  const onConnect = useCallback((params: Connection) => {
      setEdges((eds) => addEdge({ 
          ...params, 
          animated: true, 
          style: { stroke: '#a855f7', strokeWidth: 2 } // Purple for user made connections
      }, eds))
  }, [setEdges]);

  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
      const ticker = edge.data?.ticker;
      if (ticker) {
          // Construct Polymarket URL
          // Since we don't have direct IDs, we'll search by ticker or name
          const url = `https://polymarket.com/?q=${encodeURIComponent(ticker)}`;
          window.open(url, '_blank');
      }
  }, []);

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-[#0a0a0a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-[#0a0a0a]"
      >
        <Background gap={16} size={1} color="#333" />
        <Controls className="!bg-surface-dark !border-border-dark !fill-white" />
        <MiniMap 
            className="!bg-surface-dark !border-border-dark" 
            nodeColor={(node) => {
                switch (node.type) {
                    case 'fund': return '#10b981';
                    case 'market': return node.data.isHedge ? '#ef4444' : '#3b82f6';
                    default: return '#eee';
                }
            }}
        />
      </ReactFlow>
    </div>
  );
}
