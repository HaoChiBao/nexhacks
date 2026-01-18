import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FundBuilderStage, FundDraft, AgentEvent, CreatedDoc } from '@/lib/types/fund-builder'
import { scanMarketUniverse } from '@/lib/mock/fund-builder-data'

interface FundBuilderState {
  currentStage: FundBuilderStage
  draft: FundDraft
  agentEvents: AgentEvent[]
  createdDocs: CreatedDoc[]
  resourceLinks: { title: string, url: string }[]
  isAnalyzing: boolean

  // Actions
  setStage: (stage: FundBuilderStage) => void
  updateDraft: (updates: Partial<FundDraft>) => void
  resetDraft: () => void

  // Agent Actions
  addAgentEvent: (event: Omit<AgentEvent, 'id' | 'timestamp'>) => void
  runAnalysis: (topic: string) => Promise<any>
  runMarketScan: () => Promise<void>
}

const INITIAL_DRAFT: FundDraft = {
  id: '',
  name: '',
  thesis: '',
  category: '',
  cadence: 'Weekly',
  universeRules: {
    includeTags: [],
    excludeTags: [],
    minLiquidity: 50000,
    minVolume: 10000,
    expiryWindow: { minDays: 7, maxDays: 90 },
    sources: ['Polymarket']
  },
  riskRules: {
    maxWeightPerLine: 25,
    minLiquidityScore: 50,
    maxDrawdownLimit: 15
  },
  holdings: [],
  status: 'DRAFT'
}

export const useFundBuilderStore = create<FundBuilderState>()(
  (set, get) => ({
    currentStage: 'RESEARCH',
    draft: INITIAL_DRAFT,
    agentEvents: [],
    createdDocs: [],
    resourceLinks: [],
    isAnalyzing: false,

    setStage: (stage) => set({ currentStage: stage }),

    updateDraft: (updates) => set((state) => ({
      draft: { ...state.draft, ...updates }
    })),

    resetDraft: () => set({
      currentStage: 'RESEARCH',
      draft: { ...INITIAL_DRAFT, id: crypto.randomUUID() },
      agentEvents: [],
      createdDocs: [],
      resourceLinks: []
    }),

    addAgentEvent: (event) => set((state) => ({
      agentEvents: [
        { ...event, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
        ...state.agentEvents
      ]
    })),

    runAnalysis: async (topic: string) => {
      const { addAgentEvent, updateDraft } = get()
      set({ isAnalyzing: true })

      addAgentEvent({ title: 'Topic Defined', message: topic, status: 'running', type: 'thinking' })

      try {
        const { fetchRebalanceStream } = await import("@/lib/api");

        // Callback for real-time logs
        const onLog = (log: any) => {
          let status: 'done' | 'running' | 'failed' = 'done';
          if (log.type === 'start') status = 'running';
          if (log.type === 'end') status = 'done';
          if (log.type === 'error') status = 'failed';
          if (log.type === 'thinking') status = 'running';

          // Friendly node names
          const nodeFriendlyNames: Record<string, string> = {
            'research': 'Analyzing',
            'allocator': 'Optimizing',
            'orchestrator': 'Finalizing',
            'Research Agent': 'Analyzing',
            'Allocator Agent': 'Optimizing'
          };
          const title = nodeFriendlyNames[log.node] || `[${log.node}]`;

          addAgentEvent({
            title,
            message: log.message,
            status: status,
            type: log.type === 'thinking' ? 'thinking' : 'resource'
          });
        };

        const data = await fetchRebalanceStream(topic, topic, onLog);

        if (data) {
          const holdings = data.plan.targets.map(t => ({
            id: t.market_id,
            question: t.question || t.event_title || "Unknown Market",
            slug: t.market_slug,
            source: "Polymarket",
            volume: t.volume_usd || 0,
            liquidity: t.liquidity_usd || 0,
            expiryDate: "2025-12-31",
            category: "Generated",
            correlationScore: t.outcome === 'YES' ? 0.99 : 0.01,
            cluster: t.outcome === 'YES' ? 'Likely' : 'Unlikely',
            tags: [],
            lastPrice: t.last_price || 0,
            targetWeight: t.weight > 1 ? t.weight : t.weight * 100,
            locked: false,
            outcome: t.outcome,
            reasoning: t.rationale
          }));

          updateDraft({
            holdings: holdings as any,
            name: topic,
            reportMarkdown: data.summary_markdown,
            proposalJson: data.proposal_json,
            reportPdf: data.report_pdf
          });

          addAgentEvent({
            title: 'Analysis Complete',
            message: `Found ${holdings.length} opportunities.`,
            status: 'done',
            type: 'resource'
          })

          set({
            resourceLinks: data.research.evidence_items.map((item, i) => ({
              title: item.title || `Source ${i + 1}`,
              url: item.url
            }))
          })

          set({ isAnalyzing: false })
          return data;

        } else {
          addAgentEvent({ title: 'Analysis Failed', message: 'No data returned.', status: 'failed', type: 'thinking' })
        }
      } catch (e) {
        console.error(e)
        addAgentEvent({ title: 'Error', message: 'System error during analysis.', status: 'failed', type: 'thinking' })
      }

      set({ isAnalyzing: false })
      return null;
    },

    runMarketScan: async () => {
      const { draft, addAgentEvent, updateDraft } = get()
      set({ isAnalyzing: true })

      addAgentEvent({ title: 'Scanning Markets', message: `Applying rules: ${draft.universeRules.includeTags.join(', ')}`, status: 'running', type: 'thinking' })

      const results = await scanMarketUniverse(draft.universeRules)

      // Convert to Holdings with default equal weight
      const holdings = results.map(line => ({
        ...line,
        targetWeight: 0,
        locked: false
      }))

      updateDraft({ holdings })

      await new Promise(r => setTimeout(r, 800))
      addAgentEvent({ title: 'Clustering Liquidity', message: 'Grouping similar markets to minimize slippage.', status: 'done', type: 'thinking' })

      set({ isAnalyzing: false })
    }
  })
)
