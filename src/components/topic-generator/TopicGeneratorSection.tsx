import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive } from "lucide-react";
import { TopicRow } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CareerSentenceSection from "./CareerSentenceSection";
import CareerSentenceDialog from "./CareerSentenceDialog";
import TopicCarousel from "./TopicCarousel";
import { n8nPollingClient } from "@/utils/n8nPollingClient";
import { useRef } from "react";

interface CarouselGroup {
  id: number;
  topicRows: TopicRow[];
}

interface TopicGeneratorSectionProps {
  topicRows: TopicRow[];
  carouselGroups: CarouselGroup[];
  followUpStates: Record<number, boolean>;
  handleAddRow: () => void;
  handleAddFollowUpRow: (groupId: number) => void;
  handleGenerate: (
    id: number,
    inputs: {
      subject: string;
      concept: string;
      topicType: string;
    }
  ) => void;
  handleSelectTopic: (id: number, topic: string) => void;
  handleRefreshTopic: (id: number) => void;
  handleLockTopic: (id: number) => void;
  handleDeleteTopic: (id: number) => void;
  handleRegenerateMethods: (id: number) => void;
  handleUpdateResearchMethods?: (id: number, methods: string[]) => void;
  handleTopicTypeChange: (id: number, type: string) => void;
  handleShowResearchMethods?: (id: number) => void;
  handleFollowUpChange: (id: number, checked: boolean) => void;
  selectedCareerSentence?: string | null;
  setSelectedCareerSentence: (sentence: string) => void;
}

const TopicGeneratorSection: React.FC<TopicGeneratorSectionProps> = ({
  carouselGroups,
  handleAddRow,
  handleAddFollowUpRow,
  handleGenerate,
  handleSelectTopic,
  handleRefreshTopic,
  handleLockTopic,
  handleDeleteTopic,
  handleRegenerateMethods,
  handleUpdateResearchMethods,
  handleTopicTypeChange,
  handleShowResearchMethods,
  followUpStates,
  handleFollowUpChange,
  selectedCareerSentence,
  setSelectedCareerSentence,
}) => {
  const navigate = useNavigate();
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<
    string[]
  >([]);
  const [isGeneratingCareerSentence, setIsGeneratingCareerSentence] =
    useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

    // 이전 요청이 진행 중이면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();

    try {
      const webhookData = {
        careerField: data.careerField,
        request: data.activity,
        aspiration:
          data.activity === "직업을 가진 후 하고 싶은 것이 있습니다."
            ? data.aspiration
            : null,
      };

      console.log('🚀 진로 문장 생성 요청 시작 (비동기 폴링)...');
      
      const response = await n8nPollingClient.requestCareerSentence(
        webhookData,
        abortControllerRef.current.signal
      );
      
      if (response.success && response.data) {
        console.log('✅ 진로 문장 생성 완료');
        console.log('🎯 최종 결과:', response.data);
        
        setGeneratedCareerSentences([response.data]);
      } else {
        console.error('❌ 진로 문장 생성 실패:', response.error);
        
        let errorMessage = response.error || '진로 문장 생성에 실패했습니다.';
        if (response.status === 'timeout') {
          errorMessage = '응답 시간이 초과되었습니다. 다시 시도해주세요.';
        } else if (response.status === 'cancelled') {
          errorMessage = '요청이 취소되었습니다.';
        }
        
        setGeneratedCareerSentences([errorMessage]);
      }
    } catch (error) {
      console.error("예상치 못한 오류:", error);
      
      if (error.name === 'AbortError') {
        setGeneratedCareerSentences(["요청이 취소되었습니다."]);
      } else {
        setGeneratedCareerSentences([`오류: ${error.message || '알 수 없는 오류가 발생했습니다.'}`]);
      }
    }

    setIsGeneratingCareerSentence(false);
  };

  const handleSelectCareerSentence = (sentence: string) => {
    setShowRegenerateDialog(false);
    setSelectedCareerSentence(sentence);
  };

  const handleGoToArchive = () => {
    navigate("/archive");
  };

  return (
    <>
      <section className="flex flex-col items-center pb-8">
        <div className="w-full max-w-7xl mx-auto px-4">
          <CareerSentenceSection
            selectedCareerSentence={selectedCareerSentence}
            onRegenerateCareerSentence={handleRegenerateCareerSentence}
          />

          <div className="space-y-8">
            {carouselGroups.map((group) => (
              <TopicCarousel
                key={group.id}
                group={group}
                followUpStates={followUpStates}
                selectedCareerSentence={selectedCareerSentence}
                onGenerate={handleGenerate}
                onSelectTopic={handleSelectTopic}
                onRefreshTopic={handleRefreshTopic}
                onLockTopic={handleLockTopic}
                onDeleteTopic={handleDeleteTopic}
                onRegenerateMethods={handleRegenerateMethods}
                onUpdateResearchMethods={handleUpdateResearchMethods}
                onTopicTypeChange={handleTopicTypeChange}
                onShowResearchMethods={handleShowResearchMethods}
                onFollowUpChange={handleFollowUpChange}
                onCareerSentenceSelect={setSelectedCareerSentence}
                onAddFollowUpRow={handleAddFollowUpRow}
                onOpenCareerSentenceDialog={handleRegenerateCareerSentence}
              />
            ))}
          </div>

          {/* 보관함 이동 버튼 */}
          <div className="flex justify-center mt-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleGoToArchive}
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                >
                  <Archive className="h-4 w-4" />
                  보관함으로 이동
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>저장된 주제들을 관리하세요</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </section>

      <CareerSentenceDialog
        open={showRegenerateDialog}
        onOpenChange={setShowRegenerateDialog}
        generatedCareerSentences={generatedCareerSentences}
        isGeneratingCareerSentence={isGeneratingCareerSentence}
        onGenerate={handleCareerSentenceGenerate}
        onSelectCareerSentence={handleSelectCareerSentence}
      />
    </>
  );
};

export default TopicGeneratorSection;
