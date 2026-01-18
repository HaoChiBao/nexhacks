"use client";

import { FundPosition, MarketPosition } from "@/lib/types/portfolio";
import { ChevronDown, ChevronUp, ArrowUpRight, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MoneyUpBurst } from "./MoneyUpBurst";

interface FundPositionsListProps {
  funds: FundPosition[];
}

function MarketRow({ market }: { market: MarketPosition }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 px-2 rounded -mx-2 transition-colors">
            <div className="flex items-center gap-3">
                 <span className={cn(
                     "text-[10px] font-bold px-1.5 py-0.5 rounded border min-w-[36px] text-center",
                     market.outcome === 'YES' ? "bg-emerald-900/20 text-emerald-500 border-emerald-900/50" : "bg-rose-900/20 text-rose-500 border-rose-900/50"
                 )}>
                     {market.outcome}
                 </span>
                 <div>
                     <div className="flex items-center gap-2">
                         <p className="text-sm font-medium text-gray-200">{market.title}</p>
                         {/* Catalyst Tags */}
                         <div className="flex gap-1">
                             {market.catalystTags.map(tag => (
                                 <span key={tag} className="text-[10px] bg-gray-800 text-gray-400 px-1 rounded border border-gray-700">
                                     {tag}
                                 </span>
                             ))}
                         </div>
                     </div>
                     <div className="flex items-center gap-2 text-[10px] text-gray-500">
                         {market.role === 'HEDGE' && <span className="text-rose-400 font-bold uppercase">Hedge Line</span>}
                         <span>Liquidity: <span className="text-gray-300">{market.liquidity}</span></span>
                         <span>•</span>
                         <span>Resolves: {market.resolvesInDays}d</span>
                     </div>
                 </div>
            </div>
            
            <div className="text-right">
                <p className="font-mono text-white text-sm">{market.priceCents}¢</p>
                <div className="flex items-center justify-end gap-1.5 text-[10px]">
                    <span className="text-gray-500">Weight</span>
                    <span className={cn("font-bold", market.role === 'HEDGE' ? "text-rose-400" : "text-emerald-400")}>
                        {market.weightPct}%
                    </span>
                </div>
            </div>
        </div>
    )
}

function FundRow({ fund }: { fund: FundPosition }) {
    const [expanded, setExpanded] = useState(false);
    
    // Developer tool to simulate win for animation demo
    const [simulateWin, setSimulateWin] = useState(false);

    return (
        <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden transition-all duration-300 relative">
            {/* Win Animation Anchor */}
            <MoneyUpBurst trigger={simulateWin} amount={650} className="left-1/2 top-0" />

            {/* Header / Summary Row */}
            <div 
                onClick={() => setExpanded(!expanded)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
                        <span className="text-lg font-bold text-gray-500">{fund.name[0]}</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">{fund.name}</h4>
                        <span className="text-xs text-gray-500">{fund.categoryTag}</span>
                    </div>
                </div>

                <div className="flex items-center gap-8 md:gap-12">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">NAV Invested</p>
                        <p className="font-mono text-white font-medium">{fund.navCredits.toLocaleString()} PM</p>
                    </div>
                     <div className="text-right hidden md:block">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">30D Return</p>
                        <p className={cn("font-mono font-bold", fund.return30dPct >= 0 ? "text-emerald-400" : "text-rose-400")}>
                            {fund.return30dPct >= 0 ? "+" : ""}{fund.return30dPct}%
                        </p>
                    </div>
                     <div>
                        {fund.hedges.length > 0 ? (
                            <span className="px-2 py-1 bg-emerald-900/20 text-emerald-500 border border-emerald-900 rounded text-xs font-bold">
                                Hedged
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-gray-800 text-gray-500 border border-gray-700 rounded text-xs font-bold">
                                Unhedged
                            </span>
                        )}
                    </div>
                    <div className="text-gray-500">
                        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="px-5 pb-5 pt-0 border-t border-gray-800 ml-14 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center pt-2 mb-2">
                        <div className="text-xs text-gray-500 italic max-w-lg">
                            {fund.description}
                        </div>
                        {/* Dev Tool Toggle */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSimulateWin(true); setTimeout(() => setSimulateWin(false), 100); }} 
                            className="text-[10px] text-gray-600 hover:text-emerald-400"
                        >
                            [Simulate Win]
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
                        {/* Market List */}
                        <div className="lg:col-span-2 space-y-2">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">Core Positions (Long)</p>
                            {fund.markets.map(m => <MarketRow key={m.id} market={m} />)}
                        </div>

                        {/* Hedge & Audit Panel */}
                        <div className="space-y-4">
                             {/* Hedge Container */}
                             {fund.hedges.length > 0 && (
                                 <div className="bg-rose-950/10 border border-rose-900/30 rounded-lg p-4">
                                     <h5 className="text-xs font-bold text-rose-400 mb-2 uppercase flex items-center gap-2">
                                         <ShieldAlert className="w-3 h-3" /> Hedge Coverage
                                     </h5>
                                     {fund.hedges.map(h => (
                                         <div key={h.id} className="mb-2 last:mb-0">
                                             <div className="flex justify-between text-xs text-gray-300 font-medium">
                                                 <span>{h.title}</span>
                                                 <span className="font-mono text-rose-400">{h.weightPct}%</span>
                                             </div>
                                             <div className="text-[10px] text-gray-500 mt-1">
                                                 Protects against: <span className="text-gray-400">{h.catalystTags.join(", ")}</span>
                                             </div>
                                         </div>
                                     ))}
                                     <div className="mt-3 pt-3 border-t border-rose-900/30 flex justify-between items-center">
                                         <span className="text-[10px] text-gray-500">Contribution (30d)</span>
                                         <span className="font-mono text-sm font-bold text-rose-400">
                                            {fund.hedgeContributionCredits30d > 0 ? "+" : ""}
                                            {fund.hedgeContributionCredits30d.toLocaleString()} PM
                                         </span>
                                     </div>
                                 </div>
                             )}

                             {/* Actions */}
                             <div className="flex flex-col gap-2">
                                 <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded transition-colors flex items-center justify-center gap-2">
                                     Open Strategy Map <ArrowUpRight className="w-3 h-3" />
                                 </button>
                                 {fund.lastAuditSnippet && (
                                     <div className="mt-2 text-[10px] text-gray-500">
                                         <span className="font-bold text-emerald-500">Audit Verified:</span> {fund.lastAuditSnippet}
                                     </div>
                                 )}
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function FundPositionsList({ funds }: FundPositionsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white">Fund Positions</h3>
          <button className="text-xs font-bold text-gray-500 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded hover:text-white transition-colors">
              Sort by NAV
          </button>
      </div>
      <div className="space-y-4">
          {funds.map(fund => (
              <FundRow key={fund.id} fund={fund} />
          ))}
      </div>
    </div>
  );
}
