import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import TopicGeneratorCard from "../TopicGeneratorCard";
import TopicResultsCard from "../TopicResultsCard";
import SelectedTopicCard from "../SelectedTopicCard";
import ResearchMethodsCard from "../ResearchMethodsCard";
import { n8nPollingClient } from "@/utils/n8nPollingClient";
import { useRef } from "react";

interface TopicCarouselProps {
  group: any;
  followUpStates: { [key: string]: boolean };
  onFollowUpChange: (rowId: number, checked: boolean) => void;
  selectedCareerSentence: string | null;
  onGenerate: (
    rowId: number,
    inputs: { subject: string; concept: string; topicType: string }
  ) => void;
  onSelectTopic: (rowId: number, topic: string) => void;
  onRefreshTopic: (rowId: number) => void;
  onLockTopic: (rowId: number) => void;
  onDeleteTopic: (rowId: number) => void;
  onRegenerateMethods: (rowId: number) => void;
  onUpdateResearchMethods?: (rowId: number, methods: string[]) => void;
  onTopicTypeChange: (rowId: number, type: string) => void;
  onCareerSentenceSelect: (sentence: string) => void;
  onAddFollowUpRow: (groupId: number) => void;
  onOpenCareerSentenceDialog: () => void;
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
  onUpdateResearchMethods,
  onTopicTypeChange,
  onCareerSentenceSelect,
  onAddFollowUpRow,
  onOpenCareerSentenceDialog,
}) => {
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRow = group.topicRows[group.topicRows.length - 1];
  const canAddFollowUp =
    lastRow?.stage === "topic_selected" && lastRow?.selectedTopic;

  const handleBackToGenerator = (rowId: number) => {
    // 주제 생성기로 돌아가기
    onDeleteTopic(rowId);
  };

  const handleGoToArchive = () => {
    // 보관함 페이지로 이동
    navigate("/archive");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent className="ml-0">
          {group.topicRows.map((row, index) => (
            <CarouselItem key={row.id} className="pl-0 pr-8 basis-full">
              <div className="flex justify-center min-h-[400px] px-4">
                <div className="w-full max-w-2xl overflow-hidden flex flex-col space-y-4">
                  {/* 단계 1: 초기 상태 - 주제 생성기만 표시 */}
                  {row.stage === "initial" && (
                    <TopicGeneratorCard
                      onGenerate={(inputs) => onGenerate(row.id, inputs)}
                      initialValues={{
                        subject: row.subject,
                        concept: row.concept,
                        request: row.request,
                        topicType: row.topicType,
                      }}
                      showFollowUp={index > 0}
                      isFollowUp={followUpStates[row.id] || false}
                      onFollowUpChange={(checked) =>
                        onFollowUpChange(row.id, checked as boolean)
                      }
                      rowId={row.id}
                      selectedCareerSentence={selectedCareerSentence}
                      onCareerSentenceSelect={onCareerSentenceSelect}
                      onOpenCareerSentenceDialog={onOpenCareerSentenceDialog}
                    />
                  )}

                  {/* 단계 2: 주제 생성 완료 - 생성된 주제 목록 표시 */}
                  {row.stage === "topics_generated" && (
                    <TopicResultsCard
                      title="생성된 주제"
                      placeholder="주제를 생성하려면 왼쪽 폼을 작성하고 '주제 생성' 버튼을 눌러주세요."
                      topics={row.generatedTopics || []}
                      onSelectTopic={(topic) => onSelectTopic(row.id, topic)}
                      isLoading={row.isLoadingTopics || false}
                      onBack={() => handleBackToGenerator(row.id)}
                      detailedTopics={
                        row.detailedTopics
                          ? row.detailedTopics.map((topic, index) => ({
                              id: index,
                              주제명: topic.title,
                              탐구_주제_요약: topic.summary,
                              실현_가능성: topic.feasibility,
                            }))
                          : undefined
                      }
                      showDetailedView={!!row.detailedTopics}
                      onBackToTopicList={() => {
                        console.log("주제 목록으로 돌아가기");
                        // TODO: 주제 목록 상태로 변경
                      }}
                      isLoadingResearchMethod={
                        row.isLoadingResearchMethod || false
                      }
                      researchMethods={row.researchMethods || []}
                    />
                  )}

                  {/* 단계 3: 주제 선택 완료 - 선택된 주제 카드 표시 */}
                  {row.stage === "topic_selected" && (
                    <>
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
                        onTopicTypeChange={(type) =>
                          onTopicTypeChange(row.id, type)
                        }
                        onGoBack={handleGoToArchive}
                        onGenerateResearchMethod={(methods) => {
                          if (methods && Array.isArray(methods)) {
                            // N8N에서 받은 탐구 방법 데이터를 직접 상태에 반영
                            if (onUpdateResearchMethods) {
                              onUpdateResearchMethods(row.id, methods);
                            }
                          } else {
                            // 기본 탐구 방법 생성 로직
                            onRegenerateMethods(row.id);
                          }
                        }}
                      />

                      {/* 탐구 방법 카드 - 탐구 방법이 있거나 로딩 중일 때만 표시 */}
                      {(row.researchMethods &&
                        row.researchMethods.length > 0) ||
                      row.isLoadingMethods ? (
                        <ResearchMethodsCard
                          researchMethods={row.researchMethods || []}
                          isLoading={row.isLoadingMethods || false}
                          currentTopic={row.selectedTopic || ""}
                          onGenerateDetailedMethods={async (currentTopic) => {
                            console.log(
                              "더 자세한 탐구 방법 생성 요청:",
                              currentTopic
                            );
                            
                            // 이전 요청이 진행 중이면 취소
                            if (abortControllerRef.current) {
                              abortControllerRef.current.abort();
                            }
                            
                            // 새로운 AbortController 생성
                            abortControllerRef.current = new AbortController();
                            
                            try {
                              const response = await n8nPollingClient.requestResearchMethods(
                                {
                                  topicName: currentTopic,
                                  detailLevel: "very_detailed",
                                  timestamp: new Date().toISOString(),
                                  source: "detailed-research-methods",
                                },
                                abortControllerRef.current.signal
                              );

                              if (response.success && response.data) {
                                console.log("더 자세한 N8N 응답:", response.data);

                                // 이전 탐구 방법 제거하고 새로운 방법으로 교체
                                if (
                                  Array.isArray(response.data) &&
                                  response.data.length > 0 &&
                                  onUpdateResearchMethods
                                ) {
                                  onUpdateResearchMethods(row.id, response.data);
                                } else if (
                                  response.data &&
                                  typeof response.data === "object" &&
                                  onUpdateResearchMethods
                                ) {
                                  onUpdateResearchMethods(row.id, [response.data]);
                                }
                              } else {
                                console.error(
                                  "더 자세한 탐구 방법 생성 실패:",
                                  response.error
                                );
                              }
                            } catch (error) {
                              console.error(
                                "더 자세한 탐구 방법 요청 중 오류:",
                                error
                              );
                            }
                          }}
                        />
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TopicCarousel;
