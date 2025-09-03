import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      navigate('/login')
      return
    }

    const handleCallback = async () => {
      // URL 파라미터에서 오류 확인
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')
      
      if (error) {
        console.error('OAuth Error:', error, errorDescription)
        setErrorMessage(errorDescription || error)
        
        // 오류가 있으면 3초 후 로그인 페이지로
        setTimeout(() => {
          navigate('/login')
        }, 3000)
        return
      }

      // Hash fragment 체크 (#access_token=...)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      
      if (accessToken) {
        console.log('Access token found in hash')
        // Supabase가 자동으로 처리하도록 대기
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // 세션 확인
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        setErrorMessage('세션 확인 중 오류 발생')
        setTimeout(() => navigate('/login'), 3000)
        return
      }
      
      if (session) {
        console.log('OAuth login successful:', session.user.email)
        navigate('/')
      } else {
        console.log('No session found after OAuth callback')
        setErrorMessage('로그인 처리 중 문제가 발생했습니다')
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    handleCallback()
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">
          {errorMessage ? '오류 발생' : '로그인 중...'}
        </h2>
        <p className="text-muted-foreground">
          {errorMessage || '잠시만 기다려주세요.'}
        </p>
        {errorMessage && (
          <p className="text-sm text-muted-foreground mt-2">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        )}
      </div>
    </div>
  )
}