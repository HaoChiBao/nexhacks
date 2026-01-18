"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Zap, Play, Brain, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AgentConsolePanel() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "bg-surface-dark border-r border-border-dark flex flex-col transition-all duration-300 relative z-10",
        collapsed ? "w-12" : "w-80"
      )}
    >
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-border-dark rounded-full p-1 text-gray-400 hover:text-white border border-gray-700"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {!collapsed ? (
        <div className="p-4 flex flex-col h-full overflow-y-auto">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Brain className="w-5 h-5" />
            <h2 className="font-bold text-lg tracking-tight">Agent Console</h2>
          </div>

          <div className="space-y-6">
            {/* Status */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-white font-medium">Monitoring Markets</span>
              </div>
            </div>

            {/* Clusters */}
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Discovered Clusters</span>
              <div className="flex flex-wrap gap-2">
                 {['Election', 'AI Regs', 'FOMC', 'GDP'].map(tag => (
                   <span key={tag} className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium">
                     {tag}
                   </span>
                 ))}
              </div>
            </div>

            {/* Live Insights */}
            <div>
               <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Live Insights</span>
               <div className="space-y-2">
                 <div className="flex gap-2 items-start p-2 rounded hover:bg-white/5 transition-colors">
                    <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300">Catalyst concentration high in <span className="text-white font-semibold">US Election</span> cluster.</p>
                 </div>
                 <div className="flex gap-2 items-start p-2 rounded hover:bg-white/5 transition-colors">
                    <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300">Low liquidity exposure: <span className="text-white font-semibold">12%</span>. Good efficiency.</p>
                 </div>
               </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-6 space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 border-primary/30 hover:bg-primary/10 text-primary hover:text-primary">
                <Brain className="w-4 h-4" />
                Analyze Hedges
              </Button>
              <Button className="w-full justify-start gap-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 text-white border-0">
                <Play className="w-4 h-4" />
                Create Proposal
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center pt-6 gap-6">
           <Brain className="w-6 h-6 text-primary" />
           <Zap className="w-5 h-5 text-gray-500 hover:text-yellow-400 transition-colors cursor-pointer" />
           <Play className="w-5 h-5 text-gray-500 hover:text-green-400 transition-colors cursor-pointer" />
        </div>
      )}
    </div>
  );
}
