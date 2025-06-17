
import React, { useState } from 'react';
import SelectedTopicCard from "@/components/SelectedTopicCard";
import TopicGeneratorCard from "@/components/TopicGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import { TopicRow } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X } from "lucide-react";
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useCarousel } from "@/components/ui/carousel";

// Custom carousel controls component
const CustomCarouselControls = ({ groupId, canAddFollowUp, onAddFollowUp }: {
  groupId: number;
  canAddFollowUp: boolean;
  onAddFollowUp: (groupId: number) => void;
}) => {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-20 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
      
      {canScrollNext ? (
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-20 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          disabled={!canScrollNext}
          onClick={scrollNext}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      ) : canAddFollowUp ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="absolute -right-20 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-xs font-medium"
              onClick={() => onAddFollowUp(groupId)}
            >
              후속
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>후속 심화 탐구 만들기</p>
          </TooltipContent>
        </Tooltip>
      ) : null}
    </>
  );
};

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
  handleGenerate: (id: number, inputs: {
    subject: string;
    concept: string;
    topicType: string;
  }) => void;
  handleSelectTopic: (id: number, topic: string) => void;
  handleRefreshTopic: (id: number) => void;
  handleLockTopic: (id: number) => void;
  handleDeleteTopic: (id: number) => void;
  handleRegenerateMethods: (id: number) => void;
  handleTopicTypeChange: (id: number, type: string) => void;
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
  handleTopicTypeChange,
  followUpStates,
  handleFollowUpChange,
  selectedCareerSentence,
  setSelectedCareerSentence
}) => {
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isGeneratingCareerSentence, setIsGeneratingCareerSentence] = useState(false);
  
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

    // 시뮬레이션: 3개의 진로 문장 생성
    setTimeout(() => {
      const sentences = [`${data.careerField}이 되어 ${data.activity}을 통해 사회에 기여하고 싶습니다.`, `${data.careerField}으로서 ${data.activity} 분야에서 전문성을 발휘하고 싶습니다.`, `${data.careerField}의 꿈을 이루기 위해 ${data.activity}을 깊이 탐구하고 싶습니다.`];
      setGeneratedCareerSentences(sentences);
      setIsGeneratingCareerSentence(false);
    }, 2000);
  };
  
  const handleSelectCareerSentence = (sentence: string) => {
    setShowRegenerateDialog(false);
    setSelectedCareerSentence(sentence);
  };

  return <>
      <section className="flex flex-col items-center pb-8">
        <div className="w-full max-w-6xl">
          {/* 선택된 진로 문장 표시 섹션 */}
          {selectedCareerSentence && <div className="w-full max-w-4xl mx-auto mb-6">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-center text-green-800 mb-1">진로 문장</p>
                    <p className="text-center text-green-700">{selectedCareerSentence}</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={handleRegenerateCareerSentence} className="flex-shrink-0 h-8 w-8 p-0 hover:bg-green-100">
                        <RefreshCw className="h-4 w-4 text-green-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>진로 문장 재생성</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>}

          {/* 캐러셀 그룹들을 세로로 배치 */}
          <div className="space-y-8">
            {carouselGroups.map((group, groupIndex) => {
              // 후속 탐구를 추가할 수 있는지 확인 (마지막 주제가 선택되었는지)
              const lastRow = group.topicRows[group.topicRows.length - 1];
              const canAddFollowUp = lastRow?.stage === 'topic_selected' && lastRow?.selectedTopic;
              
              return (
                <div key={group.id} className="w-full">
                  <Carousel className="w-full">
                    <CarouselContent className="ml-0">
                      {group.topicRows.map((row, index) => (
                        <CarouselItem key={row.id} className="pl-0 pr-8 basis-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px] px-4">
                            <div className="h-full overflow-hidden">
                              {row.stage === "topic_selected" ? (
                                <SelectedTopicCard 
                                  topic={row.selectedTopic!} 
                                  subject={row.subject} 
                                  concept={row.concept} 
                                  topicNumber={index + 1} 
                                  isLocked={row.isLocked} 
                                  onRefresh={() => handleRefreshTopic(row.id)} 
                                  onLock={() => handleLockTopic(row.id)} 
                                  onDelete={() => handleDeleteTopic(row.id)} 
                                  onRegenerateMethods={() => handleRegenerateMethods(row.id)} 
                                  topicType={row.topicType} 
                                  onTopicTypeChange={type => handleTopicTypeChange(row.id, type)} 
                                />
                              ) : (
                                <TopicGeneratorCard 
                                  onGenerate={inputs => handleGenerate(row.id, inputs)} 
                                  initialValues={{
                                    subject: row.subject,
                                    concept: row.concept,
                                    request: row.request,
                                    topicType: row.topicType
                                  }} 
                                  showFollowUp={index > 0} 
                                  isFollowUp={followUpStates[row.id] || false} 
                                  onFollowUpChange={checked => handleFollowUpChange(row.id, checked as boolean)} 
                                  rowId={row.id} 
                                  selectedCareerSentence={selectedCareerSentence} 
                                  onCareerSentenceSelect={setSelectedCareerSentence} 
                                />
                              )}
                            </div>
                            <div className="h-full overflow-hidden">
                              {row.stage === "topic_selected" ? (
                                <TopicResultsCard 
                                  title="탐구 방법" 
                                  placeholder="탐구 방법을 생성 중입니다..." 
                                  topics={row.researchMethods} 
                                  onSelectTopic={method => console.log("Method selected:", method)} 
                                  isLoading={row.isLoadingMethods} 
                                  isSelectable={false} 
                                  scrollable={true} 
                                />
                              ) : (
                                <TopicResultsCard 
                                  title="탐구 주제 후보" 
                                  placeholder="'주제 생성' 버튼을 누르면 주제 후보 3개가 생성됩니다." 
                                  topics={row.generatedTopics} 
                                  onSelectTopic={topic => handleSelectTopic(row.id, topic)} 
                                  isLoading={row.isLoadingTopics} 
                                />
                              )}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    
                    {/* 캐러셀이 여러 항목을 가지거나 후속 탐구를 추가할 수 있을 때만 네비게이션 버튼 표시 */}
                    {(group.topicRows.length > 1 || canAddFollowUp) && (
                      <CustomCarouselControls 
                        groupId={group.id}
                        canAddFollowUp={canAddFollowUp}
                        onAddFollowUp={handleAddFollowUpRow}
                      />
                    )}
                  </Carousel>
                </div>
              );
            })}
          </div>
          
          {/* 새로운 주제 추가 버튼 */}
          <div className="flex justify-center mt-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleAddRow} className="px-8 py-4 text-lg font-bold text-slate-50 bg-slate-900 hover:bg-slate-800">
                  새로운 주제 추가
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>아래에 새로운 주제 세트를 추가합니다</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* 진로 문장 재생성 다이얼로그 */}
      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent className="max-w-6xl w-full p-0 bg-white">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" onClick={() => setShowRegenerateDialog(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <DialogTitle className="sr-only">진로 문장 재생성</DialogTitle>
          <DialogDescription className="sr-only">새로운 진로 문장을 생성합니다</DialogDescription>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              새로운 진로 문장 생성
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              아래에서 새로운 진로 문장을 생성해주세요.
            </p>
            
            {/* 좌우 분할 레이아웃 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
              {/* 왼쪽: 진로 문장 생성기 */}
              <div className="h-full">
                <CareerSentenceGeneratorCard onGenerate={handleCareerSentenceGenerate} />
              </div>
              
              {/* 오른쪽: 생성된 진로 문장 결과 */}
              <div className="h-full">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>생성된 진로 문장</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-hidden min-h-0">
                    {isGeneratingCareerSentence ? <div className="flex items-center justify-center h-full">
                        <p>진로 문장을 생성 중입니다...</p>
                      </div> : generatedCareerSentences.length === 0 ? <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-center">
                          '문장 생성' 버튼을 누르면 진로 문장 후보 3개가 생성됩니다.
                        </p>
                      </div> : <div className="flex flex-col gap-2 h-full overflow-y-auto">
                        {generatedCareerSentences.map((sentence, index) => <Button key={index} variant="outline" className="justify-start text-left h-auto whitespace-normal py-3 px-4 hover:bg-green-50 hover:border-green-300" onClick={() => handleSelectCareerSentence(sentence)}>
                            {sentence}
                          </Button>)}
                      </div>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};
export default TopicGeneratorSection;
