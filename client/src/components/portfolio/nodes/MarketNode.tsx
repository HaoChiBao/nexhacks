import { Handle, Position } from 'reactflow';
import { Target, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketNodeProps {
  data: {
    label: string;
    outcome: 'YES' | 'NO';
    prob: number;
    weight: number;
    pnl?: number;
    isHedge?: boolean;
  };
}

export function MarketNode({ data }: MarketNodeProps) {
  const isHedge = data.isHedge;
  const borderColor = isHedge ? 'border-red-500' : 'border-blue-500';
  const bgColor = isHedge ? 'bg-red-500/10' : 'bg-blue-500/10';
  const textColor = isHedge ? 'text-red-400' : 'text-blue-400';

  return (
    <div className={cn("bg-card-light dark:bg-card-dark border rounded-xl w-60 shadow-lg transition-all hover:shadow-xl", borderColor)}>
      <Handle type="target" position={Position.Left} className={cn("!w-3 !h-5 !rounded-lg !border-none", isHedge ? "!bg-red-500" : "!bg-blue-500")} />
      
      <div className="p-3">
        {/* Badge */}
        <div className="flex justify-between items-start mb-2">
             <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase", bgColor, borderColor, textColor)}>
                {isHedge ? 'HEDGE' : 'POSITION'}
             </span>
             <span className="text-[10px] font-mono text-gray-500">{data.prob}% Prob</span>
        </div>

        {/* Content */}
        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-3">
            {data.label}
        </h4>

        {/* Stats */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-2 mt-2">
            <div className="flex items-center gap-2">
                <div className={cn("h-8 w-8 rounded flex items-center justify-center font-bold text-sm", 
                    data.outcome === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                    {data.outcome}
                </div>
                <div>
                     <p className="text-[10px] text-gray-500">Weight</p>
                     <p className="text-xs font-bold text-gray-900 dark:text-white">{data.weight}%</p>
                </div>
            </div>

            {data.pnl !== undefined && (
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500">Unrealized</p>
                    <p className={cn("text-xs font-bold", data.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                        {data.pnl >= 0 ? '+' : ''}${data.pnl.toLocaleString()}
                    </p>
                 </div>
            )}
        </div>
      </div>
      
      {/* Logic outputs could go here for chaining */}
      <Handle type="source" position={Position.Right} className="!bg-gray-500 !w-2 !h-2" />
    </div>
  );
}
