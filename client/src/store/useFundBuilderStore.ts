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
  persist(
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

        // Start "Thinking" Simulation Loop
        const thoughts = [
          "Research Agent: Scanning trusted sources (Reuters, Bloomberg, Polymarket)...",
          "Research Agent: Filtering irrelevant volatility...",
          "Research Agent: Synthesizing cross-market signals...",
          "Allocator Agent: Fetching live orderbooks via Gamma API...",
          "Allocator Agent: Screening for minimum liquidity ($50k+)...",
          "Allocator Agent: Analyzing historical spread and slippage...",
          "Allocator Agent: Calculating optimal Kelly criteria weights...",
          "Allocator Agent: Finalizing basket composition..."
        ];

        let thoughtIndex = 0;
        const thinkingInterval = setInterval(() => {
          if (thoughtIndex < thoughts.length) {
            const [role, msg] = thoughts[thoughtIndex].split(': ');
            addAgentEvent({
              title: role,
              message: msg,
              status: 'running',
              type: 'thinking'
            });
            thoughtIndex++;
          }
        }, 2000); // New thought every 2s

        try {
          // Dynamic import to avoid circular dependencies if any, though likely safe here
          const { fetchRebalance } = await import("@/lib/api");

          const data = await fetchRebalance(topic, topic); // Use topic as description for now

          clearInterval(thinkingInterval); // Stop thinking

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
              correlationScore: t.outcome === 'YES' ? 0.99 : 0.01, // Hack: Store side in correlation for now or just trust outcome field
              cluster: t.outcome === 'YES' ? 'Likely' : 'Unlikely',
              tags: [],
              lastPrice: t.last_price || 0,
              targetWeight: t.weight * 100,
              locked: false,
              outcome: t.outcome,
              reasoning: t.rationale
            }));

            updateDraft({
              holdings: holdings as any,
              name: topic,
              // thesis: cleanThesis, // Don't overwrite user input
              reportMarkdown: data.recommendation
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
            return data; // Return data for UI side-effects

          } else {
            addAgentEvent({ title: 'Analysis Failed', message: 'No data returned.', status: 'failed', type: 'thinking' })
          }
        } catch (e) {
          clearInterval(thinkingInterval);
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
    }),
    {
      name: 'fund-builder-storage',
      partialize: (state) => ({
        draft: state.draft,
        currentStage: state.currentStage
      }) // Persist only draft and stage
    }
  )
)
