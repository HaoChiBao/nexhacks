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
        
        if (error) {
          if (error.code === 'PGRST116') {
             // Profile doesn't exist (legacy user?), create it
             console.log("No profile found, creating default profile...");
             const { error: insertError } = await supabase
                .from('profiles')
                .insert([{ id: userId, balance: 10000.00, email: "user@example.com" }]) // Email is optional or placeholder
             
             if (!insertError) {
                setBalance(10000.00)
             }
          } else {
             console.error("Error fetching profile:", error)
          }
        } else if (data) {
          setBalance(Number(data.balance))
        }
      } catch (e) {
         console.error("Exception in fetchProfile", e)
      }
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
