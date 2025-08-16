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
        <section className="text-center py-16 md:py-20">
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

          <div className="mt-6 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              학종 합격의 자신감을 더하는 
              <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">맞춤형 심화 탐구 주제</span>
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              더 이상 '뜬금없는' 주제는 그만.<br />
              진로와 교과를 연계한 차별화된 세특 주제를 30초 만에 경험해보세요.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-4 items-center">
            {/* 안내 텍스트 */}
            <p className="text-sm text-gray-500">✨ 회원가입 없이 즉시 체험 가능</p>
            
            {/* 메인 CTA - 30초 체험하기 */}
            <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-8 py-4 rounded-md font-bold text-lg shadow-sm hover:shadow-md transform hover:translate-y-[-2px] transition-all duration-200 relative overflow-hidden group">
              <a href="/topic-generator?demo=true" className="flex items-center justify-center gap-3">
                <span>30초 무료 체험하기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </a>
            </Button>
            
            {/* 보조 CTA - 더 작고 차분하게 */}
            <Button variant="outline" asChild className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200">
              <a href="/topic-generator">바로 시작하기 →</a>
            </Button>
          </div>
        </section>


        {/* Benefits Section */}
        <section className="text-center py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            {/* Benefits Tag */}
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border mb-6">
              <span className="text-xs text-gray-500 font-medium">⭐ 왜 탐구연구소인가?</span>
            </div>
            
            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">남들과 다른 세특, 어떻게 만들까요?</h2>
            <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">학교에서는 알려주지 않는 <strong>진로 연계 탐구주제</strong>의 비밀을 알려드립니다.</p>

            {/* Video Card Section */}
            <div className="mb-16">
              <Card className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-gray-200 p-8 text-left transform hover:translate-y-[-8px] hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)] transition-all duration-300 max-w-4xl mx-auto backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.2)] border-2 border-gray-200">
                      <iframe width="100%" height="400" src="https://www.youtube.com/embed/rPgKtFX0ToI" title="학생부 작성의 기초" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full" />
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.3)] border-2 border-gray-700">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">학생부 작성의 기초</h3>
                  <p className="text-gray-600">
                    학생부를 제대로 준비하는 방법은 명확히 존재합니다. 영상에서 함께 확인하시죠.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* All features in 1 tool section */}
        <section className="bg-white rounded-3xl py-16 md:py-20">
          <div className="max-w-6xl mx-auto text-center px-8">
            {/* Features Tag */}
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <span className="text-sm text-gray-600 font-medium">⚙️ FEATURES</span>
            </div>
            
            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">제대로 준비하는 학생부</h2>
            <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">탐구 연구소는 높은 수준의 학생부를 만드는 데 집중합니다 </p>

            {/* New Grid Layout - Matching second image */}
            <div className="mb-16">
              {/* First Row - 2 cards with images on left, text on right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Card 1 */}
                <Card className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 text-left transform hover:translate-y-[-4px] transition-all duration-300">
                  <CardContent className="p-0 flex items-center gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img alt="AI Robot" className="rounded-2xl w-full h-full object-cover" src="/lovable-uploads/4fd7f4e2-be60-4040-ac03-b07c3175b2c7.jpg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">학생부의 정석적인 준비</h3>
                        
                      </div>
                      <p className="text-gray-600 text-sm">더 이상 '~카더라'하는 식의 소문이 아닌 자신의 진로와 연계된 체계적인 탐구 활동으로 학생부를 준비하세요</p>
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
                        <h3 className="text-xl font-bold text-gray-900">맞춤형 탐구 주제 생성</h3>
                        
                      </div>
                      <p className="text-gray-600 text-sm">뜬금 없는 탐구 주제가 아닌, 
진로와 교과 과목을 연계한 개인화된 탐구 주제를 구성합니다.</p>
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
                        
                      </div>
                      <p className="text-gray-600 text-sm">주제가 어려워보인다고, 포기하는 것은 더 이상 용납되지 않습니다. </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 4 */}
                <Card className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 text-left transform hover:translate-y-[-4px] transition-all duration-300">
                  <CardContent className="p-0 flex items-center gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img alt="Lock" className="rounded-2xl w-full h-full object-cover" src="/lovable-uploads/b993bcfa-a030-4c19-b06f-e8fc399b50c1.jpg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">Lock 기능으로 나만의 주제를</h3>
                        
                      </div>
                      <p className="text-gray-600 text-sm">Lock 기능으로 주제를 잠그면, 더 이상 같은 주제가 나오지 않습니다. 학생부 중복률을 낮추기 위해 적극적으로 활용해보세요!</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 justify-center items-center">
              <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 px-6 py-3 rounded-md font-semibold text-base shadow-sm hover:shadow-md transform hover:translate-y-[-2px] transition-all duration-200">
                <a href="/topic-generator?demo=true">지금 30초 체험해보기 🚀</a>
              </Button>
              <p className="text-sm text-gray-500">체험 후 마음에 들면 회원가입하세요!</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
