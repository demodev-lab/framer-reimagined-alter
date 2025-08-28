import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "로그아웃 완료",
        description: "성공적으로 로그아웃되었습니다.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "로그아웃 실패",
        description: "로그아웃 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // Extract user display name
  const getUserDisplayName = () => {
    if (!user) return null;
    
    // Check for email
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName;
    }
    
    // Check for user metadata name
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    // Check for user metadata nickname (Kakao)
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }
    
    // Default fallback
    return "사용자";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const navLinks = [{
    name: "탐구 주제",
    href: "/topic-generator"
  }, {
    name: "보관함",
    href: "/archive"
  }];
  return <header className={cn("sticky top-0 z-50 w-full border-b transition-all duration-300", scrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm" : "border-transparent")}>
      <div className="container relative flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <img src="/lovable-uploads/744b8516-6dde-4b43-bd78-491dc3d18343.png" alt="학생부 분석 로고" className="w-6 h-6" />
            <span className="font-bold">탐구 연구소</span>
          </a>
        </div>
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex">
          {navLinks.map(link => <a key={link.name} href={link.href} className="text-base font-medium text-foreground hover:text-purple-600 transition-colors duration-200">
              {link.name}
            </a>)}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                {getUserDisplayName()}님
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative rounded-full w-9 h-9 border border-gray-200"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{getUserDisplayName()}님</p>
                    {user.email && (
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 rounded-md font-medium transition-colors duration-200">
              <a href="/login" className="whitespace-nowrap">
                로그인
              </a>
            </Button>
          )}
        </div>
      </div>
    </header>;
};
export default Header;
