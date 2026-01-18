"use client";

import { useFundStore } from "@/store/useFundStore";
import { useAppStore } from "@/store/useAppStore";
import { FundCard } from "@/components/funds/FundCard";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { useEffect } from "react";

export default function SavedFundsPage() {
  const { funds, fetchFunds, isLoading } = useFundStore();
  const { savedFundIds } = useAppStore();

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  const savedFunds = funds.filter(f => savedFundIds.includes(f.id));

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
            Saved Funds
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Your personal watchlist of prediction strategies.
          </p>
        </div>
      </div>

      {isLoading ? (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-400">Loading saved funds...</p>
         </div>
      ) : savedFunds.length > 0 ? (
        <div className="grid gap-6 mb-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {savedFunds.map((fund, index) => (
            <FundCard key={fund.id} fund={fund} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-gray-800 rounded-2xl bg-surface-dark/30">
            <p className="text-gray-400 mb-4">You haven't saved any funds yet.</p>
            <Link href="/funds">
                <button className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors">
                    Explore Funds
                </button>
            </Link>
        </div>
      )}
    </div>
  );
}
