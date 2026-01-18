"use client";

import { useState, useEffect } from "react";
// import { funds } from "@/lib/data/funds"; // Removed static import
import { useFundStore } from "@/store/useFundStore";
import { FundCard } from "@/components/funds/FundCard";
import { CategoryNav } from "@/components/funds/CategoryNav";
import { NewsTicker } from "@/components/dashboard/NewsTicker";
import { Search, Grid, List, ChevronDown, ChevronUp, ChevronsUpDown, Plus, Loader2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Helper for initials
const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

export default function ExploreFundsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const categories = ["All", "News", "Politics", "Sports", "Crypto", "Finance", "Economy", "Climate", "Culture", "World", "Tech", "Science", "Health", "Entertainment"];
  
  const { funds, fetchFunds, isLoading, error } = useFundStore();

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  const filteredFunds = funds.filter(
    (f) => {
        // 1. Search Filter
        const query = searchQuery.toLowerCase();
        
        // Check if query matches a known category mapping
        // Custom mapping for demo purposes to match existing tags
        const tagMap: Record<string, string[]> = {
            'finance': ['macro', 'rates', 'arb', 'algo'],
            'tech': ['ai', 'algo'],
            'world': ['macro'],
            'news': ['election', 'politics'],
            'sports': ['sports', 'nfl', 'nba'],
            'crypto': ['crypto', 'eth', 'btc', 'sol'],
        };

        // Determine effective tags to search if the query is a category name
        const expandedTags = tagMap[query] ? tagMap[query] : [query];
        
        const matchesSearch = f.name.toLowerCase().includes(query) ||
            f.thesis.toLowerCase().includes(query) ||
            f.tags.some(t => {
                const lowerTag = t.toLowerCase();
                return expandedTags.some(et => lowerTag.includes(et)) || lowerTag.includes(query);
            });
        
        // 2. Category Filter
        let matchesCategory = true;
        if (selectedCategory !== "All") {
            const cat = selectedCategory.toLowerCase();
            const relatedTags = tagMap[cat] || [cat];
            
            matchesCategory = f.tags.some(t => {
                const lowerTag = t.toLowerCase();
                return relatedTags.some(rt => lowerTag.includes(rt));
            });
        }

        return matchesSearch && matchesCategory;
    }
  );

  // Sort Logic
  const sortedFunds = [...filteredFunds].sort((a, b) => {
      if (sortOrder === 'asc') {
          return (a.metrics.aum || 0) - (b.metrics.aum || 0);
      } else if (sortOrder === 'desc') {
          return (b.metrics.aum || 0) - (a.metrics.aum || 0);
      }
      return 0;
  });

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
            Explore Prediction Funds
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Put your Money Where your Heart is. 
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-primary rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
            <Link href="/create-fund">
              <button className="relative flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Create Fund
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="mb-6">
        <CategoryNav 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
        />
      </div>



      {/* Toolbar */}
      <div className="bg-surface-dark border border-border-dark rounded-xl p-4 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full lg:w-96 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-border-dark rounded-lg leading-5 bg-background-dark text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Search by Name, Catagory, Market Volume.."
            />
             <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <kbd className="inline-flex items-center border border-gray-700 rounded px-2 text-xs font-sans font-medium text-gray-500 bg-gray-800">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide mr-auto">
            <span className="text-xs text-gray-500 font-medium mr-1 hidden lg:block">
              Filter by:
            </span>
            <button 
                onClick={() => {
                  if (sortOrder === null) setSortOrder('desc');
                  else if (sortOrder === 'desc') setSortOrder('asc');
                  else setSortOrder(null);
                }}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium bg-surface-dark border border-border-dark transition-colors whitespace-nowrap flex items-center gap-1",
                   sortOrder !== null ? "border-primary text-primary" : "text-gray-400 hover:border-primary hover:text-primary"
                )}
            >
              Market Volume
              {sortOrder === null && <ChevronsUpDown className="w-3 h-3" />}
              {sortOrder === 'desc' && <ChevronDown className="w-3 h-3" />}
              {sortOrder === 'asc' && <ChevronUp className="w-3 h-3" />}
            </button>
            <div className="h-6 w-px bg-gray-800 mx-1"></div>
            <button 
                onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                }}
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
      
      {/* News Ticker */}
      <div className="w-full rounded-lg border border-border-dark overflow-hidden shadow-lg shadow-black/40 mt-4 mb-2">
          <NewsTicker />
      </div>

      {isLoading ? (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-400">Loading funds from Supabase...</p>
         </div>
      ) : error ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4 max-w-md">
                <p className="font-semibold">Error loading funds</p>
                <p className="text-sm opacity-80">{error}</p>
            </div>
            <button 
                onClick={() => fetchFunds()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
            >
                <Loader2 className={cn("w-4 h-4", isLoading && "animate-spin")} />
                Retry
            </button>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            /* Table View */
            <div className="overflow-x-auto bg-surface-dark border border-border-dark rounded-xl mb-12">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-sm uppercasetracking-wider">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium">Author</th>
                    <th className="p-4 font-medium">Market Volume</th>
                    <th className="p-4 font-medium">Top 1 Weight</th>
                    <th className="p-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sortedFunds.map((fund) => (
                    <tr key={fund.id} className="hover:bg-gray-800/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                             {getInitials(fund.name)}
                          </div>
                          <span className="font-semibold text-white">{fund.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300 max-w-xs truncate" title={fund.thesis}>
                        {fund.thesis}
                      </td>
                      <td className="p-4 text-gray-400">
                        {fund.createdBy}
                      </td>
                      <td className="p-4 text-white font-mono">
                        {fund.metrics.aum ? `$${fund.metrics.aum.toLocaleString()}M` : 'N/A'}
                      </td>
                      <td className="p-4 text-white font-mono">
                        {fund.holdings[0] ? (
                            <div className="flex flex-col">
                                <span className="text-sm">{Number(fund.holdings[0].allocation).toFixed(2)}%</span>
                                <span className="text-xs text-gray-500 truncate max-w-[100px]" title={fund.holdings[0].name}>{fund.holdings[0].name}</span>
                            </div>
                        ) : 'N/A'}
                      </td>
                       <td className="p-4 text-right">
                        <Link href={`/funds/${fund.id}`}>
                            <button className="px-3 py-1.5 text-sm border border-primary/30 text-primary rounded hover:bg-primary hover:text-white transition-colors">
                                View
                            </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid gap-6 mb-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {sortedFunds.map((fund, index) => (
                <FundCard key={fund.id} fund={fund} index={index} />
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
                  <Link href="/create-fund">
                      <button className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors">
                          Start Application
                      </button>
                  </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
