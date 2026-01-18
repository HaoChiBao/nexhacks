"use client";

import { useRef, useState, useEffect } from "react";
import { MOCK_STRATEGY_NODES, MOCK_STRATEGY_EDGES } from "@/lib/mock/strategy-map";
import { StrategyNode } from "@/lib/types/portfolio";
import { AgentConsolePanel } from "./AgentConsolePanel";
import { FundInspectorPanel } from "./FundInspectorPanel";
import { Plus, Minus, Move, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { MoneyUpBurst } from "./MoneyUpBurst";

export function PortfolioStrategyMapView() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Animation state
  const [triggerWin, setTriggerWin] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
     if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const s = Math.exp(-e.deltaY * 0.001);
        setScale(prev => Math.min(Math.max(prev * s, 0.2), 3));
     } else {
        setOffset(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
     }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      // middle click or space+click for drag
      if (e.button === 1 || e.button === 0) {
          setIsDragging(true);
          setDragStart({ x: e.clientX, y: e.clientY });
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
          const dx = e.clientX - dragStart.x;
          const dy = e.clientY - dragStart.y;
          setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
          setDragStart({ x: e.clientX, y: e.clientY });
      }
  };

  const handleMouseUp = () => {
      setIsDragging(false);
  };

  const selectedNode = MOCK_STRATEGY_NODES.find(n => n.id === selectedNodeId);

  return (
    <div className="flex h-[calc(100vh-140px)] border-t border-border-dark overflow-hidden bg-[#09090b]">
        {/* Left Panel */}
        <div className="hidden md:block z-10 shrink-0">
            <AgentConsolePanel />
        </div>

        {/* Canvas Area */}
        <div 
            className="flex-grow relative overflow-hidden cursor-move bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={containerRef}
        >
            <div 
                className="absolute inset-0 origin-center transition-transform duration-75 ease-linear will-change-transform"
                style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
            >
                {/* Edges SVG Layer */}
                <svg className="absolute top-0 left-0 w-[2000px] h-[2000px] overflow-visible pointer-events-none opacity-50">
                    {MOCK_STRATEGY_EDGES.map(edge => {
                        const source = MOCK_STRATEGY_NODES.find(n => n.id === edge.source);
                        const target = MOCK_STRATEGY_NODES.find(n => n.id === edge.target);
                        if (!source || !target) return null;
                        
                        return (
                            <g key={edge.id}>
                                <line 
                                    x1={source.x + 80} y1={source.y + 40} 
                                    x2={target.x + 80} y2={target.y + 40} 
                                    stroke={edge.type === 'HEDGE' ? '#f43f5e' : '#52525b'} 
                                    strokeWidth={2 * scale}
                                    strokeDasharray={edge.type === 'HEDGE' ? "4 4" : ""}
                                />
                                {edge.label && (
                                    <text 
                                        x={(source.x + target.x)/2 + 80} 
                                        y={(source.y + target.y)/2 + 30}
                                        fill="#a1a1aa"
                                        fontSize={12}
                                        textAnchor="middle"
                                    >
                                        {edge.label}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Nodes */}
                {MOCK_STRATEGY_NODES.map(node => (
                    <div
                        key={node.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                        className={cn(
                            "absolute w-40 p-3 rounded-lg border shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95",
                            node.id === selectedNodeId ? "ring-2 ring-emerald-500 z-50" : "z-10",
                            node.type === 'FUND' && "bg-gray-900 border-gray-700 w-56 p-4",
                            node.type === 'MARKET' && "bg-black border-gray-800",
                            node.type === 'HEDGE' && "bg-rose-950/20 border-rose-900/40",
                            node.type === 'CATALYST' && "bg-blue-950/20 border-blue-900/40 rounded-full h-24 w-24 flex items-center justify-center text-center p-2"
                        )}
                        style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                    >
                         {/* Win Animation Anchor */}
                         {node.id === 'm1' && <MoneyUpBurst trigger={triggerWin} className="-top-10" />}

                         <div className="flex justify-between items-start mb-2">
                             {node.type === 'MARKET' && <span className="text-[10px] bg-blue-600 text-white px-1 rounded">PM</span>}
                             {node.type === 'HEDGE' && <Shield className="w-3 h-3 text-rose-500" />}
                         </div>
                         
                         <h4 className={cn("font-bold text-white line-clamp-2", node.type === 'FUND' ? "text-lg" : "text-xs")}>
                             {node.label}
                         </h4>
                         
                         {node.type === 'FUND' && (
                             <div className="mt-2 text-xs text-gray-400">
                                 <div>NAV: <span className="text-emerald-400 font-mono">{node.meta.nav}</span></div>
                                 <div className="text-[10px] mt-1 text-emerald-600">{node.meta.return} (30d)</div>
                             </div>
                         )}

                         {(node.type === 'MARKET' || node.type === 'HEDGE') && (
                             <div className="mt-2 flex justify-between text-[10px] font-mono text-gray-400">
                                 <span className={node.meta.outcome === 'YES' ? "text-emerald-500" : "text-rose-500"}>
                                     {node.meta.outcome}
                                 </span>
                                 <span>{node.meta.price}¢</span>
                             </div>
                         )}
                    </div>
                ))}
            </div>
        </div>

        {/* Right Panel: Inspector */}
        <div className="z-10 shrink-0 border-l border-border-dark">
            <FundInspectorPanel selectedNode={selectedNode} onClose={() => setSelectedNodeId(null)} />
        </div>

        {/* Overlay Controls */}
        <div className="absolute bottom-6 right-80 mx-auto left-80 flex justify-center gap-4 pointer-events-none">
            <div className="bg-gray-900/80 backdrop-blur border border-gray-700/50 p-2 rounded-lg flex items-center gap-2 pointer-events-auto shadow-xl">
                 <button onClick={() => setScale(s => s - 0.2)} className="p-2 hover:bg-white/10 rounded"><Minus className="w-4 h-4 text-white" /></button>
                 <span className="text-xs font-mono text-gray-400 w-12 text-center">{(scale*100).toFixed(0)}%</span>
                 <button onClick={() => setScale(s => s + 0.2)} className="p-2 hover:bg-white/10 rounded"><Plus className="w-4 h-4 text-white" /></button>
            </div>
            
            <button 
                onClick={() => setTriggerWin(true)}
                className="bg-emerald-900/80 backdrop-blur border border-emerald-500/30 px-4 py-2 rounded-lg pointer-events-auto text-emerald-400 text-xs font-bold hover:bg-emerald-900 transition-colors shadow-lg"
            >
                Simulate Win
            </button>
        </div>
    </div>
  );
}
