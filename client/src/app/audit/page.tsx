"use client";

import { Info, Download, Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { ProposalsFeed } from "@/components/audit/ProposalsFeed";
import { ActivePositions } from "@/components/audit/ActivePositions";
import { WithdrawalInfo } from "@/components/audit/WithdrawalInfo";

export default function AuditPage() {
  return (
    <div className="w-full grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8 space-y-6">
        {/* NAV Card */}
        <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark shadow-lg relative overflow-hidden group">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Audited Net Asset Value
                </h2>
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-white tracking-tight">
                  $1,248,320.50
                </span>
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.4%</span>
                </div>
              </div>
              <p className="text-gray-400 mt-2 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                Live verification active
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-medium transition-colors border border-white/5">
                <Download className="w-4 h-4" /> Audit Log
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-md transition-all">
                <Plus className="w-4 h-4" /> Deposit
              </button>
            </div>
          </div>
          
          {/* Chart Mock */}
            <div className="mt-8 flex items-end gap-2 h-16 opacity-80">
                {[40, 60, 30, 70, 55, 45, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-t-sm hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }}></div>
                ))}
            </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark flex flex-col justify-between hover:border-primary/30 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-900/20 rounded-lg"><TrendingUp className="text-purple-400 w-5 h-5"/></div>
                    <span className="text-xs font-medium text-gray-400">VOLATILITY (30D)</span>
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-white">Low</h3>
                    <p className="text-sm text-gray-400 mt-1">4.2% Standard Deviation</p>
                 </div>
            </div>
            <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark flex flex-col justify-between hover:border-primary/30 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-red-900/20 rounded-lg"><TrendingDown className="text-red-400 w-5 h-5"/></div>
                    <span className="text-xs font-medium text-gray-400">MAX DRAWDOWN</span>
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-red-400">-2.1%</h3>
                    <p className="text-sm text-gray-400 mt-1">Recovery Time: 4 days</p>
                 </div>
            </div>
             <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark flex flex-col justify-between hover:border-primary/30 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg"><Wallet className="text-primary w-5 h-5"/></div>
                    <span className="text-xs font-medium text-gray-400">LIQUIDITY</span>
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-white">$45,200</h3>
                    <p className="text-sm text-gray-400 mt-1">Available for new positions</p>
                 </div>
            </div>
        </div>

        <ActivePositions />
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-6">
        <ProposalsFeed />
        <WithdrawalInfo />
      </div>
    </div>
  );
}
