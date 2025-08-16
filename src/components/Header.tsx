import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
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
        <div className="flex items-center gap-1">
          <Button asChild className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 rounded-md font-medium transition-colors duration-200">
            <a href="/login" className="whitespace-nowrap">
              로그인
            </a>
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;
