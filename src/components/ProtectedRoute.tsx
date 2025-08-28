import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      // 현재 페이지를 return URL로 저장하고 로그인 페이지로 리다이렉트
      const returnUrl = encodeURIComponent(location.pathname + location.search)
      navigate(`/login?returnUrl=${returnUrl}`, { replace: true })
    }
  }, [user, loading, navigate, location])

  // 로딩 중이면 로딩 스피너 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">로그인 상태를 확인하고 있습니다...</p>
        </div>
      </div>
    )
  }

  // 로그인되지 않은 경우 null 반환 (리다이렉트 진행 중)
  if (!user) {
    return null
  }

  // 로그인된 경우에만 자식 컴포넌트 렌더링
  return <>{children}</>
}