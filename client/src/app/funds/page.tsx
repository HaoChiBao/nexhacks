"use client";

import { useState, useEffect } from "react";
// import { funds } from "@/lib/data/funds"; // Removed static import
import { useFundStore } from "@/store/useFundStore";
import { FundCard } from "@/components/funds/FundCard";
import { Search, Grid, List, ChevronDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExploreFundsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { funds, fetchFunds, isLoading } = useFundStore();

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  const filteredFunds = funds.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.thesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
              Beta Access
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
            Explore Prediction Funds
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Invest in high-trust prediction market strategies. Audited
            methodologies with clear risk parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-primary rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
            <button className="relative flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Create Fund
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-dark border border-border-dark rounded-xl p-4 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-border-dark rounded-lg leading-5 bg-background-dark text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Search funds by name, thesis or risk profile..."
            />
             <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <kbd className="inline-flex items-center border border-gray-700 rounded px-2 text-xs font-sans font-medium text-gray-500 bg-gray-800">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
            <span className="text-xs text-gray-500 font-medium mr-1 hidden lg:block">
              Filter by:
            </span>
            <button className="px-3 py-1.5 rounded text-sm font-medium bg-surface-dark border border-border-dark text-gray-400 hover:border-primary hover:text-primary transition-colors whitespace-nowrap flex items-center gap-1">
              Liquidity Score <ChevronDown className="w-3 h-3" />
            </button>
            <button className="px-3 py-1.5 rounded text-sm font-medium bg-surface-dark border border-border-dark text-gray-400 hover:border-primary hover:text-primary transition-colors whitespace-nowrap flex items-center gap-1">
              Max Drawdown <ChevronDown className="w-3 h-3" />
            </button>
            <div className="h-6 w-px bg-gray-800 mx-1"></div>
            <button 
                onClick={() => setSearchQuery("")}
                className="px-3 py-1.5 rounded text-sm font-medium bg-surface-dark border border-border-dark text-gray-400 hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          </div>

          <div className="flex items-center bg-background-dark rounded-lg p-1 border border-border-dark shrink-0">
            <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded transition-colors", viewMode === 'grid' ? "bg-gray-800 text-primary shadow-sm border border-gray-700" : "text-gray-500 hover:text-white")}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded transition-colors", viewMode === 'list' ? "bg-gray-800 text-primary shadow-sm border border-gray-700" : "text-gray-500 hover:text-white")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-400">Loading funds from Supabase...</p>
         </div>
      ) : (
        /* Grid */
        <div className={cn("grid gap-6 mb-12", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
          {filteredFunds.map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
           
           {/* Create Fund Card (Stub) */}
           <div className="group relative flex flex-col justify-center items-center h-full min-h-[400px] bg-transparent border-2 border-dashed border-gray-700 rounded-2xl hover:border-primary hover:bg-surface-dark/50 transition-all duration-300 cursor-pointer">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create Your Own Fund</h3>
              <p className="text-gray-400 text-center max-w-xs px-4 mb-6">
                  Have a winning strategy? Launch a prediction fund and earn performance fees.
              </p>
              <button className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors">
                  Start Application
              </button>
          </div>
        </div>
      )}
    </div>
  );
}
