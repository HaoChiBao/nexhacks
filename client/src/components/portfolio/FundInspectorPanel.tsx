"use client";

import { StrategyNode } from "@/lib/types/portfolio";
import { X, ExternalLink, ShieldAlert, BarChart3, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

interface FundInspectorPanelProps {
  selectedNode: StrategyNode | null;
  onClose: () => void;
}

export function FundInspectorPanel({ selectedNode, onClose }: FundInspectorPanelProps) {
  if (!selectedNode) {
    return (
      <div className="w-80 bg-surface-dark border-l border-border-dark p-6 flex flex-col items-center justify-center text-center">
        <p className="text-gray-500">Select a node to inspect details.</p>
      </div>
    );
  }

  const { meta } = selectedNode;

  return (
    <div className="w-80 bg-surface-dark border-l border-border-dark flex flex-col h-full relative z-10">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="font-bold text-white truncate pr-4">{selectedNode.label}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3 rounded-none bg-gray-900">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-4 space-y-6">
            {selectedNode.type === 'FUND' && (
              <>
                <div>
                   <span className="text-xs text-gray-400 uppercase font-bold">NAV</span>
                   <div className="text-2xl font-mono text-white mt-1">
                     {meta.nav.toLocaleString()} <span className="text-sm text-gray-500">PM</span>
                   </div>
                   <div className={meta.dayChangePct >= 0 ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                     {meta.dayChangePct >= 0 ? "+" : ""}{meta.dayChangePct}% (24h)
                   </div>
                </div>

                <div>
                   <span className="text-xs text-gray-400 uppercase font-bold mb-2 block">Top Catalysts</span>
                   <div className="space-y-3">
                      {['Election', 'Fed Rates'].map(cat => (
                        <div key={cat}>
                           <div className="flex justify-between text-xs mb-1">
                             <span className="text-gray-300">{cat}</span>
                             <span className="text-gray-500">High Impact</span>
                           </div>
                           <Progress value={75} className="h-1.5" />
                        </div>
                      ))}
                   </div>
                </div>
              </>
            )}

            {selectedNode.type === 'MARKET' && (
               <>
                 <div className="flex gap-2">
                    <span className={meta.outcome === 'YES' ? "bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs border border-green-500/30" : "bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs border border-red-500/30"}>
                        {meta.outcome}
                    </span>
                    <span className="text-xs border border-gray-700 rounded px-2 py-0.5 text-gray-400">{meta.liquidity} Liq</span>
                 </div>

                 <div className="mt-4">
                   <div className="flex justify-between items-end mb-1">
                        <span className="text-3xl font-mono text-white">{meta.price}¢</span>
                        <span className="text-xs text-gray-500 mb-1">Implied Prob</span>
                   </div>
                 </div>

                 <div className="mt-6 pt-6 border-t border-gray-800">
                    <span className="text-xs text-gray-400 uppercase font-bold mb-4 block">Target Weight</span>
                    <Slider defaultValue={[meta.weightPct]} max={100} step={1} className="mb-2" />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>0%</span>
                        <span className="text-white font-mono">{meta.weightPct}%</span>
                        <span>100%</span>
                    </div>
                 </div>

                 <a href="#" className="flex items-center gap-2 text-primary text-xs mt-6 hover:underline">
                    View on Polymarket <ExternalLink className="w-3 h-3" />
                 </a>
               </>
            )}
          </TabsContent>

          <TabsContent value="holdings" className="p-4">
             {selectedNode.type === 'FUND' && meta.markets ? (
                 <div className="space-y-4">
                    {meta.markets.map((m: any) => (
                        <div key={m.id} className="flex items-center justify-between p-2 bg-gray-800/30 rounded border border-gray-700/50">
                           <div className="flex flex-col">
                              <span className="text-xs font-medium text-white truncate max-w-[120px]">{m.title}</span>
                              <span className="text-[10px] text-gray-500">{m.outcome} • {m.price}¢</span>
                           </div>
                           <div className="text-right">
                              <div className="text-xs font-mono text-white">{m.weightPct}%</div>
                           </div>
                        </div>
                    ))}
                 </div>
             ) : (
                <div className="text-center text-xs text-gray-500 py-8">No holdings data</div>
             )}
          </TabsContent>
          
           <TabsContent value="risk" className="p-4 space-y-4">
              <div className="bg-red-900/10 border border-red-500/20 p-3 rounded">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-1">
                      <ShieldAlert className="w-3 h-3" />
                      Exposure Warning
                  </div>
                  <p className="text-[10px] text-red-300/70 leading-relaxed">
                      High concentration in "Nov 5" expiry events. Consider hedging with post-election volatility contracts.
                  </p>
              </div>
           </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
