'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useAppStore } from '@/store/useAppStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setLoading } = useAuthStore()
  const { setBalance } = useAppStore()

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', userId)
          .single()
        
        if (data && !error) {
          setBalance(Number(data.balance))
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('AbortError')) return;
        console.error('Error fetching profile:', err)
      }
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('[AuthProvider] Session check:', session ? 'Found user' : 'No session')
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (error: any) {
        if (
          error.name === 'AbortError' || 
          error.message?.includes('AbortError')
        ) return;
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AuthProvider] Auth State Change: ${event}`, session ? 'Session Active' : 'No Session')
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setSession, setLoading, setBalance])

  return <>{children}</>
}
