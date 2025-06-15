
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// 심플한 사이트 로고 SVG 예시
const AppLogo = () => (
  <svg width="40" height="40" viewBox="0 0 32 32" className="mx-auto mb-6" aria-hidden>
    <circle cx="16" cy="16" r="16" fill="var(--primary)" opacity="0.14" />
    <path d="M8 16a8 8 0 1 1 16 0" stroke="var(--foreground)" strokeWidth="2.5" fill="none" />
  </svg>
);

const Login = () => {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      "bg-background/80",
      "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]",
      "from-muted/80 to-background"
    )}>
      <div className={cn(
        "relative rounded-2xl shadow-xl border border-border bg-card/90 mx-4",
        "backdrop-blur-lg flex flex-col items-center w-full max-w-sm px-7 py-10"
      )}>
        <AppLogo />
        <h1 className="text-xl font-semibold mb-8 text-center text-foreground tracking-tight">
          탐구 연구소에 오신 것을<br />환영합니다
        </h1>
        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="secondary"
            className={cn(
              "w-full h-11 font-medium text-base gap-2 shadow-sm",
              "justify-center flex items-center"
            )}
            // 실제 구글 로그인 핸들러와 연결 필요시 여기에
            type="button"
          >
            {/* Lucide 아이콘 사용: Google */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <g>
                <path d="M21.805 11.203c0-.781-.07-1.563-.211-2.313H11.2v4.387h5.93a5.046 5.046 0 01-2.15 3.313v2.75h3.467c2.03-1.905 3.212-4.713 3.212-8.137z" fill="#E8EAED"/>
                <path d="M11.201 21c2.7 0 4.97-.887 6.626-2.413l-3.467-2.748c-.963.648-2.189 1.033-3.159 1.033-2.405 0-4.44-1.624-5.164-3.799H2.427v2.844A9.808 9.808 0 0011.201 21z" fill="#34A853"/>
                <path d="M6.037 13.073A5.973 5.973 0 015.627 11c0-.716.13-1.407.357-2.073V6.083H2.427A9.827 9.827 0 001.2 11c0 1.623.396 3.17 1.227 4.917l4.61-2.844z" fill="#FBBC04"/>
                <path d="M11.201 5.5c1.482 0 2.78.51 3.814 1.512l2.856-2.856C16.169 2.775 13.899 2 11.202 2A9.803 9.803 0 002.426 6.082l4.611 2.845C6.76 7.125 8.794 5.5 11.201 5.5z" fill="#EA4335"/>
              </g>
            </svg>
            <span>Google로 계속하기</span>
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 font-medium text-base shadow-sm border border-muted"
            type="button"
          >
            이메일로 계속하기
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Login;

