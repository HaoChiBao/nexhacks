import { useEffect, useState } from "react";
import { useFundBuilderStore } from "@/store/useFundBuilderStore";
import { Button } from "@/components/ui/button";
import { LineCard } from "../LineCard";
import { generateBacktestData } from "@/lib/mock/fund-builder-data";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WeightingStage() {
    const { draft, updateDraft, setStage } = useFundBuilderStore();
    const [totalWeight, setTotalWeight] = useState(0);
    // Mock backtest result
    const backtest = generateBacktestData();

    useEffect(() => {
        // Initial equal weight if 0
        const nonZero = draft.holdings.some(h => h.targetWeight > 0);
        if (!nonZero && draft.holdings.length > 0) {
            const equalShare = 100 / draft.holdings.length;
            const updated = draft.holdings.map(h => ({ ...h, targetWeight: equalShare }));
            updateDraft({ holdings: updated });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setTotalWeight(draft.holdings.reduce((sum, h) => sum + h.targetWeight, 0));
    }, [draft.holdings]);

    const handleWeightChange = (id: string, val: number) => {
        const updated = draft.holdings.map(h => h.id === id ? { ...h, targetWeight: val } : h);
        updateDraft({ holdings: updated });
    };

    const autoBalance = () => {
        const equalShare = 100 / draft.holdings.length;
        const updated = draft.holdings.map(h => ({ ...h, targetWeight: equalShare }));
        updateDraft({ holdings: updated });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Set Allocation Weights</h2>
                    <p className="text-gray-400 text-sm">Define target exposure. Max {draft.riskRules.maxWeightPerLine}% per line suggested.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-2",
                        Math.abs(totalWeight - 100) < 0.1 ? "bg-emerald-900/30 text-emerald-500 border border-emerald-800" : "bg-red-900/30 text-red-500 border border-red-800"
                    )}>
                        Sum: {totalWeight.toFixed(1)}%
                    </div>
                    <Button variant="secondary" onClick={autoBalance} className="text-xs">
                        Auto-Balance
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.holdings.map(line => (
                    <LineCard
                        key={line.id}
                        line={line}
                        mode="weight"
                        weight={line.targetWeight}
                        onWeightChange={(val) => handleWeightChange(line.id, val)}
                    />
                ))}
            </div>

            {/* Backtest & Risk Simulation */}
            <div className="bg-surface-dark border border-border-dark rounded-xl p-6 mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" /> Backtest Simulation
                    </h3>
                    <div className="text-right">
                        <span className="text-emerald-400 font-bold text-xl">+{backtest.totalReturn.toFixed(1)}%</span>
                        <p className="text-[10px] text-gray-500 uppercase">Estimated Yield (last 90d)</p>
                    </div>
                </div>

                {/* Mock Chart Bars */}
                <div className="h-32 flex items-end gap-1 mb-6">
                    {backtest.chartData.map((pt, i) => {
                        const height = Math.max(10, ((pt.value - 80) / 40) * 100);
                        return (
                            <div
                                key={i}
                                className="flex-1 bg-gray-700/50 hover:bg-emerald-500/50 transition-colors rounded-t-sm"
                                style={{ height: `${height}%` }}
                                title={`${pt.date}: ${pt.value.toFixed(2)}`}
                            />
                        )
                    })}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-dark">
                    <div className="bg-black/20 p-4 rounded-lg text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Sharpe Ratio</p>
                        <p className="text-xl font-bold text-white">{backtest.sharpe}</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Sortino</p>
                        <p className="text-xl font-bold text-white">{backtest.sortino}</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Beta</p>
                        <p className="text-xl font-bold text-white">{backtest.beta}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-8 pb-10">
                <Button
                    variant="ghost"
                    onClick={() => setStage('LINE_POPULATION')}
                    className="text-gray-400 hover:text-white"
                >
                    &larr; Back
                </Button>
                <Button
                    onClick={() => setStage('FINALIZE')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8"
                >
                    Continue to Finalize
                </Button>
            </div>
        </div>
    );
}
