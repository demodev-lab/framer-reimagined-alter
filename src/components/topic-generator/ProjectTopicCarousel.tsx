
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import TopicGeneratorCard from '../TopicGeneratorCard';
import TopicResultsCard from '../TopicResultsCard';
import SelectedTopicCard from '../SelectedTopicCard';
import ResearchMethodsCard from '../ResearchMethodsCard';

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
  "1-1 프로젝트",
  "1-2 프로젝트", 
  "2-1 프로젝트",
  "2-2 프로젝트",
  "3-1 프로젝트"
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
  const navigate = useNavigate();
  const lastRow = group.topicRows[group.topicRows.length - 1];
  const canAddFollowUp = lastRow?.stage === 'topic_selected' && lastRow?.selectedTopic;

  const handleBackToGenerator = (rowId: number) => {
    onDeleteTopic(rowId);
  };

  const handleGoToArchive = () => {
    navigate('/archive');
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

      {/* 5개 학기 프로젝트를 격자 형태로 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {group.topicRows.slice(0, 5).map((row: any, index: number) => (
          <div key={row.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
              {semesterLabels[index]}
            </h3>
            
            <div className="min-h-[300px] flex flex-col">
              {/* 단계 1: 초기 상태 */}
              {row.stage === "initial" && (
                <div className="text-center text-gray-500 py-8">
                  진로 문장을 선택하고<br />
                  주제 생성 버튼을 눌러주세요
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
                <div className="flex flex-col space-y-4">
                  <SelectedTopicCard 
                    topic={row.selectedTopic!}
                    subject={semesterLabels[index]}
                    concept="프로젝트 주제"
                    topicNumber={index + 1}
                    isLocked={row.isLocked}
                    onRefresh={() => onRefreshTopic(row.id)}
                    onLock={() => onLockTopic(row.id)}
                    onDelete={() => onDeleteTopic(row.id)}
                    onRegenerateMethods={() => onRegenerateMethods(row.id)}
                    topicType={row.topicType}
                    onTopicTypeChange={(type) => onTopicTypeChange(row.id, type)}
                    onGoBack={handleGoToArchive}
                  />
                  
                  {/* 탐구 방법 카드 */}
                  {(row.researchMethods && row.researchMethods.length > 0) || row.isLoadingMethods ? (
                    <ResearchMethodsCard 
                      researchMethods={row.researchMethods || []}
                      isLoading={row.isLoadingMethods || false}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTopicCarousel;
