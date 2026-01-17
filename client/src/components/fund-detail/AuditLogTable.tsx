import { cn } from "@/lib/utils";
import { Link, Download } from "lucide-react";

export function AuditLogTable() {
  const logs = [
    { time: "2023-10-24 14:30", action: "BUY YES", market: "Fed Rate Cut", size: "$15,000", tx: "0x3a2...9f1", type: 'buy' },
    { time: "2023-10-23 09:15", action: "SELL NO", market: "Starship Orbit", size: "$4,200", tx: "0x8b1...2c4", type: 'sell' },
    { time: "2023-10-22 11:00", action: "REBALANCE", market: "Portfolio Weight", size: "--", tx: "0x1d4...f9a", type: 'neutral' },
  ];

  return (
    <div className="glass-panel rounded-xl border border-border-dark overflow-hidden">
      <div className="p-5 border-b border-border-dark flex justify-between items-center bg-surface-dark/30">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          Audit Log
        </h3>
        <button className="text-xs text-primary hover:text-emerald-400 transition-colors font-medium flex items-center gap-1">
             <Download className="w-3 h-3"/> Download CSV
        </button>
      </div>
      <div className="p-0">
        <div className="grid grid-cols-12 text-xs uppercase tracking-wider text-gray-500 font-medium px-5 py-3 border-b border-border-dark">
          <div className="col-span-3">Timestamp</div>
          <div className="col-span-4">Action / Market</div>
          <div className="col-span-2 text-right">Size</div>
          <div className="col-span-3 text-right">Evidence</div>
        </div>
        {logs.map((log, i) => (
          <div
            key={i}
            className="grid grid-cols-12 px-5 py-3 text-sm border-b border-border-dark/50 items-center hover:bg-surface-dark/30 transition-colors"
          >
            <div className="col-span-3 text-gray-400 font-mono text-xs">
              {log.time}
            </div>
            <div className="col-span-4">
              <span
                className={cn(
                  "font-bold text-xs border px-1.5 py-0.5 rounded mr-2",
                  log.type === 'buy' ? "bg-primary/10 text-primary border-primary/20" :
                  log.type === 'sell' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                  "bg-blue-500/10 text-blue-400 border-blue-500/20"
                )}
              >
                {log.action}
              </span>
              <span className="text-gray-300 text-xs">{log.market}</span>
            </div>
            <div className="col-span-2 text-right font-mono text-gray-300">{log.size}</div>
            <div className="col-span-3 text-right">
              <a
                href="#"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-end gap-1"
              >
                {log.tx} <Link className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
