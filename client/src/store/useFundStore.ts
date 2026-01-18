import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { Fund } from '@/lib/data/funds'

interface FundState {
  funds: Fund[]
  isLoading: boolean
  error: string | null
  fetchFunds: () => Promise<void>
}

export const useFundStore = create<FundState>((set) => ({
  funds: [],
  isLoading: false,
  error: null,
  fetchFunds: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('funds')
        .select('*')
      
      if (error) throw error

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
          nav: item.nav,
          aum: item.aum,
        },
        holdings: item.holdings,
        tags: item.tags,
        createdBy: item.created_by || 'Unknown',
      }))

      set({ funds: mappedFunds })
    } catch (err: any) {
      console.error('Error fetching funds:', err)
      set({ error: err.message })
    } finally {
      set({ isLoading: false })
    }
  },
}))
