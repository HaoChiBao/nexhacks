import { Link } from "lucide-react";
import { Fund } from "@/lib/data/funds";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

interface FundCardProps {
  fund: Fund;
}

export function FundCard({ fund }: FundCardProps) {
  const router = useRouter();
  const { openInvestDrawer } = useAppStore();

  const isLive = fund.status === "Live";
  const isWaitlist = fund.status === "Waitlist";

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWaitlist) return;
    openInvestDrawer(fund.id);
  };

  const handleCardClick = () => {
    router.push(`/funds/${fund.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-surface-dark rounded-2xl border border-border-dark overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col cursor-pointer"
    >
      {/* Header / Banner */}
      <div 
        className={cn(
            "relative h-28 p-4 flex justify-between items-start bg-gradient-to-r",
            isWaitlist ? "from-purple-950 to-pink-950" : "from-gray-900 to-gray-800"
        )}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <span
          className={cn(
            "relative z-10 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
            isLive ? "bg-emerald-900/40 text-emerald-400 border-emerald-800" :
            isWaitlist ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" :
            "bg-blue-900/30 text-blue-400 border-blue-800"
          )}
        >
          {isLive && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>}
          {fund.status}
        </span>
      </div>

      <div className="px-6 relative flex-grow">
        {/* Logo */}
        <div className="absolute -top-8 left-6">
          <div className="h-16 w-16 rounded-xl bg-surface-dark p-1 shadow-md border border-border-dark">
            <img
              alt="Fund Logo"
              className="h-full w-full rounded-lg object-cover"
              src={fund.logo}
            />
          </div>
        </div>

        <div className="pt-10 pb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                {fund.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-[160px] leading-snug">
                <span className="text-primary font-semibold">{fund.thesis}.</span>{" "}
                {fund.secondaryThesis}
              </p>
            </div>
            <div className="text-right">
              <div className="flex flex-col items-end">
                <span className={cn("text-xl font-bold", fund.returns.month >= 0 ? "text-emerald-400" : "text-gray-500")}>
                    {fund.returns.month > 0 ? "+" : ""}{fund.returns.month}%
                </span>
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide">
                  30 Days
                </span>
              </div>
              <div className="flex flex-col items-end mt-1">
                <span className="text-sm font-medium text-emerald-500/80">
                  {fund.returns.inception > 0 ? "+" : ""}{fund.returns.inception}%
                </span>
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide">
                  Since Inception
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 mb-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">
              Current Weights
            </p>
            <div className="flex flex-col gap-1.5">
                {fund.holdings.slice(0,3).map((h, i) => (
                     <div key={i} className="flex items-center justify-between">
                     <span className="text-xs font-mono text-gray-300">{h.ticker}</span>
                     <span className="text-xs font-mono font-medium text-emerald-400">{h.allocation}%</span>
                   </div>
                ))}
            </div>
          </div>
            
          {/* Metrics Grid */}
          {!isWaitlist ? (
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-border-dark bg-background-dark/30 rounded-lg px-2 mt-4">
                <div className="text-center border-r border-border-dark last:border-0">
                <p className="text-[10px] text-gray-500 uppercase mb-0.5">Liquidity</p>
                <p className="text-xs font-semibold text-white">{fund.metrics.liquidityScore}/100</p>
                </div>
                <div className="text-center border-r border-border-dark last:border-0">
                <p className="text-[10px] text-gray-500 uppercase mb-0.5">Max DD</p>
                <p className="text-xs font-semibold text-red-400">{fund.metrics.maxDrawdown}%</p>
                </div>
                <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase mb-0.5">Top Conc.</p>
                <p className="text-xs font-semibold text-yellow-400">{fund.metrics.topConcentration}%</p>
                </div>
            </div>
          ) : (
            <div className="mt-4 py-3 border border-yellow-900/30 bg-yellow-900/10 rounded-lg px-3 flex items-start gap-2">
                <div>
                <p className="text-xs font-bold text-yellow-500 mb-0.5">Insufficient Market Depth</p>
                <p className="text-[10px] text-gray-400 leading-tight">Underlying markets currently lack the liquidity required for safe execution at scale.</p>
                </div>
            </div>
          )}
          
        </div>
      </div>

      <div className="px-6 pb-6 mt-auto">
        <button
            onClick={handleAction}
          className={cn(
            "w-full py-2.5 rounded-lg font-bold text-sm transition-all shadow-md",
            isWaitlist 
             ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
             : "bg-white text-gray-900 hover:bg-primary hover:text-white"
          )}
        >
          {isWaitlist ? "Join Waitlist" : "Invest Now"}
        </button>
      </div>
    </div>
  );
}
