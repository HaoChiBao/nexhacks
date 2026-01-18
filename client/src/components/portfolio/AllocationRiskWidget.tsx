"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { PortfolioSummary } from "@/lib/types/portfolio";
import { ShieldCheck } from "lucide-react";

interface AllocationRiskWidgetProps {
  data: PortfolioSummary;
}

export function AllocationRiskWidget({ data }: AllocationRiskWidgetProps) {
  const [view, setView] = useState<'fund' | 'category'>('fund');

  const chartData = view === 'fund' ? data.allocationByFund : data.allocationByCategory;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Allocation Donut */}
        <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white">Allocation</h3>
                <div className="flex gap-2 text-xs">
                    <button 
                        onClick={() => setView('fund')}
                        className={`px-2 py-1 rounded ${view === 'fund' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        By Fund
                    </button>
                    <button 
                        onClick={() => setView('category')}
                        className={`px-2 py-1 rounded ${view === 'category' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        By Category
                    </button>
                </div>
            </div>
            
            <div className="flex items-center justify-center relative flex-grow min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="pct"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <span className="text-xs text-gray-500 block uppercase tracking-wider">Total</span>
                        <span className="text-xl font-bold text-white">100%</span>
                    </div>
                </div>
            </div>

             <div className="mt-4 grid grid-cols-2 gap-2">
                {chartData.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-400 flex-grow truncate">{item.name}</span>
                        <span className="text-white font-mono">{item.pct}%</span>
                    </div>
                ))}
            </div>
            
            {/* Main vs Hedge Mini Bar */}
            <div className="mt-6 pt-4 border-t border-border-dark">
                 <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-2">
                     <span>Long Exposure</span>
                     <span>Hedged</span>
                 </div>
                 <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                     <div className="h-full bg-emerald-500" style={{ width: `${data.mainVsHedge.mainPct}%` }} />
                     <div className="h-full bg-rose-500" style={{ width: `${data.mainVsHedge.hedgePct}%` }} />
                 </div>
                 <div className="flex justify-between text-xs font-mono mt-1 text-gray-300">
                     <span>{data.mainVsHedge.mainPct}%</span>
                     <span>{data.mainVsHedge.hedgePct}%</span>
                 </div>
            </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-surface-dark border border-border-dark rounded-xl p-6 h-full flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                    Risk Overview 
                </h3>
                <div className="p-1.5 bg-gray-800 rounded-lg text-gray-400">
                    <ShieldCheck className="w-4 h-4" />
                </div>
            </div>

            <div className="space-y-6 flex-grow">
                {/* Max Drawdown */}
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Max Drawdown (30D)</span>
                        <span className="text-sm font-bold text-rose-400">{data.risk.maxDrawdown30dPct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: `${Math.abs(data.risk.maxDrawdown30dPct) * 5}%` }} />
                    </div>
                 </div>

                 {/* Volatility / Liquidity Risk */}
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Liquidity Score</span>
                        <span className={`text-sm font-bold ${data.risk.liquidityScoreLabel === 'High' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {data.risk.liquidityScoreLabel}
                        </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden flex gap-0.5">
                         {[1,2,3,4,5].map(i => (
                             <div key={i} className={`flex-grow h-full rounded-sm ${i <= (data.risk.liquidityScoreLabel === 'High' ? 4 : 2) ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                         ))}
                    </div>
                 </div>

                 {/* Expiry Conc */}
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Expiry Concentration</span>
                        <span className="text-sm font-bold text-blue-400">{data.risk.expiryConcentrationLabel}</span>
                    </div>
                     <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '30%' }} />
                    </div>
                 </div>
                 
                 {/* Top Catalyst */}
                 <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 mt-2">
                     <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Top Catalyst Exposure</p>
                     <div className="flex justify-between items-center">
                         <span className="text-sm text-white font-medium">{data.risk.catalystConcentrationTop.label}</span>
                         <span className="text-sm font-mono text-amber-400">{data.risk.catalystConcentrationTop.pct}%</span>
                     </div>
                 </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border-dark">
                <button className="w-full py-2 rounded-lg border border-emerald-900/50 bg-emerald-900/10 text-emerald-500 text-xs font-bold hover:bg-emerald-900/20 transition-colors">
                    Run Risk Simulation
                </button>
            </div>
        </div>
    </div>
  );
}
