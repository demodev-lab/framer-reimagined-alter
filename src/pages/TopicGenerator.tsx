
import React, { useEffect, useState } from "react";
import { useTopicManager } from "@/hooks/useTopicManager";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import StickyNav from "@/components/topic-generator/StickyNav";
import PreparationMethodSection from "@/components/topic-generator/PreparationMethodSection";
import CareerSentenceGeneratorSection from "@/components/topic-generator/CareerSentenceGeneratorSection";
import TopicGeneratorSection from "@/components/topic-generator/TopicGeneratorSection";

const TopicGenerator = () => {
  const {
    selectedCareerSentence,
    setSelectedCareerSentence,
    ...topicManager
  } = useTopicManager();
  const [activeTab, setActiveTab] = useState("preparation-method");

  useEffect(() => {
    const sections = ["preparation-method", "career-sentence-generator", "topic-generator-section"];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, {
      rootMargin: "-150px 0px -50% 0px"
    });
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const navItems = [{
    id: "preparation-method",
    label: "학생부 준비 방법"
  }, {
    id: "career-sentence-generator",
    label: "진로 문장 생성기"
  }, {
    id: "topic-generator-section",
    label: "주제 생성기"
  }];

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveTab(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <StickyNav navItems={navItems} activeTab={activeTab} onNavLinkClick={handleNavLinkClick} />

        <section className="text-center py-20 md:py-0">
          {/* Tag - Hidden */}
          <div className="hidden inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border mb-8">
            <span className="text-sm text-gray-600 font-medium">📚 학생부 관리 솔루션</span>
          </div>

          {/* Logo and Title Section */}
          <div className="flex flex-col items-center justify-center gap-6 mb-6">
            <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center shadow-lg">
              <svg fill="white" height="22" viewBox="0 0 24 24" width="22" xmlns="http://www.w3.org/2000/svg">
                <path d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z" fill="white" stroke="white" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </section>

        <PreparationMethodSection />

        <div className="max-w-3xl mx-auto my-6">
          <Separator />
        </div>

        {/* 진로 문장 생성기 섹션에는 외부 div나 margin 없이 section만 바로! */}
        <CareerSentenceGeneratorSection onSelectCareerSentence={setSelectedCareerSentence} />

        <div className="max-w-3xl mx-auto my-6">
          <Separator />
        </div>

        <section id="topic-generator-section" className="scroll-mt-[150px] pb-96">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">주제 생성기</h2>
            <p className="mt-3 max-w-xl mx-auto text-base text-muted-foreground">최신 논문 연구, 진로 문장, 교과 개념을 바탕으로 심화 탐구 주제를 생성합니다.</p>
          </div>
          {selectedCareerSentence && <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="p-4 border rounded-lg bg-muted">
              <p className="font-semibold text-center text-muted-foreground mb-2">진로 문장</p>
              <p className="text-center text-foreground">{selectedCareerSentence}</p>
            </div>
          </div>}
          <TopicGeneratorSection {...topicManager} selectedCareerSentence={selectedCareerSentence} />
        </section>
      </main>
    </div>;
};

export default TopicGenerator;
