
import React, { useEffect, useState } from "react";
import { useTopicManager } from "@/hooks/useTopicManager";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import StickyNav from "@/components/topic-generator/StickyNav";
import PreparationMethodSection from "@/components/topic-generator/PreparationMethodSection";
import CareerSentenceGeneratorSection from "@/components/topic-generator/CareerSentenceGeneratorSection";
import TopicGeneratorSection from "@/components/topic-generator/TopicGeneratorSection";

const TopicGenerator = () => {
  const { selectedCareerSentence, setSelectedCareerSentence, ...topicManager } = useTopicManager();
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
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <StickyNav navItems={navItems} activeTab={activeTab} onNavLinkClick={handleNavLinkClick} />
        <PreparationMethodSection />
        <div className="max-w-3xl mx-auto my-12">
          <Separator />
        </div>
        <CareerSentenceGeneratorSection onSelectCareerSentence={setSelectedCareerSentence} />
        
        <div className="max-w-3xl mx-auto my-12">
          <Separator />
        </div>

        <section id="topic-generator-section" className="scroll-mt-[150px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">주제 생성기</h2>
            <p className="mt-3 max-w-xl mx-auto text-lg text-muted-foreground">
                관심 분야와 교과 개념을 연결하여 깊이 있는 탐구 주제를 생성합니다.
            </p>
          </div>
          {selectedCareerSentence && <div className="w-full max-w-4xl mx-auto mb-8">
              <div className="p-4 border rounded-lg bg-muted">
                <p className="font-semibold text-center text-muted-foreground mb-2">진로 문장</p>
                <p className="text-center text-foreground">{selectedCareerSentence}</p>
              </div>
            </div>}
          <TopicGeneratorSection {...topicManager} />
        </section>
      </main>
    </div>;
};

export default TopicGenerator;
