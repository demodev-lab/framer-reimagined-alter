
import React from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navLinks = [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Changelog', href: '/' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z" fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="m12 21.333-9.53125-5.5-1.21875-.75v-1.166l1.21875-.75 9.53125-5.5 9.5313 5.5 1.2187 0.75v1.1666l-1.2187.75z" fill="currentColor"></path><path d="m1.25 7.5 10.75 6.25 10.75-6.25" stroke="var(--background)" stroke-linejoin="round" stroke-width="1.5"></path><path d="m12 26.25v-12.5" stroke="var(--background)" stroke-linejoin="round" stroke-width="1.5"></path></svg>
            <span className="font-bold">Alter</span>
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center">
          <Button>Get Template</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
