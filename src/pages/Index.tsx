
import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Lightbulb, Users, Zap, Brain, FileText, Award, Clock, X, Cog, TrendingUp, MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-32">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border mb-8">
            <span className="text-sm text-gray-600 font-medium">📚 학생부 관리 솔루션</span>
          </div>

          {/* Logo and Title Section */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg">
              <svg fill="white" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
                <path d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z" fill="white" stroke="white" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
              탐구 연구소
            </h1>
          </div>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 font-medium">
            체계적인 학생부 관리를 위한 맞춤형 솔루션
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-medium text-base">
              <a href="/topic-generator">탐구 주제 생성</a>
            </Button>
            <Button variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium text-base">
              <a href="/feedback">빠른 피드백</a>
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Benefits Tag */}
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border mb-6">
              <span className="text-xs text-gray-500 font-medium">⭐ BENEFITS</span>
            </div>
            
            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
              AI 기반 학생부 관리 솔루션으로 스마트한 교육을 제공합니다.
            </p>

            {/* Main Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Real-Time Analytics */}
              <Card className="relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 p-8 text-left transform hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative shadow-inner">
                    <BarChart3 className="w-8 h-8 text-gray-600" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 분석</h3>
                  <p className="text-gray-600">
                    정확하고 실시간으로 학생부 성과를 추적하고 분석하여 앞서 나가세요.
                  </p>
                </CardContent>
              </Card>

              {/* AI-Driven Growth */}
              <Card className="relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 p-8 text-left transform hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative shadow-inner">
                    <Brain className="w-8 h-8 text-gray-600" />
                    <div className="absolute -top-2 -right-8 text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded-full shadow-sm rotate-12">
                      AFTER
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI 기반 성장</h3>
                  <p className="text-gray-600">
                    정확하고 실시간 교육 인사이트로 더 스마트한 결정을 내리세요.
                  </p>
                </CardContent>
              </Card>

              {/* Sync in real time */}
              <Card className="relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 p-8 text-left transform hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative shadow-inner">
                    <Users className="w-8 h-8 text-gray-600" />
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 동기화</h3>
                  <p className="text-gray-600">
                    팀과 즉시 연결하여 진행 상황을 추적하고 업데이트하세요.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">데이터 기반 결정</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                <Lightbulb className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">빠른 혁신</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                <Award className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">가상 지원</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">확장 가능한 솔루션</span>
              </div>
            </div>
          </div>
        </section>

        {/* All Features in 1 Tool Section - Updated Layout */}
        <section className="py-20 bg-white rounded-3xl">
          <div className="max-w-6xl mx-auto text-center px-8">
            {/* Features Tag */}
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <span className="text-sm text-gray-600 font-medium">⚙️ FEATURES</span>
            </div>
            
            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All features in 1 tool
            </h2>
            <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
              Discover features that simplify workflows & grow your business.
            </p>

            {/* 2x2 Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {/* Cutting-Edge AI - Top Left */}
              <Card className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 p-8 text-left relative transform hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=240&fit=crop" 
                      alt="AI Robot" 
                      className="rounded-2xl w-full h-48 object-cover shadow-lg"
                    />
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Cutting-Edge AI</h3>
                  <p className="text-gray-600">
                    Deploy AI solutions that adapt quickly, learn fast, and scale with your business needs.
                  </p>
                </CardContent>
              </Card>

              {/* Automated Workflows - Top Right */}
              <Card className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 p-8 text-left relative transform hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="p-0">
                  <div className="absolute top-6 right-6 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                    <Cog className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Automated Workflows</h3>
                  <p className="text-gray-600 mb-8">
                    Streamline tasks and boost efficiency with powerful, scalable AI-powered automation tools for growing teams and projects.
                  </p>
                </CardContent>
              </Card>

              {/* Insightful Analytics - Bottom Left */}
              <Card className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 p-8 text-left relative transform hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="p-0">
                  <div className="absolute top-6 left-6 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-16">Insightful Analytics</h3>
                  <p className="text-gray-600">
                    Gain deep, real-time data insights with advanced AI analytics to guide smarter strategies, decisions, and scalable business growth.
                  </p>
                </CardContent>
              </Card>

              {/* AI-Powered Support - Bottom Right */}
              <Card className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 p-8 text-left relative transform hover:translate-y-[-4px] transition-all duration-300">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <img 
                      src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=240&fit=crop" 
                      alt="AI Assistant" 
                      className="rounded-2xl w-full h-48 object-cover shadow-lg"
                    />
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Support</h3>
                  <p className="text-gray-600">
                    Enhance customer experience with AI-driven virtual assistants available for support and engagement.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-medium text-base">
                Get Started →
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium text-base">
                See Our Services
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
