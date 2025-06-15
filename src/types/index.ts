
export interface TopicRow {
  id: number;
  stage: 'initial' | 'topics_generated' | 'topic_selected';
  subject: string;
  concept: string;
  careerPath: string;
  request: string;
  generatedTopics: string[];
  isLoadingTopics: boolean;
  selectedTopic: string | null;
  researchMethods: string[];
  isLoadingMethods: boolean;
  isLocked: boolean;
  topicType: string;
}
