import React, { useState } from "react";
import { useTopicManager } from "@/hooks/useTopicManager";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
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
  const [youtubePopup, setYoutubePopup] = useState({
    open: false,
    videoId: "",
    title: ""
  });

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

  return <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <section className="text-center py-10 md:py-0">
          {/* Logo and Title Section */}
          
        </section>

        <PreparationMethodSection />

        <div className="max-w-3xl mx-auto my-6">
          
        </div>

        <section id="topic-generator-section" className="scroll-mt-[150px] pb-96">
          <div className="text-center mb-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">탐구 주제 생성</h2>
            <p className="max-w-xl mx-auto text-base text-muted-foreground">최신 논문 연구, 진로 문장, 교과 개념을 바탕으로 심화 탐구 주제를 생성합니다.</p>
            
            {/* YouTube 버튼들 - 중앙 정렬 및 동일한 너비 적용 */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button onClick={() => handleOpenYouTubePopup("z4HfvrPA_kI", "어떻게 사용하나요?")} className="bg-black text-white hover:bg-gray-800 px-6 py-2 w-40">
                어떻게 사용하나요?
              </Button>
              <Button onClick={() => handleOpenYouTubePopup("-Orv-jTXkSs", "학생부 준비 방법")} className="bg-black text-white hover:bg-gray-800 px-6 py-2 w-40">
                학생부 준비 방법
              </Button>
            </div>
          </div>
          <TopicGeneratorSection {...topicManager} carouselGroups={carouselGroups} selectedCareerSentence={selectedCareerSentence} setSelectedCareerSentence={setSelectedCareerSentence} />
        </section>
      </main>

      <YouTubePopup open={youtubePopup.open} onOpenChange={open => !open && handleCloseYouTubePopup()} videoId={youtubePopup.videoId} title={youtubePopup.title} />
    </div>;
};

export default TopicGenerator;
