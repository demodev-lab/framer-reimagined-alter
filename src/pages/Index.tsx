import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Lightbulb, Users, Zap, Brain, FileText, Award, Clock } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
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
              <Card className="relative bg-white rounded-3xl shadow-lg border-0 p-8 text-left">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
                    <BarChart3 className="w-8 h-8 text-gray-600" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
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
              <Card className="relative bg-white rounded-3xl shadow-lg border-0 p-8 text-left">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
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
              <Card className="relative bg-white rounded-3xl shadow-lg border-0 p-8 text-left">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
                    <Users className="w-8 h-8 text-gray-600" />
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-black rounded-full flex items-center justify-center">
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
      </main>
    </div>;
};
export default Index;