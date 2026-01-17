"use client";

import { Wallet } from "lucide-react";

export function WithdrawalInfo() {
  return (
    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-gray-400" />
        <h4 className="font-bold text-lg text-white">Withdrawal Info</h4>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
          <span className="text-gray-400">Liquidity Window</span>
          <span className="text-white font-medium">Daily, 14:00 EST</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
          <span className="text-gray-400">Settlement Time</span>
          <span className="text-white font-medium">T+2 Days</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Min. Withdrawal</span>
          <span className="text-white font-medium">$1,000.00</span>
        </div>
      </div>
      <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/5">
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="font-bold text-gray-300">Audit Rule #402:</span> All
          withdrawals &gt;$50k require secondary key authorization and a 24h
          cooldown period.
        </p>
      </div>
    </div>
  );
}
