"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAppStore } from "@/store/useAppStore";
import { funds } from "@/lib/data/funds";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import * as Switch from "@radix-ui/react-switch";
import { Info, Lock, Clock, TrendingUp, AlertTriangle } from "lucide-react";

export function InvestDrawer() {
  const {
    investDrawerOpen,
    closeInvestDrawer,
    selectedFundId,
    balance,
    isLiveMode,
    addDeposit,
  } = useAppStore();
  const [amount, setAmount] = useState<number>(2500);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // If no fund, return null (should be handled by parent/state)
  const fund = funds.find((f) => f.id === selectedFundId);

  useEffect(() => {
    setAmount(2500);
    setAgreeTerms(false);
    setIsProcessing(false);
  }, [investDrawerOpen, selectedFundId]);

  if (!fund) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) closeInvestDrawer();
  };

  const handleInvest = () => {
    if (!agreeTerms) return;
    setIsProcessing(true);
    setTimeout(() => {
        addDeposit(-amount); // Deduct balance mock
        setIsProcessing(false);
        closeInvestDrawer();
        alert(isLiveMode ? "Transaction Requested" : "Simulated Deposit Created");
    }, 1500);
  };

  const liquidityWarning = fund.metrics.liquidityScore < 60;
  const slippage = Math.min((amount / 10000) * 0.4, 2.5).toFixed(2);

  return (
    <Sheet open={investDrawerOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        className="w-full sm:max-w-lg bg-surface-dark border-border-dark text-white p-0 flex flex-col"
        side="right"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="p-6 border-b border-border-dark flex justify-between items-center z-10 bg-surface-dark/95 backdrop-blur-md sticky top-0">
          <div>
            <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-primary w-6 h-6" /> Invest Flow
            </SheetTitle>
            <SheetDescription className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-semibold flex items-center gap-2">
              Fund ID: {fund.id.toUpperCase()}{" "}
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              {fund.status === "Live" ? (
                <span className="text-emerald-500">Live</span>
              ) : (
                <span className="text-yellow-500">{fund.status}</span>
              )}
            </SheetDescription>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto z-10 p-6 space-y-8 custom-scroll">
            
            {/* Fund Summary Card */}
          <div className="bg-surface-hover/50 rounded-xl p-4 border border-border-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <TrendingUp className="text-6xl text-emerald-500" />
            </div>
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <img
                  alt="Fund Icon"
                  className="w-12 h-12 rounded-xl shadow-lg ring-1 ring-gray-700 object-cover"
                  src={fund.logo}
                />
                <div>
                  <h3 className="font-bold text-white text-lg">{fund.name}</h3>
                  <p className="text-xs text-gray-400">Managed by PrintMoney Core</p>
                </div>
              </div>
            </div>
          </div>
            
            {/* Main Input */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-medium text-gray-300">
                Investment Amount
              </label>
              {liquidityWarning && (
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <AlertTriangle className="w-3 h-3" /> Liquidity Warning
                  </span>
                </div>
              )}
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 font-bold text-xl">$</span>
              </div>
              <input
                className="block w-full pl-10 pr-16 py-4 text-3xl font-bold bg-background-dark border border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-white placeholder-gray-600 transition-all shadow-inner"
                placeholder="0.00"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider bg-surface-hover px-2 py-1 rounded">
                  USDC
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">
                Available Balance:{" "}
                <span className="text-gray-300 font-mono">
                  ${balance.toLocaleString()}
                </span>
              </span>
              <span className="text-orange-400 flex items-center gap-1">
                Slippage Est: ~{slippage}%
              </span>
            </div>
          </div>
            
            {/* Slider & Quick Buttons */}
          <div className="space-y-6">
            <div className="pt-2 pb-2">
                <input 
                    type="range" 
                    min={0} 
                    max={Math.min(10000, balance)} 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-primary"
                />
              <div className="flex justify-between mt-4">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setAmount(Math.floor(balance * (pct / 100)))}
                    className="px-4 py-1.5 rounded-lg border border-border-dark bg-surface-hover/50 hover:bg-surface-hover hover:border-gray-600 text-xs font-medium text-gray-400 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>
            
            {/* Constraints */}
          <div className="border-t border-border-dark pt-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" /> Fund Constraints
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-dark border border-border-dark rounded-lg p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  Lock-up Period
                </p>
                <p className="text-sm font-medium text-gray-200">30 Days</p>
              </div>
              <div className="bg-surface-dark border border-border-dark rounded-lg p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  Early Withdraw
                </p>
                <p className="text-sm font-medium text-red-400">5% Penalty</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-border-dark bg-surface-dark z-20">
            {isLiveMode && (
                 <div className="mb-4 flex items-start gap-3 p-3 bg-yellow-900/10 border border-yellow-700/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <p className="text-[10px] text-yellow-600/80 leading-relaxed">
                    This is not financial advice. Prediction markets are highly volatile.
                    You could lose your entire principal.
                    </p>
                </div>
            )}
         
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-gray-600 text-primary focus:ring-primary bg-background-dark w-5 h-5 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-xs text-gray-400 leading-tight cursor-pointer select-none"
            >
              I understand the risks and agree to the{" "}
              <a href="#" className="text-primary hover:text-primary-hover underline">
                Terms
              </a>
              .
            </label>
          </div>
          <button
            disabled={!agreeTerms || isProcessing}
            onClick={handleInvest}
            className={cn(
                "w-full font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transform transition-all active:scale-[0.98] flex items-center justify-between group border border-transparent hover:border-emerald-400/30",
                isProcessing || !agreeTerms ? "bg-gray-700 text-gray-400 cursor-not-allowed shadow-none" : "bg-primary hover:bg-emerald-600 text-white"
            )}
           >
            <span className="flex flex-col items-start">
              <span className="text-sm font-normal text-emerald-100">
                {isProcessing ? "Processing..." : isLiveMode ? "Invest Total" : "Simulate Total"}
              </span>
              <span className="text-lg">${(amount + 2.45).toFixed(2)}</span>
            </span>
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg">
              <span>Confirm</span>
              <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
