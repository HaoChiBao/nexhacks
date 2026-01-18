import { Handle, Position } from 'reactflow';
import { TrendingUp, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FundNodeProps {
  data: {
    label: string;
    ticker: string;
    nav: number;
    returnPct: number;
  };
}

export function FundNode({ data }: FundNodeProps) {
  return (
    <div className="bg-card-light dark:bg-card-dark border-2 border-primary rounded-xl w-64 shadow-xl overflow-hidden group">
      {/* Header */}
      <div className="bg-primary/10 p-3 border-b border-primary/20 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                {data.ticker}
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
         </div>
         <GripHorizontal className="w-4 h-4 text-primary/40 cursor-grab active:cursor-grabbing" />
      </div>

      {/* Body */}
      <div className="p-4 bg-gradient-to-br from-transparent to-primary/5">
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-3">
            {data.label}
        </h3>
        
        <div className="flex justify-between items-end">
            <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-0.5">NAV</p>
                <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                    ${data.nav.toLocaleString()}
                </p>
            </div>
            <div className="text-right">
                <div className="flex items-center gap-1 text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{data.returnPct}%
                </div>
            </div>
        </div>
      </div>

      {/* Connection Points */}
      <Handle type="source" position={Position.Right} className="!bg-primary !w-3 !h-5 !rounded-lg !border-none" />
      {/* Funds typically originate flow, but could receive inputs if we model deposits/sources later */}
    </div>
  );
}
