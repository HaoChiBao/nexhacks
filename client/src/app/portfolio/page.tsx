"use client";

import { useState, useEffect } from "react";
import { 
    MOCK_PORTFOLIO_SUMMARY, 
    MOCK_FUND_POSITIONS, 
    MOCK_PROPOSALS 
} from "@/lib/mock/portfolio-data";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioModeToggle } from "@/components/portfolio/PortfolioModeToggle";
import { PortfolioAnalyticsView } from "@/components/portfolio/PortfolioAnalyticsView";
import { PortfolioStrategyMapView } from "@/components/portfolio/PortfolioStrategyMapView";
import { DepositExecuteDrawer } from "@/components/portfolio/DepositExecuteDrawer";

export default function PortfolioPage() {
  const [mode, setMode] = useState<"analytics" | "strategy">("analytics");
  const data = MOCK_PORTFOLIO_SUMMARY;

  // Persist mode selection
  useEffect(() => {
    const saved = localStorage.getItem("portfolioMode");
    if (saved === "analytics" || saved === "strategy") {
        setMode(saved);
    }
  }, []);

  const handleModeChange = (m: "analytics" | "strategy") => {
      setMode(m);
      localStorage.setItem("portfolioMode", m);
  };

  return (
    <div className="min-h-screen flex flex-col">
        {/* Top Control Bar (Sticky) */}
        <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
             <PortfolioModeToggle mode={mode} onChange={handleModeChange} />

             {/* Compact Stats Strip for Strategy Mode */}
             {mode === 'strategy' && (
                 <div className="hidden md:flex items-center gap-6 text-sm">
                     <div>
                         <span className="text-gray-500 mr-2">NAV</span>
                         <span className="font-mono text-emerald-400">{(data.totalNavCredits).toLocaleString(undefined, { maximumFractionDigits: 0 })} PM</span>
                     </div>
                     <div>
                         <span className="text-gray-500 mr-2">30D</span>
                         <span className="font-mono text-emerald-400">+{data.return30dPct}%</span>
                     </div>
                 </div>
             )}

             <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Available</p>
                      <p className="font-mono text-white text-sm">240.00 PM</p>
                 </div>
                 <DepositExecuteDrawer />
             </div>
        </div>

        <div className="flex-grow p-6 pt-2">
            {mode === 'analytics' ? (
                <>
                    <PortfolioHeader 
                         navCredits={data.totalNavCredits} 
                         balanceCredits={240.00} 
                         change30dPct={data.return30dPct} 
                    />
                    <PortfolioAnalyticsView 
                        data={data} 
                        funds={MOCK_FUND_POSITIONS} 
                        proposals={MOCK_PROPOSALS} 
                    />
                </>
            ) : (
                <PortfolioStrategyMapView />
            )}
        </div>
    </div>
  );
}
