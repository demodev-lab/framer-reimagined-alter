
import { useState, useEffect } from 'react';
import { TopicRow } from '@/types/index';
import { toast } from 'sonner';

interface CarouselGroup {
  id: number;
  topicRows: TopicRow[];
}

const PROJECT_TOPIC_MANAGER_STORAGE_KEY = 'project_topic_manager_state';

const generateMethods = (topic: string) => {
  return [
    `'${topic}'의 선행 연구 분석: 기존 연구의 한계점을 명확히 하고, 본 연구의 독창적 기여 지점을 구체화하는 방법론.`,
    `심층 인터뷰 및 설문조사 병행: 정량적 데이터와 정성적 데이터를 통합 분석하여, '${topic}'에 대한 다각적 이해를 도모하는 혼합 연구 설계.`,
    `파일럿 테스트 기반 실험 설계: 소규모 예비 실험을 통해 변수를 통제하고, 본 실험의 신뢰도와 타당도를 극대화하는 전략.`,
    `연구 윤리 고려사항: 연구 참여자의 권익 보호 및 데이터 보안을 위한 구체적인 프로토콜 제시.`
  ];
};

const semesterLabels = [
  "1-1 프로젝트",
  "1-2 프로젝트", 
  "2-1 프로젝트",
  "2-2 프로젝트",
  "3-1 프로젝트"
];

export const useProjectTopicManager = () => {
  const [selectedCareerSentence, setSelectedCareerSentence] = useState<string | null>(null);
  
  // 5개 학기 프로젝트를 위한 초기 설정
  const [carouselGroups, setCarouselGroups] = useState<CarouselGroup[]>([
    {
      id: 1,
      topicRows: Array.from({ length: 5 }, (_, index) => ({
        id: index + 1,
        stage: 'initial',
        subject: semesterLabels[index],
        concept: '프로젝트 주제',
        request: '',
        generatedTopics: [],
        isLoadingTopics: false,
        selectedTopic: null,
        researchMethods: [],
        isLoadingMethods: false,
        isLocked: false,
        topicType: '프로젝트 주제',
      }))
    }
  ]);
  
  const [lockedTopics, setLockedTopics] = useState<string[]>([]);
  const [followUpStates, setFollowUpStates] = useState<Record<number, boolean>>({});

  // localStorage에서 상태 로드
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(PROJECT_TOPIC_MANAGER_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setSelectedCareerSentence(parsed.selectedCareerSentence);
        setCarouselGroups(parsed.carouselGroups);
        setLockedTopics(parsed.lockedTopics);
        setFollowUpStates(parsed.followUpStates);
      }
    } catch (error) {
      console.error('Failed to load project topic manager state from localStorage:', error);
    }
  }, []);

  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      const stateToSave = {
        selectedCareerSentence,
        carouselGroups,
        lockedTopics,
        followUpStates
      };
      localStorage.setItem(PROJECT_TOPIC_MANAGER_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save project topic manager state to localStorage:', error);
    }
  }, [selectedCareerSentence, carouselGroups, lockedTopics, followUpStates]);

  // Get all topic rows flattened for compatibility
  const topicRows = carouselGroups.flatMap(group => group.topicRows);

  const handleFollowUpChange = (rowId: number, isChecked: boolean) => {
    setFollowUpStates(prev => ({
      ...prev,
      [rowId]: isChecked
    }));
  };

  const handleAddFollowUpRow = (groupId: number) => {
    // 프로젝트 주제에서는 사용하지 않음
  };

  const handleAddRow = () => {
    // 프로젝트 주제에서는 사용하지 않음 (고정 5개)
  };

  const handleGenerate = (rowId: number, inputs: { subject: string; concept: string; topicType: string; }) => {
    console.log("Generating project topics for row:", rowId, "with inputs:", inputs);
    
    if (!selectedCareerSentence) {
      toast.warning("진로 문장을 먼저 생성하거나 선택해주세요.");
      return;
    }

    setCarouselGroups(prevGroups => 
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row =>
          row.id === rowId ? { ...row, ...inputs, isLoadingTopics: true, generatedTopics: [] } : row
        )
      }))
    );

    setTimeout(() => {
      // 학기별 특화된 프로젝트 주제 생성
      const semesterIndex = rowId - 1;
      const semesterLabel = semesterLabels[semesterIndex];
      
      const newTopics = [
        `'${selectedCareerSentence}'를 실현하기 위한 ${semesterLabel} 단계별 프로젝트`,
        `${semesterLabel}에 적합한 '${selectedCareerSentence}' 관련 심화 탐구`,
        `'${selectedCareerSentence}' 목표 달성을 위한 ${semesterLabel} 실습 프로젝트`,
      ];

      setCarouselGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          topicRows: group.topicRows.map(row =>
            row.id === rowId
              ? { ...row, isLoadingTopics: false, generatedTopics: newTopics, stage: 'topics_generated' }
              : row
          )
        }))
      );
    }, 1500);
  };

  const handleSelectTopic = (rowId: number, topic: string) => {
    console.log("Selected topic for row:", rowId, "topic:", topic);
    setCarouselGroups(prevGroups => 
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row =>
          row.id === rowId ? { ...row, selectedTopic: topic, stage: 'topic_selected', isLoadingMethods: true, researchMethods: [] } : row
        )
      }))
    );

    setTimeout(() => {
      const methods = generateMethods(topic);
      setCarouselGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          topicRows: group.topicRows.map(row =>
            row.id === rowId ? { ...row, isLoadingMethods: false, researchMethods: methods } : row
          )
        }))
      );
    }, 1500);
  };

  const handleRefreshTopic = (rowId: number) => {
    console.log("Regenerating topics for row:", rowId);
    
    const allRows = carouselGroups.flatMap(group => group.topicRows);
    const row = allRows.find(r => r.id === rowId);
    
    if (!row) return;

    const inputs = {
      subject: row.subject,
      concept: row.concept,
      topicType: row.topicType
    };

    setCarouselGroups(prevGroups =>
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(r =>
          r.id === rowId
            ? {
                ...r,
                stage: 'topics_generated',
                selectedTopic: null,
                researchMethods: [],
                isLoadingMethods: false,
                isLoadingTopics: true,
                generatedTopics: []
              }
            : r
        )
      }))
    );

    setTimeout(() => {
      const semesterIndex = rowId - 1;
      const semesterLabel = semesterLabels[semesterIndex];
      
      const newTopics = [
        `'${selectedCareerSentence}' 달성을 위한 ${semesterLabel} 창의적 프로젝트`,
        `${semesterLabel} 수준에 맞는 '${selectedCareerSentence}' 관련 연구 프로젝트`,
        `'${selectedCareerSentence}' 전문성 개발을 위한 ${semesterLabel} 실무 프로젝트`,
      ];

      setCarouselGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          topicRows: group.topicRows.map(r =>
            r.id === rowId
              ? { ...r, isLoadingTopics: false, generatedTopics: newTopics, stage: 'topics_generated' }
              : r
          )
        }))
      );
      
      toast.success("새로운 프로젝트 주제가 생성되었습니다.");
    }, 1500);
  };

  const handleLockTopic = (rowId: number) => {
    setCarouselGroups(prevGroups =>
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row => {
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
      }))
    );
  };

  const handleDeleteTopic = (rowId: number) => {
    console.log("Deleting topic for row:", rowId);
    const semesterIndex = rowId - 1;
    
    setCarouselGroups(prevGroups =>
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row =>
          row.id === rowId
            ? {
                id: row.id,
                stage: 'initial',
                subject: semesterLabels[semesterIndex],
                concept: '프로젝트 주제',
                request: '',
                generatedTopics: [],
                isLoadingTopics: false,
                selectedTopic: null,
                researchMethods: [],
                isLoadingMethods: false,
                isLocked: false,
                topicType: '프로젝트 주제',
              }
            : row
        )
      }))
    );
    toast.warning("주제가 삭제되었습니다. 새로 검색해주세요.");
  };

  const handleRegenerateMethods = (rowId: number) => {
    const allRows = carouselGroups.flatMap(group => group.topicRows);
    const row = allRows.find(r => r.id === rowId);
    if (!row || !row.selectedTopic) return;
    
    console.log("Regenerating methods for row:", rowId);

    setCarouselGroups(prevGroups => 
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(r =>
          r.id === rowId ? { ...r, isLoadingMethods: true, researchMethods: [] } : r
        )
      }))
    );

    setTimeout(() => {
      const newMethods = generateMethods(row.selectedTopic!);
      setCarouselGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          topicRows: group.topicRows.map(r =>
            r.id === rowId ? { ...r, isLoadingMethods: false, researchMethods: newMethods } : r
          )
        }))
      );
      toast.success("탐구 방법이 새롭게 생성되었습니다.");
    }, 1500);
  };

  const handleTopicTypeChange = (rowId: number, topicType: string) => {
    setCarouselGroups(prevGroups =>
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row =>
          row.id === rowId ? { ...row, topicType } : row
        )
      }))
    );
    toast.info(`주제 유형이 '${topicType}'(으)로 변경되었습니다.`);
  };

  return {
    topicRows,
    carouselGroups,
    lockedTopics,
    selectedCareerSentence,
    setSelectedCareerSentence,
    followUpStates,
    handleAddRow,
    handleAddFollowUpRow,
    handleGenerate,
    handleSelectTopic,
    handleRefreshTopic,
    handleLockTopic,
    handleDeleteTopic,
    handleRegenerateMethods,
    handleTopicTypeChange,
    handleFollowUpChange,
  };
};
