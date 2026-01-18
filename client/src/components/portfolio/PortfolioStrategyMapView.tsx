"use client";

import { useCallback, useMemo } from 'react';
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
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FundNode } from './nodes/FundNode';
import { MarketNode } from './nodes/MarketNode';

// Define custom node types
const nodeTypes = {
  fund: FundNode,
  market: MarketNode,
};

// Initial Mock Data
const initialNodes: Node[] = [
  // Funds
  { 
    id: 'fund-1', 
    type: 'fund', 
    position: { x: 50, y: 50 }, 
    data: { label: 'US Election Alpha', ticker: 'ELEC', nav: 2450120, returnPct: 18.4 } 
  },
  { 
    id: 'fund-2', 
    type: 'fund', 
    position: { x: 50, y: 400 }, 
    data: { label: 'AI Safety & Policy', ticker: 'AISF', nav: 245000, returnPct: 3.2 } 
  },

  // Markets for Fund 1
  { 
    id: 'mkt-1', 
    type: 'market', 
    position: { x: 500, y: 0 }, 
    data: { label: 'Presidential Winner 2024', outcome: 'YES', prob: 48, weight: 45, pnl: 12400 } 
  },
  { 
    id: 'mkt-2', 
    type: 'market', 
    position: { x: 500, y: 200 }, 
    data: { label: 'Senate Control: GOP', outcome: 'YES', prob: 62, weight: 30, pnl: 4500 } 
  },
  
  // Markets for Fund 2
  { 
    id: 'mkt-3', 
    type: 'market', 
    position: { x: 500, y: 400 }, 
    data: { label: 'GPT-5 Release 2024', outcome: 'NO', prob: 82, weight: 40, pnl: -1200 } 
  },
  
  // Hedge
  { 
    id: 'mkt-hedge', 
    type: 'market', 
    position: { x: 500, y: 600 }, 
    data: { label: 'Oil > $90 Dec 2024', outcome: 'YES', prob: 15, weight: 15, pnl: 800, isHedge: true } 
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-1', source: 'fund-1', target: 'mkt-1', animated: true, style: { stroke: '#10b981' } },
  { id: 'e1-2', source: 'fund-1', target: 'mkt-2', animated: true, style: { stroke: '#10b981' } },
  { id: 'e2-3', source: 'fund-2', target: 'mkt-3', animated: true, style: { stroke: '#10b981' } },
  { id: 'e2-h', source: 'fund-2', target: 'mkt-hedge', animated: true, style: { stroke: '#ef4444', strokeDasharray: '5,5' }, label: 'HEDGE' },
];

export function PortfolioStrategyMapView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-[#0a0a0a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
