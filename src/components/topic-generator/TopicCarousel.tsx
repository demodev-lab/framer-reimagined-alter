
import React from 'react';
import { TopicRow } from '@/types';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import SelectedTopicCard from "@/components/SelectedTopicCard";
import TopicGeneratorCard from "@/components/TopicGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";
import CarouselControls from './CarouselControls';

interface TopicCarouselProps {
  group: {
    id: number;
    topicRows: TopicRow[];
  };
  followUpStates: Record<number, boolean>;
  selectedCareerSentence: string | null;
  onGenerate: (id: number, inputs: { subject: string; concept: string; topicType: string; }) => void;
  onSelectTopic: (id: number, topic: string) => void;
  onRefreshTopic: (id: number) => void;
  onLockTopic: (id: number) => void;
  onDeleteTopic: (id: number) => void;
  onRegenerateMethods: (id: number) => void;
  onTopicTypeChange: (id: number, type: string) => void;
  onFollowUpChange: (id: number, checked: boolean) => void;
  onCareerSentenceSelect: (sentence: string) => void;
  onAddFollowUpRow: (groupId: number) => void;
}

const TopicCarousel: React.FC<TopicCarouselProps> = ({
  group,
  followUpStates,
  selectedCareerSentence,
  onGenerate,
  onSelectTopic,
  onRefreshTopic,
  onLockTopic,
  onDeleteTopic,
  onRegenerateMethods,
  onTopicTypeChange,
  onFollowUpChange,
  onCareerSentenceSelect,
  onAddFollowUpRow
}) => {
  const lastRow = group.topicRows[group.topicRows.length - 1];
  const canAddFollowUp = lastRow?.stage === 'topic_selected' && lastRow?.selectedTopic;

  return (
    <div className="w-full">
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
                      onRefresh={() => onRefreshTopic(row.id)} 
                      onLock={() => onLockTopic(row.id)} 
                      onDelete={() => onDeleteTopic(row.id)} 
                      onRegenerateMethods={() => onRegenerateMethods(row.id)} 
                      topicType={row.topicType} 
                      onTopicTypeChange={type => onTopicTypeChange(row.id, type)} 
                    />
                  ) : (
                    <TopicGeneratorCard 
                      onGenerate={inputs => onGenerate(row.id, inputs)} 
                      initialValues={{
                        subject: row.subject,
                        concept: row.concept,
                        request: row.request,
                        topicType: row.topicType
                      }} 
                      showFollowUp={index > 0} 
                      isFollowUp={Boolean(followUpStates[row.id])}
                      onFollowUpChange={(checked) => {
                        onFollowUpChange(row.id, Boolean(checked));
                      }} 
                      rowId={row.id} 
                      selectedCareerSentence={selectedCareerSentence} 
                      onCareerSentenceSelect={onCareerSentenceSelect} 
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
                      onSelectTopic={topic => onSelectTopic(row.id, topic)} 
                      isLoading={row.isLoadingTopics} 
                    />
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {(group.topicRows.length > 1 || canAddFollowUp) && (
          <CarouselControls 
            groupId={group.id}
            canAddFollowUp={canAddFollowUp}
            onAddFollowUp={onAddFollowUpRow}
          />
        )}
      </Carousel>
    </div>
  );
};

export default TopicCarousel;
