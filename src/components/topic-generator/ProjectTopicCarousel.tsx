import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselApi } from "@/components/ui/carousel"
import TopicResultsCard from '../TopicResultsCard';
import ResearchMethodsCard from '../ResearchMethodsCard';
import { Button } from '@/components/ui/button';

interface ProjectTopicCarouselProps {
  group: any;
  followUpStates: { [key: string]: boolean };
  onFollowUpChange: (rowId: number, checked: boolean) => void;
  selectedCareerSentence: string | null;
  onGenerate: (rowId: number, inputs: { subject: string; concept: string; topicType: string; }) => void;
  onSelectTopic: (rowId: number, topic: string) => void;
  onRefreshTopic: (rowId: number) => void;
  onLockTopic: (rowId: number) => void;
  onDeleteTopic: (rowId: number) => void;
  onRegenerateMethods: (rowId: number) => void;
  onTopicTypeChange: (rowId: number, type: string) => void;
  onCareerSentenceSelect: (sentence: string) => void;
  onAddFollowUpRow: (groupId: number) => void;
}

const semesterLabels = [
  "1학년 1학기 프로젝트",
  "1학년 2학기 프로젝트", 
  "2학년 1학기 프로젝트",
  "2학년 2학기 프로젝트",
  "3학년 1학기 프로젝트"
];

const ProjectTopicCarousel: React.FC<ProjectTopicCarouselProps> = ({
  group,
  followUpStates,
  onFollowUpChange,
  selectedCareerSentence,
  onGenerate,
  onSelectTopic,
  onRefreshTopic,
  onLockTopic,
  onDeleteTopic,
  onRegenerateMethods,
  onTopicTypeChange,
  onCareerSentenceSelect,
  onAddFollowUpRow
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const lastRow = group.topicRows[group.topicRows.length - 1];
  const canAddFollowUp = lastRow?.stage === 'topic_selected' && lastRow?.selectedTopic;

  // Track slide changes using the carousel API
  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrentSlideIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api?.off("select", onSelect);
    };
  }, [api]);

  const handleBackToGenerator = (rowId: number) => {
    onDeleteTopic(rowId);
  };

  // 프로젝트 주제 페이지에서는 진로 문장 선택 후 한번에 5개 주제 생성
  const handleProjectGenerate = () => {
    if (!selectedCareerSentence) {
      return;
    }
    
    // 5개 학기 모든 주제를 한번에 생성
    group.topicRows.forEach((row: any, index: number) => {
      if (index < 5) { // 5개 학기만
        const inputs = {
          subject: semesterLabels[index],
          concept: '프로젝트 주제',
          topicType: '프로젝트 주제'
        };
        onGenerate(row.id, inputs);
      }
    });
  };

  // 현재 슬라이드의 탐구 방법 생성
  const handleGenerateCurrentMethods = () => {
    const currentRow = group.topicRows[currentSlideIndex];
    if (currentRow && currentRow.selectedTopic) {
      onRegenerateMethods(currentRow.id);
    }
  };

  // 현재 슬라이드의 탐구 방법이 있는지 확인
  const getCurrentSlideHasMethods = () => {
    const currentRow = group.topicRows[currentSlideIndex];
    return currentRow && currentRow.researchMethods && currentRow.researchMethods.length > 0;
  };

  // 현재 슬라이드에 선택된 주제가 있는지 확인
  const getCurrentSlideHasSelectedTopic = () => {
    const currentRow = group.topicRows[currentSlideIndex];
    return currentRow && currentRow.selectedTopic;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 진로 문장이 선택되었고 첫 번째 주제가 아직 생성되지 않았을 때 생성 버튼 표시 */}
      {selectedCareerSentence && group.topicRows[0]?.stage === 'initial' && (
        <div className="text-center mb-8">
          <button
            onClick={handleProjectGenerate}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            전체 학기 프로젝트 주제 생성
          </button>
        </div>
      )}

      {/* 5개 학기 프로젝트를 하나씩 보이는 캐러셀로 표시 */}
      <Carousel className="w-full max-w-4xl mx-auto" setApi={setApi}>
        <CarouselContent>
          {group.topicRows.slice(0, 5).map((row: any, index: number) => (
            <CarouselItem key={row.id}>
              <div className="border rounded-lg p-6 bg-white shadow-sm h-full">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  {semesterLabels[index]}
                </h3>
                
                <div className="min-h-[400px] flex flex-col">
                  {/* 단계 1: 초기 상태 */}
                  {row.stage === "initial" && (
                    <div className="text-center text-gray-500 py-12">
                      <div className="text-lg">
                        진로 문장을 선택하고<br />
                        주제 생성 버튼을 눌러주세요
                      </div>
                    </div>
                  )}
                  
                  {/* 단계 2: 주제 생성 완료 */}
                  {row.stage === "topics_generated" && (
                    <TopicResultsCard 
                      title="생성된 주제"
                      placeholder="주제를 생성하려면 왼쪽 폼을 작성하고 '주제 생성' 버튼을 눌러주세요."
                      topics={row.generatedTopics || []}
                      onSelectTopic={(topic) => onSelectTopic(row.id, topic)}
                      isLoading={row.isLoadingTopics || false}
                      onBack={() => handleBackToGenerator(row.id)}
                    />
                  )}
                  
                  {/* 단계 3: 주제 선택 완료 */}
                  {row.stage === "topic_selected" && (
                    <div className="flex flex-col space-y-6">
                      {/* 선택된 주제 표시 */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">선택된 주제</h4>
                        <p className="text-gray-800">{row.selectedTopic}</p>
                        <div className="mt-4 flex gap-2">
                          <Button 
                            onClick={() => onRefreshTopic(row.id)}
                            variant="outline" 
                            size="sm"
                            disabled={row.isLocked}
                          >
                            주제 재생성
                          </Button>
                          <Button 
                            onClick={() => onLockTopic(row.id)}
                            variant="outline" 
                            size="sm"
                          >
                            {row.isLocked ? '잠금 해제' : '주제 잠금'}
                          </Button>
                          <Button 
                            onClick={() => onDeleteTopic(row.id)}
                            variant="outline" 
                            size="sm"
                            disabled={row.isLocked}
                          >
                            주제 삭제
                          </Button>
                        </div>
                      </div>
                      
                      {/* 탐구 방법 섹션 */}
                      <div className="flex-1">
                        {row.researchMethods && row.researchMethods.length > 0 ? (
                          <ResearchMethodsCard 
                            researchMethods={row.researchMethods}
                            isLoading={row.isLoadingMethods || false}
                          />
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">아직 탐구 방법이 생성되지 않았습니다.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* 탐구 방법 생성 버튼 - 현재 슬라이드에 선택된 주제가 있을 때만 표시 */}
      {getCurrentSlideHasSelectedTopic() && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleGenerateCurrentMethods}
            className="bg-black text-white hover:bg-gray-800 px-6 py-3"
            disabled={group.topicRows[currentSlideIndex]?.isLoadingMethods || group.topicRows[currentSlideIndex]?.isLocked}
          >
            {group.topicRows[currentSlideIndex]?.isLoadingMethods ? '생성 중...' : 
             getCurrentSlideHasMethods() ? '탐구 방법 재생성' : '탐구 방법 생성'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectTopicCarousel;
