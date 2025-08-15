
export interface TopicRow {
  id: number;
  stage: 'initial' | 'topics_generated' | 'topic_selected';
  subject: string;
  concept: string;
  request: string;
  generatedTopics: string[];
  isLoadingTopics: boolean;
  selectedTopic: string | null;
  researchMethods: string[];
  isLoadingMethods: boolean;
  isLoadingResearchMethod?: boolean; // TopicResultsCard에서 사용
  showResearchMethods: boolean; // 탐구 방법 섹션 표시 여부
  isLocked: boolean;
  topicType: string;
  // 상세 프로젝트 정보 (N8N 웹훅으로부터 받은 데이터)
  detailedProjectInfo?: {
    사전_조사: string;
    핵심_활동: string;
    연관_교과목: string[];
    사용_도구: string[];
  };
  // 탐구 주제 포트폴리오 (추가 정보 포함)
  topicsWithDetails?: {
    id: number;
    title: string;
  }[];
  // N8N에서 받은 상세 주제 정보
  detailedTopics?: {
    id: number;
    title: string;
    summary: string;
  }[];
}
