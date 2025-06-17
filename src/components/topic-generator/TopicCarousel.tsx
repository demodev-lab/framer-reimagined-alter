import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import TopicGeneratorCard from './TopicGeneratorCard';
import TopicResultsCard from './TopicResultsCard';
import SelectedTopicCard from './SelectedTopicCard';

interface TopicCarouselProps {
  group: any;
  followUpStates: { [key: string]: boolean };
  onFollowUpChange: (rowId: string, checked: boolean) => void;
  selectedCareerSentence: string | null;
}

const TopicCarousel: React.FC<TopicCarouselProps> = ({
  group,
  followUpStates,
  onFollowUpChange,
  selectedCareerSentence
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
                      onEdit={() => onFollowUpChange(row.id, true)} 
                      onDelete={() => onFollowUpChange(row.id, false)} 
                    />
                  ) : (
                    <TopicGeneratorCard 
                      key={row.id} 
                      rowId={row.id} 
                      selectedCareerSentence={selectedCareerSentence} 
                      onFollowUpChange={(checked) => onFollowUpChange(row.id, checked)} 
                      isFollowUp={followUpStates[row.id] || false}
                    />
                  )}
                </div>
                <div className="h-full overflow-hidden">
                  {row.stage === "topics_generated" && (
                    <TopicResultsCard 
                      topicResult={{ 
                        id: row.id, 
                        topics: row.topics, 
                        topicType: row.topicType
                      }} 
                      showFollowUp={index > 0} 
                      isFollowUp={followUpStates[row.id] || false}
                      onFollowUpChange={(checked) => {
                        onFollowUpChange(row.id, checked);
                      }} 
                      rowId={row.id} 
                      selectedCareerSentence={selectedCareerSentence} 
                      setSelectedCareerSentence={() => {}} />
                  )}
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
