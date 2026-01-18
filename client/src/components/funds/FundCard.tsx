import { Link, Bookmark } from "lucide-react";
import { Fund } from "@/lib/data/funds";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface FundCardProps {
  fund: Fund;
  index: number;
}

export function FundCard({ fund, index }: FundCardProps) {
  const router = useRouter();
  const { openInvestDrawer } = useAppStore();
  const [isSaved, setIsSaved] = useState(false);

  // Deterministic color based on index to ensure contrast between neighbors
  const theme = useMemo(() => {
    const colors = [
      { from: "from-blue-900", to: "to-blue-950", accent: "text-blue-400", bgAccent: "bg-blue-600", borderHover: "hover:border-blue-500/50", shadowHover: "hover:shadow-blue-500/10" },
      { from: "from-amber-900", to: "to-amber-950", accent: "text-amber-400", bgAccent: "bg-amber-600", borderHover: "hover:border-amber-500/50", shadowHover: "hover:shadow-amber-500/10" },
      { from: "from-rose-900", to: "to-rose-950", accent: "text-rose-400", bgAccent: "bg-rose-600", borderHover: "hover:border-rose-500/50", shadowHover: "hover:shadow-rose-500/10" },
      { from: "from-emerald-900", to: "to-emerald-950", accent: "text-emerald-400", bgAccent: "bg-emerald-600", borderHover: "hover:border-emerald-500/50", shadowHover: "hover:shadow-emerald-500/10" },
      { from: "from-purple-900", to: "to-purple-950", accent: "text-purple-400", bgAccent: "bg-purple-600", borderHover: "hover:border-purple-500/50", shadowHover: "hover:shadow-purple-500/10" },
      { from: "from-cyan-900", to: "to-cyan-950", accent: "text-cyan-400", bgAccent: "bg-cyan-600", borderHover: "hover:border-cyan-500/50", shadowHover: "hover:shadow-cyan-500/10" },
    ];
    
    return colors[index % colors.length];
  }, [index]);

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    openInvestDrawer(fund.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  }

  const handleCardClick = () => {
    router.push(`/funds/${fund.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative bg-surface-dark rounded-2xl border border-border-dark overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col cursor-pointer",
        theme.borderHover,
        theme.shadowHover
      )}
    >
      {/* Header / Banner */}
      <div 
        className={cn(
            "relative h-28 p-4 flex justify-between items-start bg-gradient-to-r", 
            theme.from, 
            theme.to
        )}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Large Market Volume Text */}
        <div className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none z-0">
             <span 
                className="text-[5rem] font-bold tracking-tighter leading-none"
                style={{
                    color: 'rgba(207, 205, 205, 0.05)',
                    textShadow: '0px 4px 4px rgba(255, 255, 255, 0.125)'
                }}
             >
                ${fund.metrics.aum}M
             </span>
        </div>
        

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
          <div className="mb-3">
              <h3 className={cn("text-lg font-bold text-white transition-colors", `group-hover:${theme.accent}`)}>
                {fund.name}
              </h3>
              
              {/* Categories / Tags */}
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {fund.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded border border-gray-700/50">
                        {tag}
                    </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
                <span className={cn("font-semibold", theme.accent)}>{fund.thesis}.</span>{" "}
                {fund.secondaryThesis}
              </p>
              
              <p className="text-[10px] text-gray-500 mt-3 font-medium">
                Created by: <span className="text-gray-300">{fund.createdBy}</span>
              </p>
          </div>

          <div className="mt-4 mb-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">
              Current Weights
            </p>
            <div className="flex flex-col gap-1.5">
                {fund.holdings.slice(0,3).map((h, i) => (
                     <div key={i} className="flex items-center justify-between">
                     <span className="text-xs font-mono text-gray-300">{h.ticker}</span>
                     <span className={cn("text-xs font-mono font-medium", theme.accent)}>{h.allocation}%</span>
                   </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 mt-auto">
        <div className="flex items-center gap-3">
            <button
                onClick={handleAction}
            className={cn(
                "flex-1 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md bg-white text-gray-900 hover:text-white",
                `hover:${theme.bgAccent}`
            )}
            >
            Invest Now
            </button>
            <button 
                onClick={handleSave}
                className="p-2.5 rounded-lg bg-gray-800 border border-border-dark hover:bg-gray-700 transition-colors"
                title={isSaved ? "Remove from watchlist" : "Add to watchlist"}
            >
                <Bookmark 
                    className={cn(
                        "w-5 h-5 transition-colors", 
                        isSaved ? "fill-primary text-primary" : "text-gray-400"
                    )} 
                />
            </button>
        </div>
      </div>
    </div>
  );
}
