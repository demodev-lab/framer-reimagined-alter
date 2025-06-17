import React, { useEffect, useState } from "react";
import { useTopicManager } from "@/hooks/useTopicManager";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import StickyNav from "@/components/topic-generator/StickyNav";
import PreparationMethodSection from "@/components/topic-generator/PreparationMethodSection";
import TopicGeneratorSection from "@/components/topic-generator/TopicGeneratorSection";
import YouTubePopup from "@/components/topic-generator/YouTubePopup";

const TopicGenerator = () => {
  const {
    selectedCareerSentence,
    setSelectedCareerSentence,
    carouselGroups,
    ...topicManager
  } = useTopicManager();
  const [activeTab, setActiveTab] = useState("preparation-method");
  const [youtubePopup, setYoutubePopup] = useState({
    open: false,
    videoId: "",
    title: ""
  });

  useEffect(() => {
    const sections = ["preparation-method", "topic-generator-section"];
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

  const handleOpenYouTubePopup = (videoId: string, title: string) => {
    setYoutubePopup({
      open: true,
      videoId,
      title
    });
  };

  const handleCloseYouTubePopup = () => {
    setYoutubePopup({
      open: false,
      videoId: "",
      title: ""
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <StickyNav navItems={navItems} activeTab={activeTab} onNavLinkClick={handleNavLinkClick} />

        <section className="text-center py-20 md:py-0">
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

        <section id="topic-generator-section" className="scroll-mt-[150px] pb-96">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">탐구 주제 생성</h2>
            <p className="mt-3 max-w-xl mx-auto text-base text-muted-foreground">최신 논문 연구, 진로 문장, 교과 개념을 바탕으로 심화 탐구 주제를 생성합니다.</p>
            
            {/* YouTube 버튼들 - 중앙 정렬 및 검은색 배경으로 스타일 변경 */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                onClick={() => handleOpenYouTubePopup("z4HfvrPA_kI", "어떻게 사용하나요?")}
                className="bg-black text-white hover:bg-gray-800 px-6 py-2"
              >
                어떻게 사용하나요?
              </Button>
              <Button
                onClick={() => handleOpenYouTubePopup("-Orv-jTXkSs", "학생부 준비 방법")}
                className="bg-black text-white hover:bg-gray-800 px-6 py-2"
              >
                학생부 준비 방법
              </Button>
            </div>
          </div>
          <TopicGeneratorSection {...topicManager} carouselGroups={carouselGroups} selectedCareerSentence={selectedCareerSentence} setSelectedCareerSentence={setSelectedCareerSentence} />
        </section>
      </main>

      <YouTubePopup
        open={youtubePopup.open}
        onOpenChange={(open) => !open && handleCloseYouTubePopup()}
        videoId={youtubePopup.videoId}
        title={youtubePopup.title}
      />
    </div>
  );
};

export default TopicGenerator;
