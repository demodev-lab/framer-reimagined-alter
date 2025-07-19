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
    title: "",
  });
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<
    string[]
  >([]);
  const [isGeneratingCareerSentence, setIsGeneratingCareerSentence] =
    useState(false);

  const handleOpenYouTubePopup = (videoId: string, title: string) => {
    setYoutubePopup({
      open: true,
      videoId,
      title,
    });
  };

  const handleCloseYouTubePopup = () => {
    setYoutubePopup({
      open: false,
      videoId: "",
      title: "",
    });
  };

  const handleRegenerateCareerSentence = () => {
    console.log("Career sentence regeneration requested");
    setShowRegenerateDialog(true);
  };

  const handleCareerSentenceGenerate = async (data: {
    careerField: string;
    activity: string;
    file: File | null;
    aspiration: string;
  }) => {
    console.log("Career sentence generated:", data);
    setIsGeneratingCareerSentence(true);
    setGeneratedCareerSentences([]);

    try {
      const webhookData = {
        careerField: data.careerField,
        request: data.activity,
        aspiration:
          data.activity === "직업을 가진 후 하고 싶은 것이 있습니다."
            ? data.aspiration
            : null,
      };

      const baseURL = import.meta.env.DEV ? '' : 'https://songssam.demodev.io';
      const response = await fetch(
        `${baseURL}/webhook/request?path=dream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          body: JSON.stringify(webhookData),
          keepalive: true, // 무제한 대기 설정
          mode: "cors",
          redirect: "follow",
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        if (
          Array.isArray(responseData) &&
          responseData.length > 0 &&
          responseData[0].진로_문장
        ) {
          setGeneratedCareerSentences([responseData[0].진로_문장]);
        } else {
          setGeneratedCareerSentences([
            "오류가 발생했습니다. 다시 시도해주세요.",
          ]);
        }
      } else {
        setGeneratedCareerSentences([
          "오류가 발생했습니다. 다시 시도해주세요.",
        ]);
      }
    } catch (error) {
      console.error("Webhook 호출 실패:", error);
      setGeneratedCareerSentences(["오류가 발생했습니다. 다시 시도해주세요."]);
    }

    setIsGeneratingCareerSentence(false);
  };

  const handleSelectCareerSentence = (sentence: string) => {
    setShowRegenerateDialog(false);
    setSelectedCareerSentence(sentence);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <section className="text-center py-10 md:py-0">
          {/* Logo and Title Section */}
        </section>

        <PreparationMethodSection />

        <div className="max-w-3xl mx-auto my-6"></div>

        <section
          id="topic-generator-section"
          className="scroll-mt-[150px] pb-96"
        >
          <div className="text-center mb-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
              프로젝트 주제 생성
            </h2>
            <p className="max-w-xl mx-auto text-base text-muted-foreground">
              진로 문장을 바탕으로 고등학교 5개 학기별 프로젝트 주제를 한번에
              생성합니다.
            </p>

            {/* YouTube 버튼들 - 중앙 정렬 및 동일한 너비 적용 */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                onClick={() =>
                  handleOpenYouTubePopup("z4HfvrPA_kI", "어떻게 사용하나요?")
                }
                className="bg-black text-white hover:bg-gray-800 px-6 py-2 w-40"
              >
                어떻게 사용하나요?
              </Button>
              <Button
                onClick={() =>
                  handleOpenYouTubePopup("-Orv-jTXkSs", "학생부 준비 방법")
                }
                className="bg-black text-white hover:bg-gray-800 px-6 py-2 w-40"
              >
                학생부 준비 방법
              </Button>
            </div>
          </div>

          <ProjectTopicGeneratorSection
            {...topicManager}
            carouselGroups={carouselGroups}
            selectedCareerSentence={selectedCareerSentence}
            setSelectedCareerSentence={setSelectedCareerSentence}
            handleUpdateTopicsFromWebhook={handleUpdateTopicsFromWebhook}
          />
        </section>
      </main>

      <YouTubePopup
        open={youtubePopup.open}
        onOpenChange={(open) => !open && handleCloseYouTubePopup()}
        videoId={youtubePopup.videoId}
        title={youtubePopup.title}
      />

      <CareerSentenceDialog
        open={showRegenerateDialog}
        onOpenChange={setShowRegenerateDialog}
        generatedCareerSentences={generatedCareerSentences}
        isGeneratingCareerSentence={isGeneratingCareerSentence}
        onGenerate={handleCareerSentenceGenerate}
        onSelectCareerSentence={handleSelectCareerSentence}
      />
    </div>
  );
};

export default ProjectTopic;
