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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      try {
        const res = await fetch(`${API_URL}/users/${userId}/profile`)
        if (res.ok) {
           const data = await res.json()
           if (data) {
             setBalance(Number(data.balance))
           }
        } else {
           console.error(`Failed to fetch profile: ${res.status} ${res.statusText}`)
           if (res.status === 404) {
               // Optional: Trigger profile creation via another endpoint if needed, 
               // but for now we just log as per "pulling" migration task.
               console.log("Profile not found on backend.")
           }
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
