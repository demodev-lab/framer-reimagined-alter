import React, { useState } from "react";
import { useProjectTopicManager } from "@/hooks/useProjectTopicManager";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import PreparationMethodSection from "@/components/topic-generator/PreparationMethodSection";
import ProjectTopicGeneratorSection from "@/components/topic-generator/ProjectTopicGeneratorSection";
import YouTubePopup from "@/components/topic-generator/YouTubePopup";
import CareerSentenceDialog from "@/components/topic-generator/CareerSentenceDialog";

const ProjectTopic = () => {
  const {
    selectedCareerSentence,
    setSelectedCareerSentence,
    carouselGroups,
    handleUpdateTopicsFromWebhook,
    ...topicManager
  } = useProjectTopicManager();
  const [youtubePopup, setYoutubePopup] = useState({
    open: false,
    videoId: "",
    title: ""
  });
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isGeneratingCareerSentence, setIsGeneratingCareerSentence] = useState(false);

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

  const handleRegenerateCareerSentence = () => {
    console.log("Career sentence regeneration requested");
    setShowRegenerateDialog(true);
  };

  const handleCareerSentenceGenerate = (data: {
    careerField: string;
    activity: string;
    file: File | null;
    aspiration: string;
  }) => {
    console.log("Career sentence generated:", data);
    setIsGeneratingCareerSentence(true);
    setTimeout(() => {
      const sentences = [
        `${data.careerField}이 되어 ${data.activity}을 통해 사회에 기여하고 싶습니다.`,
        `${data.careerField}으로서 ${data.activity} 분야에서 전문성을 발휘하고 싶습니다.`,
        `${data.careerField}의 꿈을 이루기 위해 ${data.activity}을 깊이 탐구하고 싶습니다.`
      ];
      setGeneratedCareerSentences(sentences);
      setIsGeneratingCareerSentence(false);
    }, 2000);
  };

  const handleSelectCareerSentence = (sentence: string) => {
    setShowRegenerateDialog(false);
    setSelectedCareerSentence(sentence);
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">프로젝트 주제 생성</h2>
            <p className="max-w-xl mx-auto text-base text-muted-foreground">진로 문장을 바탕으로 고등학교 5개 학기별 프로젝트 주제를 한번에 생성합니다.</p>
            
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

          <ProjectTopicGeneratorSection {...topicManager} carouselGroups={carouselGroups} selectedCareerSentence={selectedCareerSentence} setSelectedCareerSentence={setSelectedCareerSentence} handleUpdateTopicsFromWebhook={handleUpdateTopicsFromWebhook} />
        </section>
      </main>

      <YouTubePopup open={youtubePopup.open} onOpenChange={open => !open && handleCloseYouTubePopup()} videoId={youtubePopup.videoId} title={youtubePopup.title} />
      
      <CareerSentenceDialog 
        open={showRegenerateDialog} 
        onOpenChange={setShowRegenerateDialog} 
        generatedCareerSentences={generatedCareerSentences} 
        isGeneratingCareerSentence={isGeneratingCareerSentence} 
        onGenerate={handleCareerSentenceGenerate} 
        onSelectCareerSentence={handleSelectCareerSentence} 
      />
    </div>;
};

export default ProjectTopic;
