"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
// import { funds } from "@/lib/data/funds"; // Removed mock import
import { useFundStore } from "@/store/useFundStore"; // Use store instead
import { cn, getInitials } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import * as Switch from "@radix-ui/react-switch";
import { Info, Lock, Clock, TrendingUp, AlertTriangle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Confetti from 'react-confetti';
// import { useWindowSize } from 'react-use'; // Removed dependency

// Simple hook to reuse
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
            window.addEventListener('resize', handleResize);
            handleResize();
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);
    return windowSize;
};

export function InvestDrawer() {
  const router = useRouter();
  const {
    investDrawerOpen,
    closeInvestDrawer,
    selectedFundId,
    balance: appBalance, // Rename to distinguish
    setBalance, // Use this if available
    isLiveMode,
    addDeposit,
  } = useAppStore();
  const { user } = useAuthStore();
  const { funds } = useFundStore(); 

  const [amount, setAmount] = useState<number>(2500);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modal State
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Use window size for confetti
  const { width, height } = useWindowSize();

  // If no fund, return null (should be handled by parent/state)


  // If no fund, return null (should be handled by parent/state)
  const fund = funds.find((f) => f.id === selectedFundId);

  useEffect(() => {
    setAmount(2500);
    setAgreeTerms(false);
    setIsProcessing(false);
    setTransactionStatus("idle");
    setErrorMessage("");
  }, [investDrawerOpen, selectedFundId]);

  if (!fund) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) closeInvestDrawer();
  };

  const parseError = (err: any): string => {
      if (typeof err === 'string') return err;
      if (err.detail) {
          if (typeof err.detail === 'string') return err.detail;
          if (Array.isArray(err.detail)) {
              return err.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
          }
          return JSON.stringify(err.detail);
      }
      return err.message || JSON.stringify(err);
  }

  const handleInvest = async () => {
    if (!user) {
        router.push('/login');
        closeInvestDrawer();
        return;
    }

    if (!agreeTerms) return;
    setIsProcessing(true);
    setTransactionStatus("idle");

    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${API_URL}/portfolios/invest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fund_id: fund.id,
                fund_name: fund.name,
                fund_logo: fund.logo, 
                amount: amount,
                user_id: user.id
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(parseError(err));
        }

        const data = await response.json();
        
        if (data.new_balance !== undefined) {
             addDeposit(-amount); 
        }

        setTransactionStatus("success");

    } catch (e: any) {
        console.error(e);
        setErrorMessage(parseError(e));
        setTransactionStatus("error");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleResize = () => {
    setTransactionStatus("idle");
    setAmount(2500);
  }
  
  const handleLoginRedirect = () => {
     closeInvestDrawer();
     router.push('/login');
  }

  const slippage = Math.min((amount / 10000) * 0.4, 2.5).toFixed(2);

  return (
    <Sheet open={investDrawerOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        className="w-full sm:max-w-lg bg-surface-dark border-border-dark text-white p-0 flex flex-col"
        side="right"
      >
        {/* Confetti Overlay */}
        {transactionStatus === "success" && (
            <div className="fixed inset-0 z-50 pointer-events-none">
                 <Confetti width={width} height={height} numberOfPieces={500} recycle={false} gravity={0.2} />
            </div>
        )}

        {/* Transaction Result Modal Overlay (Absolute within Sheet) */}
        {transactionStatus !== "idle" && (
            <div className="absolute inset-0 z-40 bg-surface-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                {transactionStatus === "success" ? (
                    <div className="space-y-6">
                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-emerald-500/10">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Congratulations!</h2>
                        <p className="text-gray-400 max-w-xs mx-auto">
                            You successfully invested <span className="text-white font-mono font-bold">${amount}</span> in <span className="text-white font-bold">{fund.name}</span>.
                        </p>
                        <button 
                            onClick={closeInvestDrawer}
                            className="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 w-full max-w-xs"
                        >
                            Return to Portfolio
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                         <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-red-500/10">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Investment Failed</h2>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-200 font-mono text-left max-h-40 overflow-y-auto w-full custom-scroll">
                            {typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}
                        </div>
                        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                            <button 
                                onClick={() => setTransactionStatus("idle")}
                                className="bg-surface-hover hover:bg-surface-active text-white font-medium py-3 px-8 rounded-xl border border-white/10 transition-colors"
                            >
                                Try Again
                            </button>
                            <button 
                                onClick={closeInvestDrawer}
                                className="text-gray-500 hover:text-gray-300 text-sm py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="p-6 border-b border-border-dark flex justify-between items-center z-10 bg-surface-dark/95 backdrop-blur-md sticky top-0">
          <div>
            <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-primary w-6 h-6" /> Invest Flow
            </SheetTitle>
            <SheetDescription className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-semibold flex items-center gap-2">
              Fund ID: {fund.id.toUpperCase()}
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
                 <div className="h-12 w-12 rounded-xl bg-surface-dark p-1 shadow-md border border-border-dark flex items-center justify-center">
                    <div className="w-full h-full rounded-lg flex items-center justify-center font-bold text-lg bg-gray-800/50 text-white">
                        {getInitials(fund.name)}
                    </div>
                  </div>
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
                disabled={!user} // Disable input if not logged in
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
                  ${appBalance.toLocaleString()}
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
                    max={Math.min(10000, appBalance)} 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-primary"
                    disabled={!user}
                />
              <div className="flex justify-between mt-4">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setAmount(Math.floor(appBalance * (pct / 100)))}
                    className="px-4 py-1.5 rounded-lg border border-border-dark bg-surface-hover/50 hover:bg-surface-hover hover:border-gray-600 text-xs font-medium text-gray-400 transition-colors"
                    disabled={!user}
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
              disabled={!user}
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
          
          {user ? (
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
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </div>
            </button>
          ) : (
            <button
                onClick={handleLoginRedirect}
                className="w-full font-bold py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transform transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
            >
                <span>Login to Invest</span>
            </button>
          )}

        </div>
      </SheetContent>
    </Sheet>
  );
}
