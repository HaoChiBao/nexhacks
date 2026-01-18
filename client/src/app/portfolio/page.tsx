"use client";

import { useState } from "react";
import { PortfolioModeToggle } from "@/components/portfolio/PortfolioModeToggle";
import { PortfolioAnalyticsView } from "@/components/portfolio/PortfolioAnalyticsView";
import { PortfolioStrategyMapView } from "@/components/portfolio/PortfolioStrategyMapView";
import { DepositExecuteDrawer } from "@/components/portfolio/DepositExecuteDrawer";
import { MoneyUpBurst } from "@/components/portfolio/MoneyUpBurst";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PortfolioMode } from "@/lib/storage/portfolioPrefs";

// Feature Flags
const ENABLE_HEDGES = true;
const ENABLE_PARLAYS = true;
const ENABLE_MONEY_UP = true;

export default function PortfolioPage() {
  const [mode, setMode] = useState<PortfolioMode>('analytics');
  const [moneyUp, setMoneyUp] = useState<{show: boolean, amount: number, x: number, y: number} | null>(null);

  const simulateWin = () => {
      setMoneyUp({ show: true, amount: 24500, x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-surface-dark border-b border-border-dark px-6 py-4 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-6">
            {/* h1 removed as requested */}
            <div />
            
            <PortfolioModeToggle onModeChange={setMode} />
         </div>

         <div className="flex items-center gap-4">
             {ENABLE_MONEY_UP && (
                 <Button variant="ghost" className="text-xs text-gray-600 hover:text-green-400" onClick={simulateWin}>
                     Dev: Sim Win
                 </Button>
             )}
             
             <DepositExecuteDrawer>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                    <Plus className="w-4 h-4 mr-2" />
                    Deposit
                </Button>
             </DepositExecuteDrawer>
         </div>
      </div>

      {/* Main Content */}
      <main className={mode === 'analytics' ? "container mx-auto p-6" : "h-[calc(100vh-73px)]"}>
        {mode === 'analytics' ? (
            <PortfolioAnalyticsView />
        ) : (
            <PortfolioStrategyMapView />
        )}
      </main>

      {/* Money Up Layer */}
      {moneyUp && moneyUp.show && (
          <MoneyUpBurst 
            amount={moneyUp.amount} 
            x={moneyUp.x} 
            y={moneyUp.y} 
            onDone={() => setMoneyUp(null)} 
          />
      )}
    </div>
  );
}
