"use client";

import { useState, useMemo, useEffect } from "react";
import { useFundStore } from "@/store/useFundStore";
import ReactFlow, { 
  Background, 
  Controls, 
  Handle, 
  Position, 
  MarkerType,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

import { cn } from "@/lib/utils";
import { 
  Activity, 
  Zap, 
  FileText, 
  Settings, 
  ExternalLink, 
  Check, 
  X, 
  Plus, 
  Minus, 
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Map as MapIcon
} from "lucide-react";

// ----------------------------------------------------------------------
// Custom Node Component
// ----------------------------------------------------------------------
const StrategyNode = ({ data }: { data: any }) => {
    return (
        <div className={cn(
            "relative p-4 rounded-xl border transition-all duration-300 shadow-2xl min-w-[180px]",
            data.variant === 'core' && "bg-blue-950/80 border-blue-500/50 backdrop-blur-md w-[240px]",
            data.variant === 'hedge' && "bg-[#0A0A0A] border-l-4 border-l-red-500 border-gray-800 w-[200px]",
            data.variant === 'standard' && "bg-[#121418] border-gray-800 w-[180px]",
            data.variant === 'downstream' && "bg-slate-900/90 border-slate-700 w-[200px]"
        )}>
            {/* Handles */}
            <Handle type="target" position={Position.Left} className="!bg-gray-600 !w-2 !h-2" />
            <Handle type="source" position={Position.Right} className="!bg-gray-600 !w-2 !h-2" />

            {/* Header / Badges */}
            {data.variant === 'hedge' && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-red-500 uppercase">Hedge</span>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </div>
            )}
            {data.variant === 'core' && (
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-blue-400 uppercase">Core Thesis</span>
                </div>
            )}
            {data.variant === 'standard' && (
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 bg-gray-800 text-[10px] rounded text-gray-300">PM</span>
                </div>
            )}

            {/* Title */}
            <h4 className={cn(
                "font-bold text-white mb-1 leading-tight",
                data.variant === 'core' ? "text-lg mb-2" : "text-sm"
            )}>{data.title}</h4>

            {/* Metrics */}
            <div className="space-y-1">
                {data.price && (
                    <div className="flex justify-between text-xs mt-2">
                         <span className="text-gray-500">{data.prediction}</span>
                         <span className={cn("font-mono font-bold", data.prediction === 'YES' ? 'text-emerald-400' : 'text-red-400')}>{data.price}</span>
                    </div>
                )}
                {data.nav && (
                     <div className="flex justify-between text-xs">
                          <span className="text-gray-400">NAV</span>
                          <span className="text-blue-200 font-mono">{data.nav}</span>
                     </div>
                )}
                 {data.perf && (
                     <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Perf</span>
                          <span className="text-emerald-400 font-mono">{data.perf}</span>
                     </div>
                )}
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// Node Data Configuration
// ----------------------------------------------------------------------
const initialNodes: Node[] = [
    {
        id: '1',
        type: 'strategyNode',
        position: { x: 50, y: 150 },
        data: { variant: 'hedge', title: 'Tech Index Volatility', prediction: 'YES', price: '12¢' },
    },
    {
        id: '2',
        type: 'strategyNode',
        position: { x: 400, y: 120 },
        data: { variant: 'core', title: 'AI Safety & Policy', nav: '140,292 PM', perf: '+9.4% (24h)' },
    },
    {
        id: '3',
        type: 'strategyNode',
        position: { x: 750, y: 50 },
        data: { variant: 'standard', title: 'US Safety Bill Passed', prediction: 'YES', price: '45¢' },
    },
    {
        id: '4',
        type: 'strategyNode',
        position: { x: 750, y: 200 },
        data: { variant: 'standard', title: 'GPT-5 Release 2024', prediction: 'NO', price: '88¢' },
    },
    {
        id: '5',
        type: 'strategyNode',
        position: { x: 600, y: 400 },
        data: { variant: 'standard', title: 'Reg. Chief Confirmed', prediction: 'YES', price: 'ON CHAIN' },
    },
    {
        id: '6',
        type: 'strategyNode',
        position: { x: 250, y: 400 },
        data: { variant: 'downstream', title: 'US Policy 2025', nav: '120,500 PM', perf: '+0.2% /day' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'default', animated: true, style: { stroke: '#ef4444', strokeDasharray: '5,5' } },
    { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, animated: true, style: { stroke: '#10b981' } },
];


export default function FundDetailsPage({ params }: { params: { fundId: string } }) {
  const { funds, fetchFunds, isLoading: isStoreLoading } = useFundStore();
  
  // Local state for initial load check if store is empty
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    if (funds.length === 0 && !initialFetchDone) {
        fetchFunds().then(() => setInitialFetchDone(true));
    } else {
        setInitialFetchDone(true);
    }
  }, [fetchFunds, funds.length, initialFetchDone]);

  const fund = useMemo(() => {
      return funds.find(f => f.id === params.fundId);
  }, [funds, params.fundId]);

  const nodeTypes = useMemo(() => ({ strategyNode: StrategyNode }), []);

  // Generate dynamic nodes based on holdings
  const { nodes, edges } = useMemo(() => {
    if (!fund) return { nodes: initialNodes, edges: initialEdges };

    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    // Central Node (Fund Core)
    flowNodes.push({
        id: 'core',
        type: 'strategyNode',
        position: { x: 400, y: 150 },
        data: { variant: 'core', title: fund.thesis, nav: `$${fund.metrics.nav || '0'}`, perf: `${fund.metrics.sharpe ? '+' + fund.metrics.sharpe : ''} Sharpe` },
    });

    // Generate nodes for holdings
    fund.holdings.forEach((holding, index) => {
        const id = `holding-${index}`;
        // Simple layout logic: scatter them nicely
        const xOffset = (index % 2 === 0 ? 1 : -1) * (250 + (index * 50));
        const yOffset = 100 + (index * 120);
        
        flowNodes.push({
            id: id,
            type: 'strategyNode',
            position: { x: 400 + xOffset, y: yOffset },
            data: { 
                variant: holding.side === 'NO' ? 'hedge' : 'standard', 
                title: holding.name, 
                prediction: holding.side, 
                price: `${holding.prob}¢` 
            },
        });

        flowEdges.push({
            id: `edge-core-${id}`,
            source: 'core',
            target: id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#gray' },
             markerEnd: { type: MarkerType.ArrowClosed } 
        });
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [fund]);


  if (isStoreLoading && !initialFetchDone) {
      return (
          <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
              <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                  <p className="text-gray-400">Loading fund details...</p>
              </div>
          </div>
      );
  }

  if (!fund && initialFetchDone) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white p-4">
            <div className="bg-surface-dark border border-gray-800 rounded-xl p-8 max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4 text-red-500">Fund Not Found</h1>
                <p className="text-gray-400 mb-6">The fund with ID "{params.fundId}" could not be found.</p>
                <a href="/funds" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors">
                    Back to Funds
                </a>
            </div>
        </div>
      );
  }

  // Fallback for types if fund is loading
  if (!fund) return null; 

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 lg:p-6 font-sans text-gray-100 flex flex-col gap-6">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-dark border border-border-dark rounded-2xl p-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
             <img 
                src={fund.logo} 
                alt={fund.name} 
                className="w-12 h-12 rounded-lg object-cover bg-gray-800"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fund.name)}&background=random`;
                }}
             />
             <div>
                 <h1 className="text-xl font-bold text-white">{fund.name}</h1>
                 <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{fund.thesis}</p>
             </div>
        </div>

        {/* NAV Display */}
        <div className="flex items-baseline gap-4">
            <span className="text-gray-400 text-sm font-semibold tracking-wider">NAV</span>
            <span className="text-2xl font-bold font-mono text-white">{fund.metrics.nav || '0.00'} <span className="text-xs text-gray-500">PM</span></span>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded">
                +{fund.metrics.sharpe ? (fund.metrics.sharpe * 1.5).toFixed(1) : '0.0'}% 30D
            </span>
        </div>

        {/* Action */}
        <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">AUM</div>
                <div className="text-sm font-bold text-white font-mono">${fund.metrics.aum ? fund.metrics.aum + 'M' : 'N/A'}</div>
            </div>
            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
                <Plus className="w-4 h-4" /> Deposit & Invest
            </button>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[700px]">
        
        {/* LEFT: Agent Console */}
        <div className="hidden lg:flex col-span-12 lg:col-span-3 bg-surface-dark border border-border-dark rounded-2xl p-5 flex-col gap-6">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Agent Console</h2>
            </div>

            <div className="space-y-4 flex-grow">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Live Insights</div>
                
                {/* Dynamic Insight Card - Stubbed for now but linked to data */}
                <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-2">
                        <Zap className="w-4 h-4 text-amber-400 mt-0.5" />
                        <h3 className="text-sm font-bold text-amber-400">Primary Thesis</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        {fund.secondaryThesis}
                    </p>
                </div>

                {/* Insight Card 2 */}
                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-2">
                        <Activity className="w-4 h-4 text-emerald-400 mt-0.5" />
                        <h3 className="text-sm font-bold text-emerald-400">Manager</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Managed by {fund.createdBy}. Top performing assets include {fund.holdings[0]?.name || 'N/A'}.
                    </p>
                </div>
            </div>

            <div className="mt-auto space-y-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Quick Actions</div>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors text-sm font-medium text-gray-200">
                    <Zap className="w-4 h-4 text-purple-400" /> Generate Hedge Suggestions
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors text-sm font-medium text-gray-200">
                    <FileText className="w-4 h-4 text-blue-400" /> Draft Rebalance Proposal
                </button>
            </div>
        </div>

        {/* CENTER: Infinite Canvas (ReactFlow) */}
        <div className="col-span-12 lg:col-span-6 bg-[#050505] border border-border-dark rounded-2xl relative overflow-hidden group">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                className="bg-[#050505]"
            >
                <Background color="#333" gap={20} size={1} />
                <Controls className="bg-gray-900 border border-gray-800 text-gray-400 fill-gray-400" />
            </ReactFlow>
            
            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button className="p-2 bg-gray-900/80 backdrop-blur border border-gray-800 rounded-lg text-gray-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* RIGHT: Market Details */}
        <div className="col-span-12 lg:col-span-3 bg-surface-dark border border-border-dark rounded-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-border-dark flex justify-between items-center bg-gray-900/30">
                <h2 className="text-lg font-bold text-white">Market Details</h2>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                
                {fund.holdings.map((holding, i) => (
                    <BetCard 
                        key={i}
                        title={holding.name}
                        line={holding.side}
                        price={`${holding.prob}¢`}
                        description={holding.description || holding.rationale || "No description available."}
                        isOver={false}
                        type={holding.side === 'YES' ? 'Yes' : 'No'}
                        initialAlloc={holding.allocation}
                    />
                ))}

            </div>

             <div className="p-4 border-t border-border-dark bg-gray-900/50">
                 <a 
                    href="https://polymarket.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold hover:bg-emerald-900/60 transition-colors"
                 >
                    <ExternalLink className="w-4 h-4" /> View on Polymarket
                 </a>
             </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-Components (BetCard) - Kept Same
// ----------------------------------------------------------------------

function BetCard({ title, line, price, description, isOver, type, initialAlloc = 0 }: any) {
    const [confirmed, setConfirmed] = useState(false);
    const [allocation, setAllocation] = useState(initialAlloc);

    const handleConfirm = () => {
        setConfirmed(true);
    };

    if (confirmed) {
        return (
            <div className="bg-gray-900/20 border border-gray-800 rounded-xl p-4 opacity-50 select-none grayscale transition-all text-center py-8">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-sm font-bold text-gray-500">Bet Placed Successfully</div>
            </div>
        );
    }

    return (
        <div className="bg-[#121418] border border-gray-800 rounded-xl p-5 relative group hover:border-gray-700 transition-colors">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                     <Activity className="w-4 h-4 text-primary" />
                     <h3 className="font-bold text-base text-white leading-tight max-w-[150px]">{title}</h3>
                </div>
                <a href="https://polymarket.com" target="_blank" className="p-1.5 bg-gray-800 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                     <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>

            {/* Line Info */}
            <div className="flex items-center gap-3 mb-4">
                <span className={cn("text-xs font-black px-2 py-1 rounded", type === 'Yes' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")}>
                    {line}
                </span>
                <span className="text-xl font-mono font-bold text-white">{price}</span>
            </div>

            {/* Over/Under Visual */}
            <div className="absolute top-12 right-6 rotate-[-10deg] opacity-10 font-black text-4xl pointer-events-none">
                {type === 'Yes' ? 'LONG' : 'SHORT'}
            </div>

            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                {description}
            </p>

            {/* Input Slider */}
            <div className="mb-6">
                 <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>Allocation</span>
                    <span className="text-white font-mono">${allocation}</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={allocation} 
                    onChange={(e) => setAllocation(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                 />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
                 <button className="flex items-center justify-center py-2.5 rounded-lg border border-red-900/50 text-red-500 hover:bg-red-950/30 transition-colors">
                     <X className="w-5 h-5" />
                 </button>
                 <button 
                    onClick={handleConfirm}
                    className="flex items-center justify-center py-2.5 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors relative overflow-hidden"
                 >
                     <Check className="w-5 h-5" />
                 </button>
            </div>
        </div>
    );
}
