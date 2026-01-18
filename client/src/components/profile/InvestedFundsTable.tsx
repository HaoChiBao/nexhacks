"use client";

import { FundInvestment } from "@/lib/mock/users";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Shield, Zap, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function FundRow({ fund, totalInvested }: { fund: FundInvestment; totalInvested: number }) {
    const [expanded, setExpanded] = useState(false);
    const percentOfPortfolio = (fund.investedPm / totalInvested) * 100;
    
    return (
        <div className="border-b border-gray-800/50 last:border-0">
            <div 
                className="p-4 hover:bg-gray-900/30 transition-colors cursor-pointer group"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    {/* Fund Info */}
                    <div className="flex items-center gap-4 min-w-[30%]">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center border font-bold text-lg",
                            fund.return30dPct >= 0 ? "bg-emerald-900/20 border-emerald-500/20 text-emerald-500" : "bg-red-900/20 border-red-500/20 text-red-500"
                        )}>
                            {fund.fundName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors">{fund.fundName}</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">
                                    {fund.fundCategory}
                                </span>
                                {fund.hedgedPct && (
                                    <span className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-900/10 px-1.5 py-0.5 rounded border border-amber-900/20">
                                        <Shield className="w-2.5 h-2.5" /> Hedged {fund.hedgedPct}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="flex items-center gap-8 md:gap-12 text-sm">
                        <div className="text-right">
                            <div className="text-xs text-gray-500 mb-0.5">Invested</div>
                            <div className="font-mono text-gray-300">{fund.investedPm.toLocaleString()} PM</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 mb-0.5">Current NAV</div>
                            <div className={cn(
                                "font-mono font-bold",
                                fund.currentNavPm >= fund.investedPm ? "text-emerald-400" : "text-red-400"
                            )}>{fund.currentNavPm.toLocaleString()} PM</div>
                        </div>
                        <div className="text-right w-16">
                            <div className="text-xs text-gray-500 mb-0.5">30D</div>
                            <div className={cn(
                                "font-mono font-bold flex items-center justify-end gap-1",
                                fund.return30dPct >= 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                                {fund.return30dPct >= 0 ? '+' : ''}{fund.return30dPct}%
                            </div>
                        </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="pl-4">
                        {expanded ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                    </div>
                </div>
                
                {/* Portfolio Progress Bar */}
                <div className="mt-3 flex items-center gap-2">
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary/50" 
                            style={{ width: `${percentOfPortfolio}%` }} 
                        />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono w-12 text-right">{percentOfPortfolio.toFixed(1)}%</span>
                </div>
            </div>

            {/* Expanded Details - Top Markets */}
            {expanded && fund.topMarkets && (
                <div className="bg-[#0cf2] border-t border-gray-800/50 p-4 pl-[72px]">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Top Markets
                    </h5>
                    <div className="grid gap-2">
                        {fund.topMarkets.map((market, i) => (
                            <div key={i} className="flex items-center justify-between text-sm bg-gray-900/50 p-2 rounded border border-gray-800/50">
                                <span className="text-gray-300 truncate max-w-[300px]">{market.title}</span>
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                                        market.outcome === 'YES' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                    )}>
                                        {market.outcome}
                                    </span>
                                    <span className="font-mono text-gray-400">{market.priceCents}¢</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function InvestedFundsTable({ investments, totalInvested }: { investments: FundInvestment[], totalInvested: number }) {
    if (!investments.length) {
        return (
            <div className="p-8 text-center text-gray-500 bg-surface-dark border border-border-dark rounded-xl">
                No active investments found.
            </div>
        );
    }

    return (
        <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-border-dark flex items-center justify-between bg-gray-900/50">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Active Positions
                </h3>
                <span className="text-xs text-gray-500">{investments.length} Funds</span>
            </div>
            
            <div className="divide-y divide-gray-800/50">
                {investments.map((fund) => (
                    <FundRow key={fund.fundId} fund={fund} totalInvested={totalInvested} />
                ))}
            </div>
        </div>
    );
}
