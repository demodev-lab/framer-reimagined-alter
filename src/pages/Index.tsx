import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
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
          <div className="max-w-4xl mx-auto">
            
            
          </div>
        </section>
      </main>
    </div>;
};
export default Index;