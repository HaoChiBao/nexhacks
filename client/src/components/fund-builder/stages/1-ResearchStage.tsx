import { useFundBuilderStore } from "@/store/useFundBuilderStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ResearchStage() {
  const { draft, updateDraft, setStage, runAnalysis, isAnalyzing } = useFundBuilderStore();

  const handleNext = async () => {
    if (draft.name) {
      // Opt: Don't re-run if we already have holdings and the name hasn't changed substantially
      // (For now just check if holdings exist to prevent accidental re-runs on nav)
      // If user WANTS to re-run, they should probably clear or change name.
      if (draft.holdings.length > 0 && draft.thesis) {
        setStage('LINE_POPULATION');
        return;
      }

      await runAnalysis(draft.name);
      setStage('LINE_POPULATION');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Define Your Strategy</h2>
        <p className="text-gray-400">Set the core thesis and universe rules for your fund.</p>
      </div>

      <div className="space-y-6 bg-surface-dark border border-border-dark p-6 rounded-xl">
        <div className="space-y-4">
          <Label className="text-gray-200">Fund Name</Label>
          <Input
            value={draft.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ name: e.target.value })}
            placeholder="e.g. AI Regulation Hedge"
            className="bg-black/20 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-gray-200">Thesis</Label>
          <Textarea
            value={draft.thesis}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateDraft({ thesis: e.target.value })}
            placeholder="Describe the macro view this fund captures..."
            className="bg-black/20 border-gray-700 text-white min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Rebalance Cadence</Label>
            <select
              className="w-full bg-black/20 border border-gray-700 rounded-md p-2 text-white text-sm focus:border-emerald-500 outline-none"
              value={draft.cadence}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDraft({ cadence: e.target.value as any })}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Event-Driven">Event-Driven</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">Risk Profile</Label>
            <select
              className="w-full bg-black/20 border border-gray-700 rounded-md p-2 text-white text-sm focus:border-emerald-500 outline-none"
            >
              <option>Balanced (Max 25% single pos)</option>
              <option>Aggressive (Max 50% single pos)</option>
              <option>Conservative (Max 10% single pos)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-dark border border-border-dark p-6 rounded-xl">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          Universe Rules <span className="text-[10px] text-gray-500 font-normal uppercase border border-gray-700 px-2 py-0.5 rounded">Auto-Filter</span>
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300 text-xs uppercase font-bold tracking-wide">Include Tags</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-black/20 rounded-lg border border-gray-700/50 min-h-[44px]">
              {['AI', 'Regulation', 'US Politics', 'Tech'].map(tag => (
                <span key={tag} className="px-2 py-1 bg-emerald-900/20 text-emerald-400 text-xs rounded border border-emerald-900/50 cursor-pointer hover:bg-emerald-900/40">
                  {tag} &times;
                </span>
              ))}
              <span className="text-gray-600 text-xs flex items-center px-2 cursor-pointer hover:text-gray-400">+ Add tag</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-300 text-xs uppercase font-bold tracking-wide mb-2 block">Min Liquidity</Label>
              <div className="flex items-center gap-2">
                <input type="range" className="flex-grow h-1.5 bg-gray-700 rounded-lg appearance-none accent-emerald-500" />
                <span className="text-xs font-mono text-emerald-400">$50k</span>
              </div>
            </div>
            <div>
              <Label className="text-gray-300 text-xs uppercase font-bold tracking-wide mb-2 block">Expiry Window</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">7d</span>
                <input type="range" className="flex-grow h-1.5 bg-gray-700 rounded-lg appearance-none accent-emerald-500" />
                <span className="text-xs font-mono text-emerald-400">90d</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8"
          disabled={!draft.name || isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Generate Strategy & Continue"}
        </Button>
      </div>
    </div>
  );
}
