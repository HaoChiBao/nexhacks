'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useAppStore } from '@/store/useAppStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setLoading } = useAuthStore()
  const { setBalance } = useAppStore()

  useEffect(() => {
    const fetchProfile = async (currentUser: any) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      try {
        const res = await fetch(`${API_URL}/users/${currentUser.id}/profile`)
        if (res.ok) {
           const data = await res.json()
           if (data) {
             setBalance(Number(data.balance))
             
             // Sync profile data to user metadata
             const updatedUser = {
               ...currentUser,
               user_metadata: {
                 ...currentUser.user_metadata,
                 avatar_url: data.avatar_url || currentUser.user_metadata?.avatar_url,
                 full_name: data.full_name || currentUser.user_metadata?.full_name,
               }
             }
             setUser(updatedUser)
           }
        } else {
           console.error(`Failed to fetch profile: ${res.status} ${res.statusText}`)
           if (res.status === 404) {
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
          await fetchProfile(session.user)
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
        await fetchProfile(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setSession, setLoading, setBalance])

  return <>{children}</>
}
