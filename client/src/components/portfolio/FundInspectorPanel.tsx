"use client";

import { X, ExternalLink, Shield } from "lucide-react";

interface FundInspectorPanelProps {
  selectedNode: any | null; // In real app, strictly typed
  onClose: () => void;
}

export function FundInspectorPanel({ selectedNode, onClose }: FundInspectorPanelProps) {
  if (!selectedNode) {
    return (
        <div className="w-80 h-full border-l border-border-dark bg-surface-dark flex items-center justify-center text-gray-600 text-xs">
            Select a node to inspect
        </div>
    );
  }

  const isFund = selectedNode.type === 'FUND';

  return (
    <div className="w-80 h-full border-l border-border-dark bg-surface-dark flex flex-col">
       <div className="p-4 border-b border-border-dark flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
                {isFund ? 'Fund Inspector' : 'Market Details'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
            </button>
       </div>

       <div className="p-4 space-y-6 overflow-y-auto">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    {selectedNode.type === 'HEDGE' && <Shield className="w-4 h-4 text-rose-400" />}
                    <h2 className="text-lg font-bold text-white leading-tight">{selectedNode.label}</h2>
                </div>
                {selectedNode.meta?.outcome && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${selectedNode.meta.outcome === 'YES' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-900' : 'bg-rose-900/20 text-rose-400 border-rose-900'}`}>
                            {selectedNode.meta.outcome}
                        </span>
                        <span className="font-mono text-sm text-gray-300">{selectedNode.meta.price}¢</span>
                    </div>
                )}
            </div>

            {/* Metrics */}
            <div className="space-y-4">
                {selectedNode.meta?.nav && (
                    <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">NAV</span>
                        <span className="text-xl font-mono text-white">{selectedNode.meta.nav}</span>
                    </div>
                )}
                 {selectedNode.meta?.risk && (
                    <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Risk Level</span>
                        <span className="text-sm font-bold text-rose-400">{selectedNode.meta.risk}</span>
                    </div>
                )}
            </div>

            {/* Mock Description */}
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <p className="text-xs text-gray-400 leading-relaxed">
                    {isFund 
                        ? "This strategy focuses on regulatory arbitrage in the US tech sector, specifically targeting AI safety bills and antitrust actions." 
                        : "Market resolving based on official senate vote count. High correlation with NVIDIA stock price movement."}
                </p>
            </div>
            
            <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2">
                {isFund ? "Invest in Strategy" : "View on Polymarket"} <ExternalLink className="w-3 h-3" />
            </button>
       </div>
    </div>
  );
}
