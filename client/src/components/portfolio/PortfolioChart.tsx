"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";
import { NavDataPoint } from "@/lib/types/portfolio";
import { Label } from "@/components/ui/label";

interface PortfolioChartProps {
  data: NavDataPoint[];
}

// Custom Switch since we might not have shadcn Switch handy or configured
function CustomSwitch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) {
    return (
        <div 
            onClick={() => onCheckedChange(!checked)}
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${checked ? 'bg-emerald-500' : 'bg-gray-700'}`}
        >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm ${checked ? 'left-5' : 'left-0.5'}`} />
        </div>
    )
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  const [showHedge, setShowHedge] = useState(false);

  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-6 w-full h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-white text-sm uppercase tracking-wide">Total NAV Performance</h3>
             <div className="flex items-center gap-2">
                 <Label className="text-xs text-gray-400">Hedge Contribution</Label>
                 <CustomSwitch checked={showHedge} onCheckedChange={setShowHedge} />
             </div>
        </div>
        
        <div className="flex-grow w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorHedge" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(val) => `${(val/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number, name: string) => [
                            value.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                            name === 'nav' ? 'NAV Credits' : 'Hedge Value'
                        ]}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="nav" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorNav)" 
                        activeDot={{ r: 4, fill: "#fff" }}
                    />
                    {showHedge && (
                        <Area 
                            type="monotone" 
                            dataKey="hedgeImpact" 
                            stroke="#f43f5e" 
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            fillOpacity={1} 
                            fill="url(#colorHedge)" 
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
