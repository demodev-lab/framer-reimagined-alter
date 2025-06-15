
import { useState } from 'react';
import { TopicRow } from '@/types/index';
import { toast } from 'sonner';

const generateMethods = (topic: string) => {
  return [
    `'${topic}'의 선행 연구 분석: 기존 연구의 한계점을 명확히 하고, 본 연구의 독창적 기여 지점을 구체화하는 방법론.`,
    `심층 인터뷰 및 설문조사 병행: 정량적 데이터와 정성적 데이터를 통합 분석하여, '${topic}'에 대한 다각적 이해를 도모하는 혼합 연구 설계.`,
    `파일럿 테스트 기반 실험 설계: 소규모 예비 실험을 통해 변수를 통제하고, 본 실험의 신뢰도와 타당도를 극대화하는 전략.`,
    `연구 윤리 고려사항: 연구 참여자의 권익 보호 및 데이터 보안을 위한 구체적인 프로토콜 제시.`
  ];
};

export const useTopicManager = () => {
  const [topicRows, setTopicRows] = useState<TopicRow[]>([
    {
      id: 1,
      stage: 'initial',
      subject: '',
      concept: '',
      careerPath: '',
      request: '',
      generatedTopics: [],
      isLoadingTopics: false,
      selectedTopic: null,
      researchMethods: [],
      isLoadingMethods: false,
      isLocked: false,
      topicType: '보고서 주제',
    },
  ]);
  const [lockedTopics, setLockedTopics] = useState<string[]>([]);

  const handleAddRow = () => {
    setTopicRows(prev => [
      ...prev,
      {
        id: Date.now(),
        stage: 'initial',
        subject: '',
        concept: '',
        careerPath: '',
        request: '',
        generatedTopics: [],
        isLoadingTopics: false,
        selectedTopic: null,
        researchMethods: [],
        isLoadingMethods: false,
        isLocked: false,
        topicType: '보고서 주제',
      },
    ]);
  };

  const handleGenerate = (rowId: number, inputs: { subject: string; concept: string; careerPath: string; request: string; }) => {
    console.log("Generating topics for row:", rowId, "with inputs:", inputs);
    if (!inputs.subject && !inputs.concept && !inputs.careerPath) {
      alert("교과 과목, 교과 개념, 진로 중 하나 이상을 입력해주세요.");
      return;
    }
    
    setTopicRows(prevRows => prevRows.map(row =>
      row.id === rowId ? { ...row, ...inputs, isLoadingTopics: true, generatedTopics: [] } : row
    ));

    setTimeout(() => {
      const newTopics = [
        `'${inputs.subject || '선택 과목'}'와 '${inputs.concept || '주요 개념'}'을(를) 활용한 '${inputs.careerPath || '희망 진로'}' 관련 탐구 주제`,
        `'${inputs.concept || '주요 개념'}'을 '${inputs.careerPath || '희망 진로'}' 분야에 적용하는 방안 연구`,
        `'${inputs.subject || '선택 과목'}' 심화 탐구: '${inputs.careerPath || '희망 진로'}'를 위한 제언`,
        `${inputs.request ? `요청사항(${inputs.request})을 반영한 ` : ''}맞춤형 탐구 주제 제안`
      ].filter(Boolean);

      setTopicRows(prevRows => prevRows.map(row =>
        row.id === rowId
          ? { ...row, isLoadingTopics: false, generatedTopics: newTopics, stage: 'topics_generated' }
          : row
      ));
    }, 1500);
  };

  const handleSelectTopic = (rowId: number, topic: string) => {
    console.log("Selected topic for row:", rowId, "topic:", topic);
    setTopicRows(prevRows => prevRows.map(row =>
      row.id === rowId ? { ...row, selectedTopic: topic, stage: 'topic_selected', isLoadingMethods: true, researchMethods: [] } : row
    ));

    setTimeout(() => {
      const methods = generateMethods(topic);
      setTopicRows(prevRows => prevRows.map(row =>
        row.id === rowId ? { ...row, isLoadingMethods: false, researchMethods: methods } : row
      ));
    }, 1500);
  };

  const handleRefreshTopic = (rowId: number) => {
    console.log("Refreshing topic for row:", rowId);
    setTopicRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? {
              ...row,
              stage: 'topics_generated',
              selectedTopic: null,
              researchMethods: [],
              isLoadingMethods: false,
            }
          : row
      )
    );
    toast.info("주제 목록으로 돌아갑니다. 다른 주제를 선택해주세요.");
  };

  const handleLockTopic = (rowId: number) => {
    setTopicRows(prevRows =>
      prevRows.map(row => {
        if (row.id === rowId) {
          const newIsLocked = !row.isLocked;
          if (row.selectedTopic) {
            if (newIsLocked) {
              setLockedTopics(prev => [...prev, row.selectedTopic!]);
              toast.success("주제가 잠금 처리되었습니다.");
            } else {
              setLockedTopics(prev => prev.filter(t => t !== row.selectedTopic));
              toast.info("주제 잠금이 해제되었습니다.");
            }
          }
          return { ...row, isLocked: newIsLocked };
        }
        return row;
      })
    );
  };

  const handleDeleteTopic = (rowId: number) => {
    console.log("Deleting topic for row:", rowId);
    setTopicRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? {
              id: row.id,
              stage: 'initial',
              subject: '',
              concept: '',
              careerPath: '',
              request: '',
              generatedTopics: [],
              isLoadingTopics: false,
              selectedTopic: null,
              researchMethods: [],
              isLoadingMethods: false,
              isLocked: false,
              topicType: '보고서 주제',
            }
          : row
      )
    );
    toast.warning("주제가 삭제되었습니다. 새로 검색해주세요.");
  };

  const handleRegenerateMethods = (rowId: number) => {
    const row = topicRows.find(r => r.id === rowId);
    if (!row || !row.selectedTopic) return;
    
    console.log("Regenerating methods for row:", rowId);

    setTopicRows(prevRows => prevRows.map(r =>
      r.id === rowId ? { ...r, isLoadingMethods: true, researchMethods: [] } : r
    ));

    setTimeout(() => {
      const newMethods = generateMethods(row.selectedTopic!);
      setTopicRows(prevRows => prevRows.map(r =>
        r.id === rowId ? { ...r, isLoadingMethods: false, researchMethods: newMethods } : r
      ));
      toast.success("탐구 방법이 새롭게 생성되었습니다.");
    }, 1500);
  };

  const handleTopicTypeChange = (rowId: number, topicType: string) => {
    setTopicRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, topicType } : row
      )
    );
    toast.info(`주제 유형이 '${topicType}'(으)로 변경되었습니다.`);
  };

  return {
    topicRows,
    lockedTopics,
    handleAddRow,
    handleGenerate,
    handleSelectTopic,
    handleRefreshTopic,
    handleLockTopic,
    handleDeleteTopic,
    handleRegenerateMethods,
    handleTopicTypeChange,
  };
};
