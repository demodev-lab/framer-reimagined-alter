
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
    {
      name: "탐구 주제",
      href: "/topic-generator"
    },
    {
      name: "학생부 심폐 소생",
      href: "/feedback"
    },
    {
      name: "학생부 분석",
      href: "/record-analysis"
    }
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "border-transparent"
      )}
    >
      <div className="container relative flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z"
                fill="currentColor"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
              <path
                d="m12 21.333-9.53125-5.5-1.21875-.75v-1.166l1.21875-.75 9.53125-5.5 9.5313 5.5 1.2187 0.75v1.1666l-1.2187.75z"
                fill="currentColor"
              />
              <path
                d="m1.25 7.5 10.75 6.25 10.75-6.25"
                stroke="var(--background)"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
              <path
                d="m12 26.25v-12.5"
                stroke="var(--background)"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
            </svg>
            <span className="font-bold">탐구 연구소</span>
          </a>
        </div>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-base font-medium text-foreground transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button asChild>
            <a href="/login" className="whitespace-nowrap font-medium">
              로그인
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
