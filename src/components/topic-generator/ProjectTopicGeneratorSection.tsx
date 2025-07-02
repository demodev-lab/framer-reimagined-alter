
import React, { useState } from 'react';
import { TopicRow } from '@/types';
import { DetailedProjectInfo } from '@/types/projectTypes';
import CareerSentenceSection from './CareerSentenceSection';
import CareerSentenceDialog from './CareerSentenceDialog';
import ProjectTopicCarousel from './ProjectTopicCarousel';

interface CarouselGroup {
  id: number;
  topicRows: TopicRow[];
}

interface ProjectTopicGeneratorSectionProps {
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
  handleRegenerateAllTopics: () => void;
  handleUpdateTopicsFromWebhook: (detailedProjects: DetailedProjectInfo[]) => void;
  selectedCareerSentence?: string | null;
  setSelectedCareerSentence: (sentence: string) => void;
}

const ProjectTopicGeneratorSection: React.FC<ProjectTopicGeneratorSectionProps> = ({
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
  handleRegenerateAllTopics,
  handleUpdateTopicsFromWebhook,
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
    
    // 진로 문장이 선택되면 자동으로 모든 프로젝트 주제 생성
    setTimeout(() => {
      handleRegenerateAllTopics();
    }, 500);
  };

  return (
    <>
      <section className="flex flex-col items-center pb-8">
        <div className="w-full max-w-7xl mx-auto px-4">
          {/* 진로 문장 생성 다이얼로그를 먼저 표시 */}
          {!selectedCareerSentence && (
            <div className="text-center mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">진로 문장을 먼저 생성해주세요</h3>
              <button
                onClick={handleRegenerateCareerSentence}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                진로 문장 생성하기
              </button>
            </div>
          )}

          {/* 선택된 진로 문장 표시 */}
          <CareerSentenceSection 
            selectedCareerSentence={selectedCareerSentence} 
            onRegenerateCareerSentence={handleRegenerateCareerSentence} 
          />

          {/* 캐러셀 표시 */}
          <div className="space-y-8">
            {carouselGroups.map(group => (
              <ProjectTopicCarousel 
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
                onRegenerateAllTopics={handleRegenerateAllTopics}
                onUpdateTopicsFromWebhook={handleUpdateTopicsFromWebhook}
              />
            ))}
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

export default ProjectTopicGeneratorSection;
