
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

  const navLinks = [
    { name: "Product", href: "#" },
    { name: "Solutions", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Docs", href: "#" }
  ];

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg fill="white" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                <path d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z" fill="white" stroke="white" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">OrbAI</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
