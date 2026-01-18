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
