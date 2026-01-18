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

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        className="relative h-28 p-4 flex justify-between items-start bg-gradient-to-r from-gray-900 to-gray-800"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
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
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                {fund.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                <span className="text-primary font-semibold">{fund.thesis}.</span>{" "}
                {fund.secondaryThesis}
              </p>
              <p className="text-[10px] text-gray-500 mt-2 font-medium">
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
                     <span className="text-xs font-mono font-medium text-emerald-400">{h.allocation}%</span>
                   </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 mt-auto">
        <button
            onClick={handleAction}
          className="w-full py-2.5 rounded-lg font-bold text-sm transition-all shadow-md bg-white text-gray-900 hover:bg-primary hover:text-white"
        >
          Invest Now
        </button>
      </div>
    </div>
  );
}
