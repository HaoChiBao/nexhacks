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
  runMockAnalysis: (topic: string) => Promise<void>
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

      runMockAnalysis: async (topic) => {
        const { addAgentEvent } = get()
        set({ isAnalyzing: true })
        
        // Mock Sequence
        addAgentEvent({ title: 'Topic Defined', message: topic, status: 'running', type: 'thinking' })
        
        await new Promise(r => setTimeout(r, 1200))
        addAgentEvent({ title: 'Fetching sources', message: 'Checking 50+ signal aggregators...', status: 'running', type: 'thinking' })
        
        await new Promise(r => setTimeout(r, 1500))
        set({ 
          resourceLinks: [
            { title: 'Risk_Assessment_v2.pdf', url: '#' },
            { title: 'Correlation_Data.csv', url: '#' }
          ] 
        })
        addAgentEvent({ title: 'Analysis Complete', message: 'Found 8 high-signal prediction lines.', status: 'done', type: 'resource' })
        
        set({ isAnalyzing: false })
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
