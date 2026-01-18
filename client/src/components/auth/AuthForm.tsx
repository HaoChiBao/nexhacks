'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'

interface AuthFormProps {
  view: 'login' | 'signup'
}

export function AuthForm({ view }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const handleResendVerification = async () => {
    setMessage(null)
    setError(null)
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      if (resendError) throw resendError
      setMessage('Verification email sent! Please check your inbox.')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      })
      if (googleError) throw googleError
    } catch (err: any) {
      setError(err.message)
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      let result;
      
      if (view === 'signup') {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        })
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
      }

      const { data, error: authError } = result
      
      if (authError) throw authError

      if (view === 'signup') {
        // On signup, we might want to alert the user to check email if email confirmation is on. 
        // For this demo, we assume auto-confirmation or just redirect.
        if (data.user) {
          if (data.user.identities?.length === 0) {
             setError('This email is already in use.') 
          } else {
             setUser(data.user)
             router.push('/')
          }
        } else if (data.session === null) {
            setMessage("Please check your email for the confirmation link.")
        }
      } else {
        if (data.user) {
          setUser(data.user)
          router.push('/')
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>{view === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
        <CardDescription>
          {view === 'login'
            ? 'Enter your email below to login to your account'
            : 'Enter your email below to create your account'}
        </CardDescription>
      </CardHeader>
      <div className="px-6 mb-4">
        <Button 
            variant="outline" 
            className="w-full relative" 
            onClick={handleGoogleLogin} 
            disabled={googleLoading || loading}
        >
          {googleLoading ? (
             <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
          ) : (
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
          )}
          Sign in with Google
        </Button>
        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/15 text-red-500 text-sm p-3 rounded-md flex flex-col gap-2">
              <p>{error}</p>
              {error.includes('Email not confirmed') && (
                <Button 
                    variant="link" 
                    className="text-red-500 underline p-0 h-auto justify-start font-normal"
                    onClick={() => {
                        // Prevent form submission
                        handleResendVerification()
                    }}
                    type="button"
                >
                    Resend verification email
                </Button>
              )}
            </div>
          )}
          {message && (
             <div className="bg-green-500/15 text-green-500 text-sm p-3 rounded-md">
              {message}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : view === 'login' ? 'Login' : 'Sign Up'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            {view === 'login' ? (
              <>
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
