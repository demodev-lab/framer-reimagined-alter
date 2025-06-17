
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import TopicGeneratorCard from '../TopicGeneratorCard';
import TopicResultsCard from '../TopicResultsCard';
import SelectedTopicCard from '../SelectedTopicCard';

interface TopicCarouselProps {
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

const TopicCarousel: React.FC<TopicCarouselProps> = ({
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
  const lastRow = group.topicRows[group.topicRows.length - 1];
  const canAddFollowUp = lastRow?.stage === 'topic_selected' && lastRow?.selectedTopic;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent className="ml-0">
          {group.topicRows.map((row, index) => (
            <CarouselItem key={row.id} className="pl-0 pr-8 basis-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px] px-4 mx-auto max-w-6xl">
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
                      onTopicTypeChange={(type) => onTopicTypeChange(row.id, type)}
                    />
                  ) : (
                    <TopicGeneratorCard 
                      onGenerate={(inputs) => onGenerate(row.id, inputs)}
                      initialValues={{
                        subject: row.subject,
                        concept: row.concept,
                        request: row.request,
                        topicType: row.topicType
                      }}
                      showFollowUp={index > 0}
                      isFollowUp={followUpStates[row.id] || false}
                      onFollowUpChange={(checked) => onFollowUpChange(row.id, checked as boolean)}
                      rowId={row.id}
                      selectedCareerSentence={selectedCareerSentence}
                      onCareerSentenceSelect={onCareerSentenceSelect}
                    />
                  )}
                </div>
                <div className="h-full overflow-hidden">
                  <TopicResultsCard 
                    title="생성된 주제"
                    placeholder="주제를 생성하려면 왼쪽 폼을 작성하고 '주제 생성' 버튼을 눌러주세요."
                    topics={row.generatedTopics || []}
                    onSelectTopic={(topic) => onSelectTopic(row.id, topic)}
                    isLoading={row.isLoadingTopics || false}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default TopicCarousel;
