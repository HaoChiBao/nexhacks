import { useFundBuilderStore } from "@/store/useFundBuilderStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function FinalizeStage() {
  const { draft, updateDraft } = useFundBuilderStore();
  const router = useRouter();

  const handlePublish = () => {
    // In a real app, this would save to DB.
    // Here we just mark as published and redirect.
    updateDraft({ status: 'PUBLISHED' });
    
    // Simulate API call
    setTimeout(() => {
        router.push(`/funds`); 
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Finalize Fund</h2>
        <p className="text-gray-400">Review your strategy and publish to the protocol.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
          <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
               <div className="bg-gray-900/50 p-6 border-b border-border-dark flex justify-between items-start">
                   <div>
                       <h3 className="text-xl font-bold text-white">{draft.name}</h3>
                       <p className="text-sm text-gray-400 mt-1 max-w-lg">{draft.thesis}</p>
                   </div>
                   <div className="px-3 py-1 bg-emerald-900/20 text-emerald-500 border border-emerald-900 rounded-full text-xs font-bold uppercase">
                       {draft.cadence} Rebalance
                   </div>
               </div>
               
               <div className="p-6">
                   <h4 className="text-xs uppercase font-bold text-gray-500 mb-4">Allocation Summary</h4>
                   <div className="space-y-3">
                       {draft.holdings.map(h => (
                           <div key={h.id} className="flex items-center justify-between text-sm">
                               <span className="text-gray-300 truncate max-w-[70%]">{h.question}</span>
                               <span className="font-mono text-emerald-400 font-bold">{h.targetWeight.toFixed(1)}%</span>
                           </div>
                       ))}
                   </div>
               </div>
          </div>
          
          <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center text-emerald-500 mb-2">
                   <FileText className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-white">Generated Documentation</h3>
               <p className="text-sm text-gray-400 max-w-md">
                   The AI Agent has prepared the Fund Summary and Initial Allocation Proposal documents. These will be published on-chain with your fund.
               </p>
               <div className="flex gap-4">
                   <Button variant="outline" className="text-xs border-gray-700">View Summary.pdf</Button>
                   <Button variant="outline" className="text-xs border-gray-700">View Allocation.json</Button>
               </div>
          </div>
      </div>

      <div className="flex justify-end pt-8 pb-10 gap-4">
        <Button 
            variant="outline"
            className="border-gray-700 text-gray-300"
        >
          Save as Draft
        </Button>
        <Button 
            onClick={handlePublish} 
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" /> Publish Fund
        </Button>
      </div>
    </div>
  );
}
