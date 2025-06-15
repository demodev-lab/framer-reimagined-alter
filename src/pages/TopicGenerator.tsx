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

  const navItems = [
    {
      id: "preparation-method",
      label: "학생부 준비 방법"
    },
    {
      id: "career-sentence-generator",
      label: "진로 문장 생성기"
    },
    {
      id: "topic-generator-section",
      label: "주제 생성기"
    }
  ];

  // 진로 문장 생성기 탭 클릭 시 오직 해당 섹션이 sticky nav 바로 아래 딱 나타나도록 스크롤 및 offset 제어
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveTab(id);
    const target = document.getElementById(id);
    if (target) {
      // scrollIntoView로 먼저 맞추고, 동일 타이밍에 추가 offset 이동 → 반드시 scrollIntoView와 window.scrollBy가 중복해서 동작하지 않게 타이밍 조정
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // 진로 문장 생성기일 때만 sticky nav 높이(72px)만큼 offset (scrollIntoView가 끝나는 시점에!)
      if (id === "career-sentence-generator") {
        setTimeout(() => {
          // scrollBy에 behavior: "auto"를 명시하여 추가 스크롤이 중첩 애니메이션 없이 깔끔하게 동작
          window.scrollBy({ top: -72, behavior: "auto" });
        }, 400); // scrollIntoView animation 후(400ms) offset 이동
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
          <TopicGeneratorSection {...topicManager} />
        </section>
      </main>
    </div>
  );
};
export default TopicGenerator;
