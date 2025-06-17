
import { useState } from 'react';
import { TopicRow } from '@/types/index';
import { toast } from 'sonner';

interface CarouselGroup {
  id: number;
  topicRows: TopicRow[];
}

const generateMethods = (topic: string) => {
  return [
    `'${topic}'의 선행 연구 분석: 기존 연구의 한계점을 명확히 하고, 본 연구의 독창적 기여 지점을 구체화하는 방법론.`,
    `심층 인터뷰 및 설문조사 병행: 정량적 데이터와 정성적 데이터를 통합 분석하여, '${topic}'에 대한 다각적 이해를 도모하는 혼합 연구 설계.`,
    `파일럿 테스트 기반 실험 설계: 소규모 예비 실험을 통해 변수를 통제하고, 본 실험의 신뢰도와 타당도를 극대화하는 전략.`,
    `연구 윤리 고려사항: 연구 참여자의 권익 보호 및 데이터 보안을 위한 구체적인 프로토콜 제시.`
  ];
};

export const useTopicManager = () => {
  const [selectedCareerSentence, setSelectedCareerSentence] = useState<string | null>(null);
  const [carouselGroups, setCarouselGroups] = useState<CarouselGroup[]>([
    {
      id: 1,
      topicRows: [{
        id: 1,
        stage: 'initial',
        subject: '',
        concept: '',
        request: '',
        generatedTopics: [],
        isLoadingTopics: false,
        selectedTopic: null,
        researchMethods: [],
        isLoadingMethods: false,
        isLocked: false,
        topicType: '보고서 주제',
      }]
    }
  ]);
  const [lockedTopics, setLockedTopics] = useState<string[]>([]);
  const [followUpStates, setFollowUpStates] = useState<Record<number, boolean>>({ 1: false });

  // Get all topic rows flattened for compatibility
  const topicRows = carouselGroups.flatMap(group => group.topicRows);

  const handleFollowUpChange = (rowId: number, isChecked: boolean) => {
    setFollowUpStates(prev => ({
      ...prev,
      [rowId]: isChecked
    }));

    if (isChecked) {
      const allRows = carouselGroups.flatMap(group => group.topicRows);
      const rowIndex = allRows.findIndex(r => r.id === rowId);
      if (rowIndex > 0) {
        const previousRow = allRows[rowIndex - 1];
        if (previousRow.stage !== 'topic_selected' || !previousRow.selectedTopic) {
          toast.info("후속 탐구를 위해서는 이전 주제를 먼저 선택해야 합니다.");
        } else {
          toast.success(`'${previousRow.selectedTopic}'에 대한 후속 탐구를 준비합니다.`);
        }
      }
    }
  };

  const handleAddFollowUpRow = (groupId: number) => {
    const newId = Date.now();
    const newRow: TopicRow = {
      id: newId,
      stage: 'initial',
      subject: '',
      concept: '',
      request: '',
      generatedTopics: [],
      isLoadingTopics: false,
      selectedTopic: null,
      researchMethods: [],
      isLoadingMethods: false,
      isLocked: false,
      topicType: '보고서 주제',
    };

    // Find the specific carousel group by ID and add to it
    setCarouselGroups(prev => {
      const newGroups = prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            topicRows: [...group.topicRows, newRow]
          };
        }
        return group;
      });
      return newGroups;
    });

    setFollowUpStates(prev => ({ ...prev, [newId]: true }));
    toast.success("후속 심화 탐구가 추가되었습니다.");
  };

  const handleAddRow = () => {
    const newGroupId = Date.now();
    const newRowId = Date.now() + 1;
    
    const newGroup: CarouselGroup = {
      id: newGroupId,
      topicRows: [{
        id: newRowId,
        stage: 'initial',
        subject: '',
        concept: '',
        request: '',
        generatedTopics: [],
        isLoadingTopics: false,
        selectedTopic: null,
        researchMethods: [],
        isLoadingMethods: false,
        isLocked: false,
        topicType: '보고서 주제',
      }]
    };

    setCarouselGroups(prev => [...prev, newGroup]);
    setFollowUpStates(prev => ({ ...prev, [newRowId]: false }));
    toast.success("새로운 주제 생성기가 추가되었습니다.");
  };

  const handleGenerate = (rowId: number, inputs: { subject: string; concept: string; topicType: string; }) => {
    console.log("Generating topics for row:", rowId, "with inputs:", inputs);
    if (!selectedCareerSentence) {
      toast.warning("진로 문장을 먼저 생성하거나 선택해주세요.");
      return;
    }

    const allRows = carouselGroups.flatMap(group => group.topicRows);
    const rowIndex = allRows.findIndex(r => r.id === rowId);
    const isFollowUp = followUpStates[rowId];

    if (isFollowUp) {
      if (rowIndex > 0) {
        const previousRow = allRows[rowIndex - 1];
        if (previousRow.stage !== 'topic_selected' || !previousRow.selectedTopic) {
          toast.warning("이전 주제가 선택되지 않았습니다. 후속 탐구를 생성할 수 없습니다.");
          return;
        }
      } else {
        toast.warning("첫 주제는 후속 탐구가 될 수 없습니다.");
        return;
      }
    } else if (!inputs.subject && !inputs.concept) {
      toast.warning("교과 과목, 교과 개념 중 하나 이상을 입력해주세요.");
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
      let newTopics;
      if (isFollowUp && rowIndex > 0) {
        const previousTopic = allRows[rowIndex - 1].selectedTopic!;
        newTopics = [
          `'${previousTopic}'의 한계점을 보완하는 후속 연구`,
          `'${previousTopic}'의 방법론을 다른 사례에 적용하는 탐구`,
          `'${previousTopic}'에서 파생된 추가 질문에 대한 심화 탐구`,
        ];
      } else {
        newTopics = [
          `'${selectedCareerSentence}'을(를) 바탕으로, '${inputs.subject || '선택 과목'}'의 '${inputs.concept || '주요 개념'}'과(와) 연계한 탐구`,
          `'${inputs.concept || '주요 개념'}'을(를) '${selectedCareerSentence}'에 적용하여 문제 해결 방안을 모색하는 연구`,
          `'${selectedCareerSentence}'의 관점에서 '${inputs.subject || '선택 과목'}' 심화 탐구`,
        ];
      }

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

    // 기존 입력 정보를 바탕으로 새로운 주제 생성
    const inputs = {
      subject: row.subject,
      concept: row.concept,
      topicType: row.topicType
    };

    // 먼저 로딩 상태로 변경
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

    // 새로운 주제 생성
    setTimeout(() => {
      const rowIndex = allRows.findIndex(r => r.id === rowId);
      const isFollowUp = followUpStates[rowId];
      
      let newTopics;
      if (isFollowUp && rowIndex > 0) {
        const previousTopic = allRows[rowIndex - 1].selectedTopic!;
        newTopics = [
          `'${previousTopic}'의 다른 측면에서 접근하는 심화 탐구`,
          `'${previousTopic}'과 관련된 새로운 문제 발견 및 해결 방안 모색`,
          `'${previousTopic}'의 결과를 실제 현장에 적용하는 방안 연구`,
        ];
      } else {
        newTopics = [
          `'${selectedCareerSentence}'와 연계한 '${inputs.subject || '선택 과목'}'의 '${inputs.concept || '주요 개념'}' 심화 연구`,
          `'${inputs.concept || '주요 개념'}'의 실제 적용 사례를 '${selectedCareerSentence}' 관점에서 분석`,
          `'${selectedCareerSentence}' 실현을 위한 '${inputs.subject || '선택 과목'}' 기반 창의적 해결책 탐구`,
        ];
      }

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
      
      toast.success("기존 입력을 바탕으로 새로운 주제가 생성되었습니다.");
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
    setCarouselGroups(prevGroups =>
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row =>
          row.id === rowId
            ? {
                id: row.id,
                stage: 'initial',
                subject: '',
                concept: '',
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
      }))
    );
    setFollowUpStates(prev => ({ ...prev, [rowId]: false }));
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
