"use client";

import { Sparkles, Zap, ShieldAlert, FileText } from "lucide-react";

export function AgentConsolePanel() {
  return (
    <div className="w-80 h-full border-r border-border-dark bg-surface-dark flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border-dark flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="font-bold text-sm text-white">Agent Console</span>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {/* Live Insights */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Live Insights</h4>
          <div className="space-y-3">
            <div className="bg-amber-900/10 border border-amber-900/30 p-3 rounded-lg">
              <div className="flex items-start gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                <span className="text-xs font-bold text-amber-200">High Catalyst Conc.</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-snug">
                Nov 5 Election drives 78% of portfolio volatility. Consider logic-branch hedges.
              </p>
            </div>
            <div className="bg-emerald-900/10 border border-emerald-900/30 p-3 rounded-lg">
               <div className="flex items-start gap-2 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                <span className="text-xs font-bold text-emerald-200">Hedge Efficiency</span>
              </div>
               <p className="text-[10px] text-gray-400 leading-snug">
                Tech Volatility hedge is performing +4.2% against sector drawdown.
              </p>
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div>
           <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h4>
           <div className="grid grid-cols-1 gap-2">
             <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-300 transition-colors text-left">
               <Zap className="w-3.5 h-3.5 text-purple-400" />
               Generate Hedge Suggestions
             </button>
             <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-300 transition-colors text-left">
               <FileText className="w-3.5 h-3.5 text-blue-400" />
               Draft Rebalance Proposal
             </button>
           </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-border-dark bg-black/20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Thinking...
        </div>
      </div>
    </div>
  );
}
