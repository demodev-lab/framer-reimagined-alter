
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const navLinks = [
    { name: '탐구 주제 만들기', href: '#topic-generator' },
    { name: '학생부 준비 방법', href: '#how-to-prepare' },
    { name: '빠른 피드백 받기', href: '#feedback' },
  ];
  return <header className={cn("sticky top-0 z-50 w-full border-b transition-all duration-300", scrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm" : "border-transparent")}>
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M4 0C1.79086 0 0 1.79086 0 4V20C0 22.2091 1.79086 24 4 24H20C22.2091 24 24 22.2091 24 20V4C24 1.79086 22.2091 0 20 0H4ZM6 6V18H18V6H6Z" />
            </svg>
            <span className="font-bold">Cuadro</span>
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => <a key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link.name}
            </a>)}
        </nav>
        <div className="flex items-center">
          <Button>로그인</Button>
        </div>
      </div>
    </header>;
};
export default Header;
