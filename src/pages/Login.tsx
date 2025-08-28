
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Logo = () => (
  <a
    href="/"
    className="flex items-center gap-2 mb-8 select-none"
    aria-label="탐구 연구소 홈"
    tabIndex={-1}
  >
    {/* 탐구 연구소 - 메인 브랜드 로고 SVG */}
    <svg fill="none" height="36" width="36" viewBox="0 0 36 36">
      <path d="M18 2L3 10.5v15L18 34l15-8.5v-15z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"/>
      <path d="M18 32.5l-13-7.5-1.5-1v-1.5l1.5-1 13-7.5 13 7.5 1.5 1v1.5l-1.5 1z" fill="currentColor" />
      <path d="M3 10.5L18 18l15-7.5" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
      <path d="M18 34V18" stroke="#fff" strokeLinejoin="round" strokeWidth="2"/>
    </svg>
    <span className="text-lg font-bold text-foreground tracking-tight">탐구 연구소</span>
  </a>
);

const Login = () => {
  const { signInWithKakao, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // 뒤로가기: 히스토리가 있으면 뒤로, 아니면 /
  const handleBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      await signInWithKakao();
    } catch (error) {
      console.error('Kakao login error:', error);
      toast({
        title: "로그인 실패",
        description: "카카오 로그인 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "로그인 실패",
        description: "구글 로그인 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center",
        // 배경은 기존 그라디언트 유지
        "bg-background/80",
        "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]",
        "from-muted/80 to-background"
      )}
    >
      <div
        className={cn(
          "relative rounded-2xl shadow-xl border border-border bg-card/90 mx-4",
          "backdrop-blur-lg flex flex-col items-center w-full max-w-sm px-7 py-10",
          "transition-all"
        )}
      >
        {/* 상단 뒤로가기 버튼 + 로고 */}
        <div className="w-full flex items-center justify-between mb-1 -mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full"
            aria-label="뒤로가기"
            type="button"
          >
            <ArrowLeft size={22} className="text-muted-foreground" />
          </Button>
          <span className="flex-1 flex justify-center pointer-events-none">
            <Logo />
          </span>
          <span className="w-9" /> {/* 우측정렬용 여백 */}
        </div>
        <h1 className="text-xl font-semibold mb-8 text-center text-foreground tracking-tight">
          탐구 연구소에 오신 것을<br />환영합니다
        </h1>
        <div className="flex flex-col gap-3 w-full">
          {/* 카카오 로그인 버튼 */}
          <Button
            className={cn(
              "w-full h-11 font-semibold text-base gap-2 rounded-xl shadow-sm border-0",
              "bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 active:bg-[#FEE500]/80",
              "transition-colors drop-shadow-[0_2px_8px_rgba(254,229,0,0.15)]"
            )}
            onClick={handleKakaoLogin}
            disabled={loading}
            type="button"
          >
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path d="M10 0C4.486 0 0 3.134 0 7.0c0 2.498 1.635 4.699 4.117 6.015L3.37 16.896c-.103.319.108.653.456.65.13-.001.257-.053.35-.143L7.71 13.47c.738.13 1.49.195 2.29.195 5.514 0 10-3.134 10-7.0S15.514 0 10 0z" fill="currentColor"/>
            </svg>
            <span className="tracking-tight">카카오로 계속하기</span>
          </Button>

          {/* 네이버 로그인 버튼 */}
          <Button
            className={cn(
              "w-full h-11 font-semibold text-base gap-2 rounded-xl shadow-sm border-0",
              "bg-[#03C75A] text-white hover:bg-[#03C75A]/90 active:bg-[#03C75A]/80",
              "transition-colors drop-shadow-[0_2px_8px_rgba(3,199,90,0.15)]"
            )}
            onClick={() => {
              // 네이버 로그인 로직 추가 예정
              console.log('네이버 로그인 클릭');
            }}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.6 0H6.4v7.5L10.7 12V20H18V12.5L13.6 7.5V0z" fill="currentColor"/>
              <path d="M6.4 20h7.3v-7.5L9.3 8V0H2v7.5L6.4 12.5V20z" fill="currentColor"/>
            </svg>
            <span className="tracking-tight">네이버로 계속하기</span>
          </Button>

          {/* 구글 로그인 버튼 */}
          <Button
            className={cn(
              "w-full h-11 font-semibold text-base gap-2 rounded-xl shadow-sm border border-gray-200",
              "bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
              "transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            )}
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.99 10.187c0-.82-.069-1.417-.216-2.037H10.2v3.698h5.62c-.113.75-.868 2.292-2.491 3.215v2.815h3.969c2.34-2.16 3.692-5.337 3.692-7.691z" fill="#4285F4"/>
              <path d="M10.2 19.931c3.064 0 5.624-1.006 7.497-2.734l-3.969-2.815c-1.043.696-2.374 1.165-3.528 1.165-2.7 0-4.997-1.815-5.814-4.24H.192v2.815C2.077 17.27 5.894 19.931 10.2 19.931z" fill="#34A853"/>
              <path d="M4.386 11.307a6.063 6.063 0 01-.324-1.957c0-.68.125-1.342.313-1.957V4.578H.192a9.996 9.996 0 000 9.544l4.194-2.815z" fill="#FBBC04"/>
              <path d="M10.2 4.058c1.718 0 2.893.742 3.554 1.338l2.69-2.62C14.834.99 12.534.068 10.2.068 5.894.068 2.077 2.729.192 6.578l4.194 2.815c.806-2.425 3.103-4.335 5.814-4.335z" fill="#EA4335"/>
            </svg>
            <span className="tracking-tight">Google로 계속하기</span>
          </Button>

          {/* 구분선 */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground">또는</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* 이메일 로그인 버튼 */}
          <Button
            className={cn(
              "w-full h-11 font-semibold text-base gap-2 rounded-xl shadow-sm border-0",
              "bg-muted text-foreground hover:bg-muted/80 active:bg-muted/90",
              "transition-colors drop-shadow-[0_1px_6px_rgba(40,60,80,0.07)]"
            )}
            onClick={() => {
              // 이메일 로그인 로직 추가 예정
              console.log('이메일 로그인 클릭');
            }}
            type="button"
          >
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
              <path d="M2 0h16a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2z" fill="currentColor" opacity="0.1"/>
              <path d="M2 0h16a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm0 1a1 1 0 00-1 1v.217L10 8.217l9-6V2a1 1 0 00-1-1H2z" fill="currentColor"/>
              <path d="M19 3.383L10 9.383 1 3.383V14a1 1 0 001 1h16a1 1 0 001-1V3.383z" fill="currentColor"/>
            </svg>
            <span className="tracking-tight">이메일로 계속하기</span>
          </Button>
        </div>
        <div className="mt-6 text-sm text-muted-foreground text-center">
          <p className="font-medium text-foreground mb-1">간편하게 로그인하고 시작하세요</p>
          <p className="text-xs">
            계정이 없으신가요? 
            <span className="text-primary font-medium cursor-pointer hover:underline ml-1">
              회원가입
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

