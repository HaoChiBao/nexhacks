"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Filter, ArrowUpDown, Calendar, TrendingUp, ChevronRight, MoreHorizontal, Bookmark } from "lucide-react";
import { useFundStore } from "@/store/useFundStore";
import { supabase } from "@/lib/supabase";

export default function PortfolioPage() {
  const { funds, fetchFunds } = useFundStore();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalNav, setTotalNav] = useState(0);

  useEffect(() => {
    // Ensure funds are loaded to map details
    if (funds.length === 0) {
        fetchFunds();
    }
  }, [fetchFunds, funds.length]);

  useEffect(() => {
    async function fetchPortfolio() {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.log("No user found");
                setIsLoading(false);
                return;
            }

            const res = await fetch(`${API_URL}/users/${user.id}/profile`);
            if (res.ok) {
                const data = await res.json();
                
                if (data?.portfolio?.funds) {
                    // Backend portfolio structure might be { funds: [...] } or just [...] depending on legacy.
                    // routes/portfolios.py saves { funds: [...] }
                    // So we expect data.portfolio.funds
                    const fundsList = Array.isArray(data.portfolio) ? data.portfolio : (data.portfolio.funds || []);
                    setPortfolio(fundsList);
                    
                    // Calculate Total NAV
                    const total = fundsList.reduce((acc: number, item: any) => {
                        // Assuming invested_amount is accessible
                        const val = (item.current_value || item.invested_amount || 0);
                        return acc + val;
                    }, 0);
                    setTotalNav(total);
                } else if (Array.isArray(data?.portfolio)) {
                     // Fallback if it's a direct array
                     setPortfolio(data.portfolio);
                }
            } else {
                console.error("Failed to fetch portfolio from API");
            }
        } catch (e) {
            console.error("Error fetching portfolio", e);
        } finally {
            setIsLoading(false);
        }

    }

    fetchPortfolio();
  }, [funds]); // Re-run if funds load, though strictly only dependent on user login

  // Helper to find fund details
  const getFundDetails = (fundId: string) => {
      // Try exact match or partial match for demo valid IDs vs slugs
      return funds.find(f => f.id === fundId || f.id.includes(fundId) || fundId.includes(f.id));
  };

  return (
    <div className="container mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Your Invested Funds
          </h1>
          <p className="text-gray-400">
            Managing {portfolio.length} active positions
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
            <Link href="/saved">
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-border-dark rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors mb-2">
                    <Bookmark className="w-4 h-4" /> View Saved Funds
                </button>
            </Link>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-border-dark rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-border-dark rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <ArrowUpDown className="w-4 h-4" /> Sort
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Fund Cards (Col Span 2) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-min">
            
            {isLoading ? (
                <div className="col-span-2 flex justify-center py-20 text-gray-500">
                    Loading portfolio...
                </div>
            ) : portfolio.length === 0 ? (
                <div className="col-span-2 flex flex-col items-center justify-center py-20 border border-dashed border-gray-800 rounded-xl text-center">
                    <p className="text-gray-400 mb-4">You have no active investments.</p>
                    <Link href="/funds">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                            Explore Funds
                        </button>
                    </Link>
                </div>
            ) : (
                portfolio.map((item, idx) => {
                    const fund = getFundDetails(item.fund_id);
                    // Use server-provided current value or fallback to invested amount
                    const investedAmount = item.invested_amount || 0;
                    const currentValue = item.current_value || investedAmount * (1 + (item.pnl_percent || 0) / 100);
                    
                    const pnlPercent = item.pnl_percent || 0;
                    const fundName = fund?.name || item.name || "Unknown Fund"; // Fallback to item.name if saved in portfolio
                    const fundSymbol = fundName.substring(0, 2).toUpperCase();
                    const category = fund?.tags?.[0] || "General";

                    return (
                        <PortfolioCard 
                            key={`${item.fund_id}-${idx}`}
                            symbol={fundSymbol}
                            symbolColor="bg-blue-900/30 text-blue-400"
                            category={category}
                            categoryColor="text-blue-400 bg-blue-400/10"
                            title={fundName}
                            invested={`$${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            positions={[
                                // Mock positions if real holdings are missing from portfolio item
                                { name: "Primary Thesis", percent: "60%", pnl: `${pnlPercent > 0 ? '+' : ''}${pnlPercent}%`, pnlColor: pnlPercent >= 0 ? "text-emerald-400" : "text-red-400" },
                                { name: "Hedge", percent: "40%", pnl: "---", pnlColor: "text-gray-500" },
                            ]}
                            bgGradient="from-blue-900/10 to-transparent"
                            fundId={fund?.id || item.fund_id}
                        />
                    );
                })
            )}

        </div>

        {/* Sidebar (Col Span 1) */}
        <div className="space-y-6">
            
            {/* Total NAV */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
               <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Portfolio NAV</h3>
                   <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer hover:text-white" />
               </div>
               <div className="flex items-baseline gap-3 mb-6">
                   <span className="text-4xl font-bold text-white tracking-tight">${totalNav.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                   <span className="text-sm font-bold text-emerald-400">+{(totalNav > 0 ? ((totalNav - 8550)/8550 * 100) : 0).toFixed(1)}%</span>
               </div>
               
               {/* Sparkline Visual (SVG) */}
               <div className="h-16 w-full opacity-80">
                   <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
                       <path 
                           d="M0 18 Q 10 15, 20 16 T 40 14 T 60 10 T 80 5 T 100 2" 
                           fill="none" 
                           stroke="#10b981" 
                           strokeWidth="2"
                           strokeLinecap="round"
                       />
                       <circle cx="100" cy="2" r="3" fill="#10b981" />
                   </svg>
               </div>
            </div>

            {/* Allocation */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Allocation By Category</h3>
                 
                 <div className="space-y-5">
                     <AllocationBar label="Geopolitics" percent="50%" color="bg-blue-500" />
                     <AllocationBar label="Tech" percent="33%" color="bg-amber-500" />
                     <AllocationBar label="Climate" percent="17%" color="bg-rose-500" />
                 </div>
            </div>

             {/* Upcoming Resolutions */}
             <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Upcoming Resolutions</h3>
                    <Calendar className="w-4 h-4 text-gray-500" />
                 </div>

                 <div className="space-y-6">
                     <ResolutionItem 
                        date="JAN 22" 
                        title="Tariff Policy Announcement" 
                        subtitle="Trading Closes 23:59 ET"
                        color="text-blue-400"
                        bg="bg-blue-900/20"
                     />
                     <ResolutionItem 
                        date="JAN 25" 
                        title="Musk Starship Launch Window" 
                        subtitle="Live Event Tracking"
                        color="text-amber-400"
                        bg="bg-amber-900/20"
                     />
                     <ResolutionItem 
                        date="FEB 02" 
                        title="USGS Fault Report Q1" 
                        subtitle="Expected 10:00 AM"
                        color="text-rose-400"
                        bg="bg-rose-900/20"
                     />
                 </div>

                 <button className="w-full mt-6 py-3 rounded-lg border border-gray-700 bg-transparent text-sm font-medium text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
                     View Full Calendar
                 </button>
             </div>

        </div>
      </div>
    </div>
  );
}

// ---------------------------
// Local Components
// ---------------------------

function PortfolioCard({ symbol, symbolColor, category, categoryColor, title, invested, positions, bgGradient, fundId }: any) {
    return (
        <Link href={`/funds/${fundId || symbol}`} className="block h-full">
            <div className={cn("bg-surface-dark border border-border-dark rounded-2xl p-6 relative overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors group cursor-pointer")}>
                {/* Background Gradient */}
                <div className={cn("absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l opacity-20 pointer-events-none", bgGradient)}></div>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg", symbolColor)}>
                        {symbol}
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider", categoryColor)}>
                        {category}
                    </span>
                </div>

                {/* Title & Total */}
                <div className="mb-8 relative z-10">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Total Invested</span>
                        <span className="text-xl font-bold text-white">{invested}</span>
                    </div>
                </div>

                {/* Positions Table Header */}
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 relative z-10">
                    <span>Position</span>
                    <span>Allocation / P&L</span>
                </div>

                {/* Positions List */}
                <div className="space-y-3 mb-8 relative z-10 flex-grow">
                    {positions.map((pos: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300 font-medium">{pos.name}</span>
                            <div className="text-right flex flex-col">
                                <span className="text-white font-bold">{pos.percent}</span>
                                <span className={cn("text-xs font-mono", pos.pnlColor)}>{pos.pnl}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
                    <button className="py-2.5 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors">
                        Invest More
                    </button>
                    <button className="py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
                        Withdraw
                    </button>
                </div>
            </div>
        </Link>
    );
}

function AllocationBar({ label, percent, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-white">{label}</span>
                <span className="text-white">{percent}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", color)} style={{ width: percent }}></div>
            </div>
        </div>
    );
}

function ResolutionItem({ date, title, subtitle, color, bg }: any) {
    const [month, day] = date.split(' ');
    return (
        <div className="flex gap-4">
             <div className={cn("w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0", bg)}>
                 <span className={cn("text-[10px] font-bold uppercase", color)}>{month}</span>
                 <span className={cn("text-lg font-bold", color)}>{day}</span>
             </div>
             <div>
                 <h4 className="text-sm font-bold text-white leading-tight mb-0.5">{title}</h4>
                 <p className="text-xs text-gray-500">{subtitle}</p>
             </div>
        </div>
    );
}
