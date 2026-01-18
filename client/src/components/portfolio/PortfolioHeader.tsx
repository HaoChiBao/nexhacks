"use client";

import { Plus } from "lucide-react";

interface PortfolioHeaderProps {
  navCredits: number;
  balanceCredits: number;
  change30dPct: number;
}

export function PortfolioHeader({ navCredits, balanceCredits, change30dPct }: PortfolioHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            {navCredits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
          <span className="text-sm font-bold text-gray-400">PM Credits (NAV)</span>
        </div>
        <div className="flex items-center gap-3">
             <span className={change30dPct >= 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
               {change30dPct >= 0 ? "+" : ""}{change30dPct}% (30d)
             </span>
             <span className="text-gray-500 text-sm">
                | &nbsp; Available Balance: <span className="text-gray-300 font-mono">{balanceCredits.toFixed(2)} PM</span>
             </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-surface-dark border border-border-dark p-1 rounded-lg flex items-center">
            {['7D', '30D', '90D', 'ALL'].map((tf, i) => (
                <button 
                    key={tf} 
                    className={`px-3 py-1.5 text-xs font-bold rounded ${i === 1 ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {tf}
                </button>
            ))}
        </div>
        
        <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Deposit
        </button>
      </div>
    </div>
  );
}
