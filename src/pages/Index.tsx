
import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Lightbulb, Users, Zap, Brain, FileText, Award, Clock, X, Cog, TrendingUp, MessageSquare, Play } from "lucide-react";

const Index = () => {
  return <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-[70px]">
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
        <section className="text-center py-0">
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

            {/* Video Card Section */}
            <div className="mb-16">
              <Card className="relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-200 p-8 text-left transform hover:translate-y-[-4px] transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] max-w-4xl mx-auto">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                      <iframe
                        width="100%"
                        height="400"
                        src="https://www.youtube.com/embed/z4HfvrPA_kI"
                        title="AI가 브라우저 자동화를 해준다고?"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg border border-gray-700">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">학생부 작성의 기초</h3>
                  <p className="text-gray-600">
                    AI가 브라우저 자동화를 통해 학생부 작성을 도와주는 혁신적인 솔루션을 경험해보세요.
                  </p>
                </CardContent>
              </Card>
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
              <Card className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-200 p-8 text-left relative transform hover:translate-y-[-4px] transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)]">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=240&fit=crop" alt="AI Robot" className="rounded-2xl w-full h-48 object-cover shadow-lg border border-gray-200" />
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg border border-gray-700">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Cutting-Edge AI</h3>
                  <p className="text-gray-600">
                    Deploy AI solutions that adapt quickly, learn fast, and scale with your business needs.
                  </p>
                </CardContent>
              </Card>

              {/* Automated Workflows - Top Right */}
              <Card className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-200 p-8 text-left relative transform hover:translate-y-[-4px] transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)]">
                <CardContent className="p-0">
                  <div className="absolute top-6 right-6 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg border border-gray-700">
                    <Cog className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Automated Workflows</h3>
                  <p className="text-gray-600 mb-8">
                    Streamline tasks and boost efficiency with powerful, scalable AI-powered automation tools for growing teams and projects.
                  </p>
                </CardContent>
              </Card>

              {/* Insightful Analytics - Bottom Left */}
              <Card className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-200 p-8 text-left relative transform hover:translate-y-[-4px] transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)]">
                <CardContent className="p-0">
                  <div className="absolute top-6 left-6 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg border border-gray-700">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-16">Insightful Analytics</h3>
                  <p className="text-gray-600">
                    Gain deep, real-time data insights with advanced AI analytics to guide smarter strategies, decisions, and scalable business growth.
                  </p>
                </CardContent>
              </Card>

              {/* AI-Powered Support - Bottom Right */}
              <Card className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-200 p-8 text-left relative transform hover:translate-y-[-4px] transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)]">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=240&fit=crop" alt="AI Assistant" className="rounded-2xl w-full h-48 object-cover shadow-lg border border-gray-200" />
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg border border-gray-700">
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
    </div>;
};

export default Index;
