"use client";

import { cn } from "@/lib/utils";
import { Eye, Check, X } from "lucide-react";

export function ProposalsFeed() {
  const proposals = [
    {
      id: "PROP-2901",
      title: "Climate Policy Fund: Carbon Credit Spike 2025",
      confidence: "High",
      time: "2h ago",
      impact: "+2.4% Exp. Return",
      diff: "Arbitrage / EU ETS",
      status: "Proposed",
    },
    {
      id: "PROP-2902",
      title: "SpaceX Logistics: 2026 Contracts",
      confidence: "Medium",
      time: "5h ago",
      impact: "High Variance",
      diff: "Private Equity",
      status: "Reviewed",
    },
     {
      id: "PROP-2903",
      title: "Quantum Computing Hardware Index",
      confidence: "Low",
      time: "1d ago",
      impact: "Long Horizon",
      diff: "Basket / ETF",
      status: "Proposed",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Proposals Feed</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
          3 Live
        </span>
      </div>
      <div className="bg-surface-dark border border-border-dark rounded-2xl p-2 h-auto max-h-[800px] overflow-y-auto custom-scroll shadow-inner">
        {proposals.map((prop, i) => (
          <div
            key={i}
            className="p-4 rounded-xl hover:bg-surface-hover/50 transition-colors border-b border-border-dark/50 last:border-0 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    prop.confidence === "High" ? "text-emerald-400" :
                    prop.confidence === "Medium" ? "text-yellow-400" : "text-blue-400"
                  )}
                >
                  Confidence: {prop.confidence}
                </span>
                <span className="text-[10px] text-gray-400">ID: #{prop.id}</span>
              </div>
              <span className="text-xs text-gray-400">{prop.time}</span>
            </div>
            <h4 className="font-bold text-white mb-2 leading-tight">
              {prop.title}
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase">
                  Impact Summary
                </div>
                <div className="text-xs text-gray-300">{prop.impact}</div>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase">
                  Trade Diff
                </div>
                <div className="text-xs text-gray-300">{prop.diff}</div>
              </div>
            </div>

            {/* Stepper Mock */}
            <div className="flex items-center gap-1 mb-4 text-xs">
              <div className="flex items-center w-full">
                 <div className={cn("w-2 h-2 rounded-full", "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]")}></div>
                 <div className={cn("flex-grow h-0.5 mx-1", prop.status !== 'Proposed' ? "bg-emerald-500" : "bg-gray-700")}></div>
                 <div className={cn("w-2 h-2 rounded-full", prop.status !== 'Proposed' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-gray-700")}></div>
                 <div className="flex-grow h-0.5 mx-1 bg-gray-700"></div>
                 <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              </div>
            </div>
            
             <div className="flex justify-between text-[10px] text-gray-500 mb-4 px-1">
                <span className="text-primary">Proposed</span>
                <span className={prop.status !== 'Proposed' ? "text-primary": ""}>Reviewed</span>
                <span>Executed</span>
             </div>

            <div className="flex gap-2">
              {prop.status === 'Proposed' ? (
                  <button className="flex-1 py-2 bg-white text-gray-900 rounded-lg text-sm font-bold hover:shadow-lg transition-all">
                    Approve
                  </button>
              ) : (
                   <button className="flex-1 py-2 bg-transparent border border-border-dark text-white rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-all">
                    Execute Trade
                  </button>
              )}
              
              <button className="px-3 py-2 border border-border-dark bg-transparent rounded-lg text-gray-500 hover:text-white transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
