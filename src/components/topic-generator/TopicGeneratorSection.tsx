
import React from 'react';
import SelectedTopicCard from "@/components/SelectedTopicCard";
import TopicGeneratorCard from "@/components/TopicGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TopicRow } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TopicGeneratorSectionProps {
  topicRows: TopicRow[];
  followUpStates: Record<number, boolean>;
  handleAddRow: () => void;
  handleGenerate: (id: number, inputs: { subject: string; concept: string; topicType: string; }) => void;
  handleSelectTopic: (id: number, topic: string) => void;
  handleRefreshTopic: (id: number) => void;
  handleLockTopic: (id: number) => void;
  handleDeleteTopic: (id: number) => void;
  handleRegenerateMethods: (id: number) => void;
  handleTopicTypeChange: (id: number, type: string) => void;
  handleFollowUpChange: (id: number, checked: boolean) => void;
  selectedCareerSentence?: string | null;
}

const TopicGeneratorSection: React.FC<TopicGeneratorSectionProps> = ({
  topicRows,
  handleAddRow,
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
}) => {
  return (
    <section className="flex flex-col items-center pb-8">
      <div className="w-full max-w-4xl px-[182px]">
        <div className="-mx-[182px]">
          <div className="py-0 flex flex-col gap-8">
            {topicRows.map((row, index) => (
              <div key={row.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
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
                      onTopicTypeChange={(type) => handleTopicTypeChange(row.id, type)}
                    />
                  ) : (
                    <TopicGeneratorCard
                      onGenerate={(inputs) => handleGenerate(row.id, inputs)}
                      initialValues={{
                        subject: row.subject,
                        concept: row.concept,
                        request: row.request,
                        topicType: row.topicType,
                      }}
                      showFollowUp={index > 0}
                      isFollowUp={followUpStates[row.id] || false}
                      onFollowUpChange={(checked) => handleFollowUpChange(row.id, checked as boolean)}
                      rowId={row.id}
                      selectedCareerSentence={selectedCareerSentence}
                    />
                  )}
                </div>
                <div className="h-full overflow-hidden">
                  {row.stage === "topic_selected" ? (
                    <TopicResultsCard
                      title="탐구 방법"
                      placeholder="탐구 방법을 생성 중입니다..."
                      topics={row.researchMethods}
                      onSelectTopic={(method) => console.log("Method selected:", method)}
                      isLoading={row.isLoadingMethods}
                      isSelectable={false}
                      scrollable={true}
                    />
                  ) : (
                    <TopicResultsCard
                      title="탐구 주제 후보"
                      placeholder="'주제 생성' 버튼을 누르면 주제 후보 3개가 생성됩니다."
                      topics={row.generatedTopics}
                      onSelectTopic={(topic) => handleSelectTopic(row.id, topic)}
                      isLoading={row.isLoadingTopics}
                    />
                  )}
                </div>
              </div>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full py-6" onClick={handleAddRow}>
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>후속 탐구를 만들고 싶다면, 클릭하세요</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopicGeneratorSection;
