import { Holding } from "@/lib/data/funds";
import { cn } from "@/lib/utils";
import { ExternalLink, Clock, TrendingUp, TrendingDown } from "lucide-react";

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <div className="glass-panel rounded-xl border border-border-dark overflow-hidden">
      <div className="p-5 border-b border-border-dark flex justify-between items-center bg-surface-dark/30">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          Active Holdings
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Updated 2m ago</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-dark/50 text-gray-400 font-medium text-xs uppercase tracking-wider border-b border-border-dark">
            <tr>
              <th className="px-5 py-3 font-semibold">Market / Event</th>
              <th className="px-5 py-3 font-semibold text-center">Side</th>
              <th className="px-5 py-3 font-semibold text-right">Allocation</th>
              <th className="px-5 py-3 font-semibold text-right">Prob</th>
              <th className="px-5 py-3 font-semibold">Expiry</th>
              <th className="px-5 py-3 font-semibold text-center">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {holdings.map((h, i) => (
              <tr
                key={i}
                className="hover:bg-surface-dark/50 transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-200">{h.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                      h.side === "YES"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}
                  >
                    {h.side}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-gray-200 font-mono">
                      {h.allocation}%
                    </span>
                    <div className="h-1 w-16 bg-surface-dark rounded-full overflow-hidden border border-white/5">
                      <div
                        className={cn("h-full", h.side === 'YES' ? "bg-primary" : "bg-red-500")}
                        style={{ width: `${h.allocation}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-mono text-white font-bold">{h.prob}%</span>
                </td>
                <td className="px-5 py-4 text-gray-400 text-xs font-mono">
                  {h.expiry}
                </td>
                <td className="px-5 py-4 text-center">
                  <a
                    href="#"
                    className="text-gray-500 hover:text-white transition-colors inline-block"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-surface-dark/20 px-5 py-3 border-t border-border-dark text-center">
        <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1 w-full font-medium">
          View all positions
        </button>
      </div>
    </div>
  );
}
