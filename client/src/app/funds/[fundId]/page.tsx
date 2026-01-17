"use client";

import { useAppStore } from "@/store/useAppStore";
import { funds } from "@/lib/data/funds";
import { HoldingsTable } from "@/components/fund-detail/HoldingsTable";
import { AuditLogTable } from "@/components/fund-detail/AuditLogTable";

import { Info, TrendingUp, Wallet, Eye, ShieldCheck, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Tabs from "@radix-ui/react-tabs";

import { useParams } from "next/navigation";

export default function FundDetailPage() {
  const params = useParams();
  const fundId = params.fundId as string;
  const { openInvestDrawer } = useAppStore();
  const fund = funds.find((f) => f.id === fundId);

  if (!fund) return <div className="p-8 text-center">Fund not found</div>;

  return (
    <div className="container mx-auto">
        {/* Breadcrumbs / Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <nav className="flex text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              <a href="/funds" className="hover:text-gray-300 transition-colors">Funds</a>
              <span className="mx-2">/</span>
              <span className="text-primary">{fund.name}</span>
            </nav>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-white tracking-tight">{fund.name}</h1>
              <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border", fund.status === 'Live' ? "bg-primary/10 text-primary border-primary/20" : "bg-yellow-900/30 text-yellow-400 border-yellow-800")}>
                {fund.status}
              </span>
            </div>
            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
              {fund.thesis}. {fund.secondaryThesis}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-border-dark text-gray-300 hover:bg-surface-hover transition-all font-medium text-sm flex items-center gap-2">
              <Eye className="w-4 h-4" /> Watch
            </button>
            <button 
                onClick={() => openInvestDrawer(fund.id)}
                className="px-6 py-2 rounded-lg bg-primary hover:bg-emerald-400 text-black font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" /> Invest
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-xl border border-border-dark bg-surface-dark relative group hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">NAV</p>
                    <Info className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-2xl font-bold text-white">${fund.metrics.nav || "10.00"}</div>
                <div className="text-xs text-primary mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +2.4% (24h)
                </div>
            </div>
              <div className="p-4 rounded-xl border border-border-dark bg-surface-dark relative group hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">AUM</p>
                    <Info className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-2xl font-bold text-white">${fund.metrics.aum || "10"}M</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center">
                    Assets Under Management
                </div>
            </div>
             <div className="p-4 rounded-xl border border-border-dark bg-surface-dark relative group hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Sharpe</p>
                    <Info className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-2xl font-bold text-white">{fund.metrics.sharpe || "2.1"}</div>
                <div className="text-xs text-primary mt-1 flex items-center">
                    Top 5% of funds
                </div>
            </div>
            <div className="p-4 rounded-xl border border-border-dark bg-surface-dark relative group hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Liquidity Profile</p>
                    <Info className="w-4 h-4 text-gray-600" />
                </div>
                 <div className="h-6 w-full bg-surface-hover rounded-full overflow-hidden border border-white/5 mt-2 flex">
                      <div className="h-full bg-blue-500 w-[60%] shadow-[0_0_10px_rgba(59,130,246,0.3)]" title="Sep"></div>
                      <div className="h-full bg-blue-400 w-[15%]" title="Oct"></div>
                      <div className="h-full bg-blue-300 w-[25%]" title="Nov"></div>
                 </div>
                 <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>Sep</span><span>Dec+</span>
                 </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
             <HoldingsTable holdings={fund.holdings} />
             <AuditLogTable />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6">
             <div className="glass-panel rounded-xl p-6 border border-border-dark">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Fund Overview</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Investment Thesis</p>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {fund.secondaryThesis}
                        </p>
                    </div>
                    <div className="border-t border-border-dark pt-4">
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">Rebalance Cadence</p>
                            <span className="text-xs text-white font-mono bg-surface-hover px-2 py-1 rounded border border-border-dark">Weekly (Sun 00:00 UTC)</span>
                        </div>
                    </div>
                    <div className="border-t border-border-dark pt-4">
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">Management Fee</p>
                            <span className="text-xs text-white">2.0% / yr</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">Performance Fee</p>
                            <span className="text-xs text-white">20% &gt; Hurdle</span>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
