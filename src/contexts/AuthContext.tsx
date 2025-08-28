import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithKakao: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithKakao = async () => {
    if (!supabase) {
      console.error('Supabase is not configured')
      throw new Error('Authentication is not available. Please configure Supabase.')
    }

    // URL에서 returnUrl 파라미터를 가져와서 콜백 URL에 포함
    const currentUrl = new URL(window.location.href)
    const returnUrl = currentUrl.searchParams.get('returnUrl')
    const callbackUrl = returnUrl 
      ? `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`
      : `${window.location.origin}/auth/callback`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: callbackUrl,
      },
    })
    
    if (error) {
      console.error('Error during Kakao login:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) {
      console.error('Supabase is not configured')
      throw new Error('Authentication is not available. Please configure Supabase.')
    }

    // URL에서 returnUrl 파라미터를 가져와서 콜백 URL에 포함
    const currentUrl = new URL(window.location.href)
    const returnUrl = currentUrl.searchParams.get('returnUrl')
    const callbackUrl = returnUrl 
      ? `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`
      : `${window.location.origin}/auth/callback`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
      },
    })
    
    if (error) {
      console.error('Error during Google login:', error)
      throw error
    }
  }

  const signOut = async () => {
    if (!supabase) {
      console.error('Supabase is not configured')
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error during sign out:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithKakao, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}