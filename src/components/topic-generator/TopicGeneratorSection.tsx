
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive } from 'lucide-react';
import { TopicRow } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import CareerSentenceSection from './CareerSentenceSection';
import CareerSentenceDialog from './CareerSentenceDialog';
import TopicCarousel from './TopicCarousel';

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
  const navigate = useNavigate();
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

  const handleGoToArchive = () => {
    navigate('/archive');
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
            {carouselGroups.map(group => (
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
                onTopicTypeChange={handleTopicTypeChange} 
                onFollowUpChange={handleFollowUpChange} 
                onCareerSentenceSelect={setSelectedCareerSentence} 
                onAddFollowUpRow={handleAddFollowUpRow} 
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
