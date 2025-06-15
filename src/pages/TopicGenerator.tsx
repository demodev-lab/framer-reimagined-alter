
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

  // 진로 문장 생성기 탭 클릭 시 sticky nav 아래 정확히 section 시작이 오도록 스크롤 + 충분한 offset
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveTab(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      if (id === "career-sentence-generator") {
        // sticky nav + 상단 여백만큼 offset! (예: 160px)
        setTimeout(() => {
          window.scrollBy({ top: -160, behavior: "smooth" });
        }, 400);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <StickyNav navItems={navItems} activeTab={activeTab} onNavLinkClick={handleNavLinkClick} />

        <PreparationMethodSection />

        <div className="max-w-3xl mx-auto my-6">
          <Separator />
        </div>

        {/* 진로 문장 생성기 섹션에는 외부 div나 margin 없이 section만 바로! */}
        <CareerSentenceGeneratorSection onSelectCareerSentence={setSelectedCareerSentence} />

        <div className="max-w-3xl mx-auto my-6">
          <Separator />
        </div>

        <section id="topic-generator-section" className="scroll-mt-[150px] pb-[300px]">
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
          <TopicGeneratorSection {...topicManager} />
        </section>
      </main>
    </div>
  );
};
export default TopicGenerator;
