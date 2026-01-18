import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { Fund, funds as localFunds } from '@/lib/data/funds'

interface FundState {
  funds: Fund[]
  isLoading: boolean
  error: string | null
  fetchFunds: (force?: boolean) => Promise<void>
  addFund: (fund: Fund) => void
}

export const useFundStore = create<FundState>((set, get) => ({
  funds: [],
  isLoading: false,
  error: null,
  addFund: (fund) => set((state) => ({ funds: [fund, ...state.funds] })),
  fetchFunds: async (force = false) => {
    // Prevent duplicate fetches or unnecessary re-fetches
    if (!force && (get().funds.length > 0 || get().isLoading)) {
      console.log("Funds already loaded or loading, skipping fetch.");
      return;
    }

    console.log("Fetching funds from Supabase...");
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('funds')
        .select('*')
      
      if (error) {
        console.error("Supabase error fetching funds:", error);
        throw error
      }

      if (!data) {
        throw new Error("No data returned from Supabase");
      }

      console.log(`Successfully fetched ${data.length} funds.`);

      // Map DB snake_case to camelCase if necessary, or ensure DB columns match interface.
      // SQL schema uses snake_case for some columns: returns_month, returns_inception, liquidity_score etc.
      // We need to map them to the nested structure of the Fund interface.

      const mappedFunds: Fund[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        thesis: item.thesis,
        secondaryThesis: item.secondary_thesis,
        logo: item.logo,
        metrics: {
          sharpe: item.sharpe,
          nav: item.nav || 10,
          aum: item.aum || 0,
        },
        holdings: item.holdings || [], // Ensure holdings is an array
        tags: item.tags || [], // Ensure tags is an array
        createdBy: item.created_by || 'Unknown',
      }))

      set({ funds: mappedFunds })
    } catch (err: any) {
      console.error('Error fetching funds:', err)
      console.log("Falling back to local JSON data...");
      set({ funds: localFunds, error: null }) // Fallback to local data
    } finally {
      set({ isLoading: false })
    }
  },
}))
