import { useState } from "react";
import { useFundBuilderStore } from "@/store/useFundBuilderStore";
import { useFundStore } from "@/store/useFundStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DocumentPreviewModal } from "../DocumentPreviewModal";
import { supabase } from "@/lib/supabase";

export function FinalizeStage() {
  const { draft, updateDraft, setStage } = useFundBuilderStore();
  const { addFund } = useFundStore(); 
  const router = useRouter();

  const [isPublishing, setIsPublishing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    type: "markdown" | "json" | "pdf";
    filename: string;
  }>({
    isOpen: false,
    title: "",
    content: "",
    type: "markdown",
    filename: "",
  });

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Allow guest publishing
        const ownerId = user?.id || null;
        const createdBy = user?.user_metadata?.full_name || user?.email || 'Anonymous';

        const fundPayload = {
            id: draft.id,
            name: draft.name,
            thesis: draft.thesis,
            status: 'Live',
            holdings: draft.holdings,
            tags: [draft.category, draft.cadence], 
            owner_id: ownerId,
            created_by: createdBy,
            
            // Metrics
            returns_month: 0,
            returns_inception: 0,
            liquidity_score: draft.riskRules.minLiquidityScore || 50,
            aum: 0,
            nav: 10,  
            max_drawdown: 0,
            top_concentration: Math.max(...draft.holdings.map(h => h.targetWeight)) || 0,
            sharpe: 0,
            
            // Artifacts
            report_markdown: draft.reportMarkdown,
            proposal_json: draft.proposalJson,
            report_pdf: draft.reportPdf,
            categories: [draft.category, draft.cadence]
        };

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${API_URL}/funds`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fundPayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to publish fund via backend");
        }

        const responseData = await response.json();
        const newFundId = responseData.fund_id; // Backend generated ID
        const createdFund = responseData.fund;

        // Manually update the global store with the new fund data so the redirect works immediately
        // We need to map the backend response (snake_case/mixed) to our frontend Fund interface
        if (createdFund) {
             addFund({
                id: createdFund.id,
                name: createdFund.name,
                thesis: createdFund.thesis,
                secondaryThesis: createdFund.secondary_thesis,
                logo: createdFund.logo,
                metrics: {
                    sharpe: createdFund.sharpe || 0,
                    nav: createdFund.nav || 10,
                    aum: createdFund.aum || 0,
                },
                holdings: createdFund.holdings || [],
                tags: createdFund.tags || [],
                createdBy: createdFund.created_by || 'Anonymous',
             });
        }

        updateDraft({ status: 'PUBLISHED' });
        
        // Redirect to the new fund page using the authoritative ID
        router.push(`/funds/${newFundId}`);

    } catch (err: any) {
        console.error("Error publishing fund:", err);
        alert(`Failed to publish fund: ${err.message}`);
    } finally {
        setIsPublishing(false);
    }
  };

  const openPreview = (type: "summary" | "allocation" | "pdf") => {
    if (type === "summary") {
      setPreviewDoc({
        isOpen: true,
        title: "Fund Research Summary",
        content: draft.reportMarkdown || "No research summary generated.",
        type: "markdown",
        filename: `${draft.name.replace(/\s+/g, "_")}_Summary.md`
      });
    } else if (type === "pdf") {
      setPreviewDoc({
        isOpen: true,
        title: "Scientific Research Report (PDF)",
        content: draft.reportPdf || "",
        type: "pdf",
        filename: `${draft.name.replace(/\s+/g, "_")}_Report.pdf`
      });
    } else {
      setPreviewDoc({
        isOpen: true,
        title: "Initial Allocation Proposal",
        content: draft.proposalJson || "{}",
        type: "json",
        filename: `${draft.name.replace(/\s+/g, "_")}_Allocation.json`
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <DocumentPreviewModal
        isOpen={previewDoc.isOpen}
        onClose={() => setPreviewDoc(s => ({ ...s, isOpen: false }))}
        title={previewDoc.title}
        content={previewDoc.content}
        type={previewDoc.type}
        filename={previewDoc.filename}
      />

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
          <h3 className="text-lg font-bold text-white">FanFunds Research Report</h3>
          <p className="text-sm text-gray-400 max-w-md">
            Our AI Agent has prepared an in-depth behavioral analysis and fund research report.
            This high-fidelity document will be anchored to your fund.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="px-8 py-6 text-sm border-gray-700 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all font-bold"
              onClick={() => openPreview("pdf")}
            >
              <FileText className="w-5 h-5 mr-2" />
              View Research Report (PDF)
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 pb-10 items-center">
        <Button
          variant="ghost"
          onClick={() => setStage('WEIGHTING')}
          className="text-gray-400 hover:text-white"
        >
          &larr; Back
        </Button>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300"
          >
            Save as Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 min-w-[160px]"
          >
            {isPublishing ? (
                 <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...
                 </>
            ) : (
                 <>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Publish Fund
                 </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
