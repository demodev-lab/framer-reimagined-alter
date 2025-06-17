
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Users, 
  BookOpen, 
  Target, 
  CheckCircle, 
  TrendingUp,
  Star,
  MessageSquare,
  Award,
  Brain
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import FeatureGrid from "@/components/FeatureGrid";
import StatsSection from "@/components/StatsSection";
import TestimonialSection from "@/components/TestimonialSection";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Header />
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <main className="relative z-10">
        <HeroSection />
        <FeatureGrid />
        <StatsSection />
        <TestimonialSection />
        
        {/* CTA Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                지금 시작하세요
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                AI 기반 학생부 관리로 더 스마트한 교육 경험을 만들어보세요
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                >
                  <a href="/topic-generator" className="flex items-center gap-2">
                    탐구 주제 생성하기
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  size="lg"
                  className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  <a href="/feedback">빠른 피드백 받기</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
