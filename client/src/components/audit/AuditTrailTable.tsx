import { AuditEvent } from "@/lib/types/audit";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";

interface AuditTrailTableProps {
  events: AuditEvent[];
  total: number;
  page: number;
  onPageChange: (newPage: number) => void;
  onExport: () => void;
}

const EVENT_TYPE_STYLES: Record<string, string> = {
  "Rebalance": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Market Resolution": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Parameter Update": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Proposal Rejected": "bg-red-500/10 text-red-400 border-red-500/20",
  "Proposal Approved": "bg-green-500/10 text-green-400 border-green-500/20",
  "Execution": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Agent Research": "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export function AuditTrailTable({ events, total, page, onPageChange, onExport }: AuditTrailTableProps) {
  return (
    <div className="w-full bg-surface-dark rounded-xl border border-border-dark overflow-hidden flex flex-col">
      {/* Table Header / Toolbar */}
      <div className="p-4 border-b border-border-dark flex justify-between items-center">
        <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                Immutable Audit Trail
            </h3>
        </div>
        <div className="text-xs text-gray-500 font-mono">
            Last Synced block: <span className="text-emerald-500">18,241,002</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900/50 text-[10px] uppercase tracking-wider text-gray-500 border-b border-border-dark">
              <th className="px-6 py-3 font-semibold">Timestamp (UTC)</th>
              <th className="px-6 py-3 font-semibold">Event Type</th>
              <th className="px-6 py-3 font-semibold">Description</th>
              <th className="px-6 py-3 font-semibold">Initiator</th>
              <th className="px-6 py-3 font-semibold">Impact</th>
              <th className="px-6 py-3 font-semibold text-right">Status / Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50 text-xs text-gray-300">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-400">
                  {new Date(event.timestampUtc).toISOString().replace("T", " ").substring(0, 19)}
                </td>
                <td className="px-6 py-4">
                  <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-medium border", EVENT_TYPE_STYLES[event.eventType] || "bg-gray-800 text-gray-400 border-gray-700")}>
                    • {event.eventType}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium max-w-xs truncate" title={event.description}>
                  {event.description}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {event.initiator.avatarUrl ? (
                         <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold", event.initiator.kind === 'agent' ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300")}>
                             {event.initiator.avatarUrl === "AI" ? "AI" : event.initiator.name[0]}
                         </div>
                    ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-700"></div>
                    )}
                    <span>{event.initiator.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">
                    <span className={cn(
                        event.impact.label?.startsWith("+") ? "text-emerald-400" : 
                        event.impact.label?.startsWith("-") || event.impact.label?.includes("Vol: -") ? "text-gray-300" : "text-gray-500"
                    )}>
                        {event.impact.label}
                    </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-[10px]">
                  {event.status.kind === "offchain" ? (
                      <span className="text-gray-500 italic">{event.status.hashOrNote}</span>
                  ) : (
                      <span className="text-emerald-500 hover:underline cursor-pointer">
                        {event.status.hashOrNote}
                      </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border-dark flex justify-between items-center text-xs text-gray-500">
        <div>
            Showing <span className="text-gray-300">{(page - 1) * 10 + 1}-{Math.min(page * 10, total)}</span> of {total} events
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1 rounded hover:bg-gray-800 disabled:opacity-50"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
                onClick={() => onPageChange(page + 1)}
                 disabled={page * 10 >= total}
                className="p-1 rounded hover:bg-gray-800 disabled:opacity-50"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
}
