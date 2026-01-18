"use client";

import { useLayoutEffect, useState } from "react"; // useLayoutEffect to avoid flicker
import { PortfolioMode, getPortfolioMode, setPortfolioMode } from "@/lib/storage/portfolioPrefs";
import { LayoutDashboard, Network } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  onModeChange: (mode: PortfolioMode) => void;
}

export function PortfolioModeToggle({ onModeChange }: ModeToggleProps) {
  const [mode, setMode] = useState<PortfolioMode>('analytics');

  useLayoutEffect(() => {
    const saved = getPortfolioMode();
    setMode(saved);
    onModeChange(saved);
  }, []);

  const handleSwitch = (newMode: PortfolioMode) => {
    setMode(newMode);
    setPortfolioMode(newMode);
    onModeChange(newMode);
  };

  return (
    <div className="flex bg-surface-dark border border-border-dark rounded-lg p-1">
      <button
        onClick={() => handleSwitch('analytics')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
          mode === 'analytics' 
            ? "bg-primary text-white shadow-sm" 
            : "text-gray-400 hover:text-white"
        )}
      >
        <LayoutDashboard className="w-4 h-4" />
        Analytics
      </button>
      <button
        onClick={() => handleSwitch('map')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
          mode === 'map' 
            ? "bg-primary text-white shadow-sm" 
            : "text-gray-400 hover:text-white"
        )}
      >
        <Network className="w-4 h-4" />
        Strategy Map
      </button>
    </div>
  );
}
