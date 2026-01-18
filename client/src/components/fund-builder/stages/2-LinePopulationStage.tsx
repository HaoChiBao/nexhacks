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

  // On mount, if no holdings, run scan
  useEffect(() => {
    if (draft.holdings.length === 0 && availableLines.length === 0) {
        handleScan();
    } else if (draft.holdings.length > 0) {
        // Hydrate from draft if coming back
        setSelectedIds(new Set(draft.holdings.map(h => h.id)));
        // Note: In real app, we'd fetch the full universe again or store it. 
        // For mock, we'll just re-fetch universe to show the list + selected ones.
        scanMarketUniverse(draft.universeRules).then(setAvailableLines);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScan = async () => {
      // Trigger store action for "thinking" events
      runMarketScan().then(async () => {
          // Then manually set the local state for UI (in real app, store would hold "universe")
          const lines = await scanMarketUniverse(draft.universeRules);
          setAvailableLines(lines);
          const initialSelection = new Set(lines.slice(0, 4).map(l => l.id)); // Default select top 4
          setSelectedIds(initialSelection);
          
          // Update draft immediately
          const holdings = lines.filter(l => initialSelection.has(l.id)).map(l => ({ ...l, targetWeight: 0, locked: false }));
          updateDraft({ holdings });
      });
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

      {/* Group by Clusters */}
      {['High Liquidity', 'High Correlation', 'Diversification'].map(cluster => {
          const clusterLines = availableLines.filter(l => l.cluster === cluster);
          if (clusterLines.length === 0) return null;

          return (
              <div key={cluster} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest mt-6 mb-2">
                     <Zap className="w-3 h-3" /> {cluster} Cluster
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clusterLines.map(line => (
                          <LineCard 
                            key={line.id} 
                            line={line} 
                            mode="select"
                            isSelected={selectedIds.has(line.id)}
                            onToggleSelect={() => toggleSelection(line)}
                          />
                      ))}
                  </div>
              </div>
          )
      })}
      
      {/* Fallback for null cluster */}
       <div className="space-y-3">
          {availableLines.filter(l => !l.cluster).map(line => (
               <LineCard 
                  key={line.id} 
                  line={line} 
                  mode="select"
                  isSelected={selectedIds.has(line.id)}
                  onToggleSelect={() => toggleSelection(line)}
                />
          ))}
       </div>

      <div className="flex justify-end pt-8 pb-10">
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
