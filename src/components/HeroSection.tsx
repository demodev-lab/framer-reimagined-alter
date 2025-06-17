
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating Elements */}
      <div 
        className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{
          left: mousePosition.x * 0.01 + 'px',
          top: mousePosition.y * 0.01 + 'px',
        }}
      ></div>
      <div 
        className="absolute w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"
        style={{
          right: (window.innerWidth - mousePosition.x) * 0.01 + 'px',
          bottom: (window.innerHeight - mousePosition.y) * 0.01 + 'px',
        }}
      ></div>

      <div className="max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">AI 기반 학생부 관리 솔루션</span>
        </div>

        {/* Main Title */}
        <h1 className={`text-6xl md:text-8xl font-bold mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            탐구 연구소
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          AI와 함께하는 스마트한 학생부 관리
          <br />
          <span className="text-purple-400">체계적이고 효율적인</span> 교육 솔루션
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group"
          >
            <a href="/topic-generator" className="flex items-center gap-3">
              탐구 주제 생성하기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            size="lg"
            className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm group"
          >
            <a href="/feedback" className="flex items-center gap-3">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              빠른 피드백
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-3 gap-8 max-w-md mx-auto transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">1000+</div>
            <div className="text-sm text-gray-400">활성 사용자</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-sm text-gray-400">만족도</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-sm text-gray-400">AI 지원</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
