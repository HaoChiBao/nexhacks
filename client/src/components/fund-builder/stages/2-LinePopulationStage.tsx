import { useEffect, useState } from "react";
import { useFundBuilderStore } from "@/store/useFundBuilderStore";
import { Button } from "@/components/ui/button";
import { LineCard } from "../LineCard";
import { RefreshCw, Zap } from "lucide-react";
import { MarketLine } from "@/lib/types/fund-builder";
import { scanMarketUniverse } from "@/lib/mock/fund-builder-data";

export function LinePopulationStage() {
    const { draft, updateDraft, setStage, runMarketScan, isAnalyzing } = useFundBuilderStore();
    const [availableLines, setAvailableLines] = useState<MarketLine[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // On mount, hydrate from draft holdings IF availableLines is empty
    useEffect(() => {
        if (draft.holdings.length > 0 && availableLines.length === 0) {
            setAvailableLines(draft.holdings);
            setSelectedIds(new Set(draft.holdings.map(h => h.id)));
        }
    }, [draft.holdings, availableLines.length]);

    const handleScan = async () => {
        // In real app, this might trigger a re-run of specific rules
        // For now, allow re-running analysis if needed, or just warn
        // But actually, we just rely on what came from ResearchStage
        console.log("Rescan requested - not implemented fully yet, relying on initial analysis.");
    };

    const toggleSelection = (line: MarketLine) => {
        const next = new Set(selectedIds);
        if (next.has(line.id)) {
            next.delete(line.id);
        } else {
            next.add(line.id);
        }
        setSelectedIds(next);

        // Update draft
        const holdings = availableLines.filter(l => next.has(l.id)).map(l => ({ ...l, targetWeight: 0, locked: false }));
        updateDraft({ holdings });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Populate & Weight Lines</h2>
                    <p className="text-gray-400 text-sm">Refine the suggested basket. AI clusters based on correlation.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleScan} disabled={isAnalyzing} className="border-gray-700 text-gray-300 hover:text-white">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        Re-scan Markets
                    </Button>
                </div>
            </div>

            {availableLines.length === 0 && !isAnalyzing && (
                <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-xl">
                    No markets found. Try scanning.
                </div>
            )}

            {/* Sorted List: Likelihood Descending */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableLines
                    .sort((a, b) => {
                        // 1. Likelihood: "YES" or Custom Names (Likely) vs "NO" (Unlikely)
                        const isLikelyA = a.outcome !== 'NO';
                        const isLikelyB = b.outcome !== 'NO';

                        if (isLikelyA && !isLikelyB) return -1;
                        if (!isLikelyA && isLikelyB) return 1;

                        // 2. Secondary: Volume (Descending) - Popular stuff first
                        return (b.volume || 0) - (a.volume || 0);
                    })
                    .map(line => (
                        <LineCard
                            key={line.id}
                            line={line}
                            mode="select"
                            isSelected={selectedIds.has(line.id)}
                            onToggleSelect={() => toggleSelection(line)}
                        />
                    ))}
            </div>

            <div className="flex justify-between pt-8 pb-10">
                <Button
                    variant="ghost"
                    onClick={() => setStage('RESEARCH')}
                    className="text-gray-400 hover:text-white"
                >
                    &larr; Back
                </Button>
                <Button
                    onClick={() => setStage('WEIGHTING')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] transition-shadow hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.6)]"
                    disabled={selectedIds.size === 0}
                >
                    Continue to Weighting
                </Button>
            </div>
        </div>
    );
}
