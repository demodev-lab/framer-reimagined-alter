import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Lightbulb, Users, Zap, Brain, FileText, Award, Clock, X, Cog, TrendingUp, MessageSquare, Play } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-[70px]">
          {/* Logo and Title Section */}
          <div className="flex flex-col items-center justify-center gap-6 mb-6">
            <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center shadow-lg">
              <svg fill="white" height="22" viewBox="0 0 24 24" width="22" xmlns="http://www.w3.org/2000/svg">
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
            <Button asChild className="bg-gradient-to-b from-black to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 px-8 py-3 rounded-lg font-medium text-base shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] transform hover:translate-y-[-2px] transition-all duration-200 border border-gray-700 min-w-[140px]">
              <a href="/topic-generator">심화 세특 주제 만들기</a>
            </Button>
            <Button variant="outline" asChild className="bg-gradient-to-b from-white to-gray-50 border-2 border-gray-300 text-gray-700 hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 hover:text-gray-900 px-8 py-3 rounded-lg font-medium text-base shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transform hover:translate-y-[-2px] transition-all duration-200 min-w-[140px]">
              <a href="/feedback">학생부 심폐 소생</a>
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
              <Card className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-gray-200 p-8 text-left transform hover:translate-y-[-8px] hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)] transition-all duration-300 max-w-4xl mx-auto backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.2)] border-2 border-gray-200">
                      <iframe width="100%" height="400" src="https://www.youtube.com/embed/z4HfvrPA_kI" title="AI가 브라우저 자동화를 해준다고?" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full" />
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.3)] border-2 border-gray-700">
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

        {/* All features in 1 tool section */}
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

            {/* New Grid Layout - Matching second image */}
            <div className="mb-16">
              {/* First Row - 2 cards with images on left, text on right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Card 1 */}
                <Card className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 text-left transform hover:translate-y-[-4px] transition-all duration-300">
                  <CardContent className="p-0 flex items-center gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=128&h=128&fit=crop" alt="AI Robot" className="rounded-2xl w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">학생부의 정석적인 준비</h3>
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center ml-4">
                          <X className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">더 이상 '~카더라'하는 식의 소문이 아닌 자신을 제대로 어필할 수 있는 활동이 담긴 학생부를 준비하세요</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2 */}
                <Card className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 text-left transform hover:translate-y-[-4px] transition-all duration-300">
                  <CardContent className="p-0 flex items-center gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=128&h=128&fit=crop" alt="AI Assistant" className="rounded-2xl w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">최신 연구 기반 탐구 주제 생성</h3>
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center ml-4">
                          <Cog className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Streamline tasks and boost efficiency with powerful, scalable AI-powered automation tools for growing teams and projects.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Second Row - 2 cards with images on left, text on right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card 3 */}
                <Card className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 text-left transform hover:translate-y-[-4px] transition-all duration-300">
                  <CardContent className="p-0 flex items-center gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop" alt="Analytics" className="rounded-2xl w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">탐구 방법까지 한번에</h3>
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center ml-4">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Gain deep, real-time data insights with advanced AI analytics to guide smarter strategies, decisions, and scalable business growth.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 4 */}
                <Card className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 text-left transform hover:translate-y-[-4px] transition-all duration-300">
                  <CardContent className="p-0 flex items-center gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=128&h=128&fit=crop" alt="AI Support" className="rounded-2xl w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">Lock 기능으로 나만의 주제를</h3>
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center ml-4">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Enhance customer experience with AI-driven virtual assistants available for support and engagement.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-b from-black to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 px-8 py-3 rounded-lg font-medium text-base shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] transform hover:translate-y-[-2px] transition-all duration-200 border border-gray-700">
                Get Started →
              </Button>
              <Button variant="outline" className="bg-gradient-to-b from-white to-gray-50 border-2 border-gray-300 text-gray-700 hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 px-8 py-3 rounded-lg font-medium text-base shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transform hover:translate-y-[-2px] transition-all duration-200">
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
