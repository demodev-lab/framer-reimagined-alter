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

    // 초기 세션 확인
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // 세션이 있으면 사용자 정보 로그
        if (session?.user) {
          console.log('User authenticated:', {
            id: session.user.id,
            email: session.user.email,
            provider: session.user.app_metadata?.provider,
            created_at: session.user.created_at
          })
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setLoading(false)
      }
    }

    initializeAuth()

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: any, session: Session | null) => {
      console.log('Auth state changed:', event)
      setSession(session)
      setUser(session?.user ?? null)
      
      // 로그인 성공 시 사용자 정보 로그
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', {
          id: session.user.id,
          email: session.user.email,
          provider: session.user.app_metadata?.provider
        })
      }
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