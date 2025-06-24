
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

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
  // 뒤로가기: 히스토리가 있으면 뒤로, 아니면 /
  const handleBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
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
          {/* 구글 로그인 버튼 */}
          <Button
            className={cn(
              // 기본 스타일 제거: 색상 및 폰트 강조
              "w-full h-11 font-semibold text-base gap-2 rounded-xl shadow-sm border-0",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/80 active:bg-primary/90 transition-colors",
              "drop-shadow-[0_2px_8px_rgba(40,60,220,0.08)]",
            )}
            disabled
            type="button"
            style={{
              // 배경 primary 계열 색상, disabled 시도 자연스럽게
              background:
                "linear-gradient(90deg, hsl(var(--primary)) 94%, hsl(var(--primary)/.98) 100%)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <g>
                <path d="M21.805 11.203c0-.781-.07-1.563-.211-2.313H11.2v4.387h5.93a5.046 5.046 0 01-2.15 3.313v2.75h3.467c2.03-1.905 3.212-4.713 3.212-8.137z" fill="#E8EAED"/>
                <path d="M11.201 21c2.7 0 4.97-.887 6.626-2.413l-3.467-2.748c-.963.648-2.189 1.033-3.159 1.033-2.405 0-4.44-1.624-5.164-3.799H2.427v2.844A9.808 9.808 0 0011.201 21z" fill="#34A853"/>
                <path d="M6.037 13.073A5.973 5.973 0 015.627 11c0-.716.13-1.407.357-2.073V6.083H2.427A9.827 9.827 0 001.2 11c0 1.623.396 3.17 1.227 4.917l4.61-2.844z" fill="#FBBC04"/>
                <path d="M11.201 5.5c1.482 0 2.78.51 3.814 1.512l2.856-2.856C16.169 2.775 13.899 2 11.202 2A9.803 9.803 0 002.426 6.082l4.611 2.845C6.76 7.125 8.794 5.5 11.201 5.5z" fill="#EA4335"/>
              </g>
            </svg>
            <span className="tracking-tight">Google로 계속하기</span>
          </Button>
          {/* 이메일 로그인 버튼 */}
          <Button
            className={cn(
              "w-full h-11 font-semibold text-base gap-2 rounded-xl shadow-sm border-0",
              // 중간톤의 깔끔한 배경, 텍스트 강조
              "bg-muted text-foreground/80 hover:bg-muted/70 active:bg-muted/80",
              "transition-colors",
              "drop-shadow-[0_1px_6px_rgba(40,60,80,0.07)]"
            )}
            disabled
            type="button"
          >
            <span className="tracking-tight">이메일로 계속하기</span>
          </Button>
        </div>
        <div className="mt-6 text-sm text-muted-foreground text-center">
          <span className="font-medium text-foreground">로그인 기능은 Supabase 연동 후 제공됩니다.</span><br/>
          (기능이 필요한 경우 우측 상단의 Supabase 버튼을 눌러 연동해주세요)
        </div>
      </div>
    </div>
  );
};

export default Login;

