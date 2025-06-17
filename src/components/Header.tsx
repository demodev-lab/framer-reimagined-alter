
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    {
      name: "탐구 주제",
      href: "/topic-generator"
    },
    {
      name: "빠른 피드백",
      href: "/feedback"
    }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled 
          ? "bg-slate-900/80 backdrop-blur-lg border-b border-white/10 shadow-2xl shadow-purple-500/10" 
          : "border-transparent"
      )}
    >
      <div className="container relative flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-3 text-xl font-bold text-white hover:text-purple-300 transition-colors duration-300 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg fill="white" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z" fill="white" stroke="white" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              탐구 연구소
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-base font-medium text-gray-300 hover:text-white transition-all duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            asChild
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <a href="/login">
              로그인
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:text-purple-300 transition-colors duration-300"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-lg border-b border-white/10 transition-all duration-300",
        mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <div className="px-4 py-6 space-y-4">
          {navLinks.map(link => (
            <a 
              key={link.name}
              href={link.href}
              className="block text-lg font-medium text-gray-300 hover:text-white transition-colors duration-300 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button 
            asChild
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 mt-4"
          >
            <a href="/login">
              로그인
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
