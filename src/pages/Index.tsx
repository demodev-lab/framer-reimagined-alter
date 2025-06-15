
import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-16 md:py-[53px]">
          <span className="inline-block bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium mb-4">
            송쌤
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            학생부 제대로 준비하기
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            여러분의 학생부는 절대 '중구난방'이 되어서는 안됩니다.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="/topic-generator">탐구 주제</a>
            </Button>
            <Button variant="outline" asChild size="lg">
              <a href="/feedback">빠른 피드백</a>
            </Button>
          </div>
        </section>

        <section className="py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            체계적인 학생부 관리
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            효과적인 탐구 주제 생성부터 전문적인 피드백까지, 학생부 작성의 모든
            과정을 지원합니다.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Index;
