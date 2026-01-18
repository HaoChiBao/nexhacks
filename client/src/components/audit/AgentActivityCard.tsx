import { OtherAgentActivity } from "@/lib/types/audit";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Loader2, PlayCircle } from "lucide-react";

interface AgentActivityCardProps {
  activity: OtherAgentActivity;
}

const STATUS_CONFIG = {
    "QUEUED": { icon: Clock, color: "text-gray-400", border: "border-gray-700", bg: "bg-gray-800/50" },
    "EXECUTED": { icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
    "RESEARCHING": { icon: Loader2, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
}

export function AgentActivityCard({ activity }: AgentActivityCardProps) {
  const config = STATUS_CONFIG[activity.status];
  const Icon = config.icon;

  return (
    <div className={cn("p-4 rounded-xl border mb-3 last:mb-0 transition-all hover:bg-surface-dark/80", config.border, config.bg)}>
       <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-gray-500">#{activity.id}</span>
            <span className={cn("text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border tracking-wider", config.color, config.border)}>
                {activity.status}
            </span>
       </div>
       
       <h4 className="text-sm font-semibold text-gray-200 mb-2 truncate">
            {activity.title}
       </h4>

       <div className="flex flex-wrap gap-2 mb-3">
          {activity.tags.map(tag => (
              <span key={tag} className="text-[10px] text-gray-400 bg-black/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <PlayCircle className="w-2.5 h-2.5 opacity-50" />
                  {tag}
              </span>
          ))}
       </div>

       {activity.scheduleTime && (
           <div className="w-full text-right text-[10px] text-gray-500 border-t border-gray-700/30 pt-2">
                {activity.scheduleTime}
           </div>
       )}
       {activity.hash && (
           <div className="w-full text-right text-[10px] text-emerald-500/70 font-mono border-t border-gray-700/30 pt-2 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                {activity.hash}
           </div>
       )}
    </div>
  );
}
