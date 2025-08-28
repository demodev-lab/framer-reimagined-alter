import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (!supabase) {
      navigate('/login')
      return
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const returnUrl = searchParams.get('returnUrl')
        if (returnUrl) {
          navigate(decodeURIComponent(returnUrl))
        } else {
          navigate('/')
        }
      }
    })
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">로그인 중...</h2>
        <p className="text-muted-foreground">잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}