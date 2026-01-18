import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => Promise<void>
}

import { supabase } from '@/lib/supabase'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  setUser: (user) => {
    console.log('[useAuthStore] Setting user:', user ? user.id : 'null')
    set({ user })
  },
  setSession: (session) => {
    console.log('[useAuthStore] Setting session:', session ? 'Active' : 'null')
    set({ session })
  },
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },
}))
