import { useState, useEffect, useRef } from 'react';
import { TopicRow } from '@/types/index';
import { toast } from 'sonner';
import { useCareerSentence } from '@/contexts/CareerSentenceContext';
import { n8nPollingClient } from '@/utils/n8nPollingClient';
import { useAuth } from '@/contexts/AuthContext';

interface CarouselGroup {
  id: number;
  topicRows: TopicRow[];
}

const TOPIC_MANAGER_STORAGE_KEY = 'topic_manager_state';


export const useTopicManager = () => {
  const { selectedCareerSentence, setSelectedCareerSentence } = useCareerSentence();
  const { user } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        showResearchMethods: false,
        isLocked: false,
        topicType: '보고서 주제',
      }]
    }
  ]);
  const [lockedTopics, setLockedTopics] = useState<string[]>([]);
  const [followUpStates, setFollowUpStates] = useState<Record<number, boolean>>({ 1: false });

  // localStorage에서만 상태 로드
  const loadFromLocalStorage = () => {
    try {
      const savedState = localStorage.getItem(TOPIC_MANAGER_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.carouselGroups) setCarouselGroups(parsed.carouselGroups);
        if (parsed.lockedTopics) setLockedTopics(parsed.lockedTopics);
        if (parsed.followUpStates) setFollowUpStates(parsed.followUpStates);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    setIsLoading(false);
  };

  // 컴포넌트 마운트 시 localStorage에서 로드
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // localStorage에만 저장 (디바운스 적용)
  const saveToLocalStorageRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (isLoading) return;

    // 디바운스: 1초 후 저장
    clearTimeout(saveToLocalStorageRef.current);
    saveToLocalStorageRef.current = setTimeout(() => {
      try {
        const stateToSave = {
          carouselGroups,
          lockedTopics,
          followUpStates
        };
        localStorage.setItem(TOPIC_MANAGER_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }, 1000);

    // 클린업
    return () => {
      clearTimeout(saveToLocalStorageRef.current);
    };
  }, [carouselGroups, lockedTopics, followUpStates, isLoading]);

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
      showResearchMethods: false,
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

      const group = newGroups.find(g => g.id === groupId);
      if (group && group.topicRows.length > 1) {
        setFollowUpStates(prevStates => ({
          ...prevStates,
          [newId]: true
        }));
      }

      return newGroups;
    });

    toast.success("새로운 탐구 주제가 추가되었습니다.");
  };

  const handleGoBackToInput = (id: number) => {
    const updateRow = (rows: TopicRow[]) => {
      return rows.map(row => {
        if (row.id === id) {
          return {
            ...row,
            stage: 'initial',
            generatedTopics: [],
            selectedTopic: null,
            researchMethods: [],
            showResearchMethods: false,
          };
        }
        return row;
      });
    };

    setCarouselGroups(prev => 
      prev.map(group => ({
        ...group,
        topicRows: updateRow(group.topicRows)
      }))
    );

    toast.info("주제 생성 화면으로 돌아갑니다.");
  };

  const handleGenerate = async (id: number, inputs: { subject: string; concept: string; topicType: string }) => {
    if (!selectedCareerSentence) {
      toast.error("먼저 진로 문장을 선택해주세요.");
      return;
    }

    const updateRow = (rows: TopicRow[], updates: Partial<TopicRow>) => {
      return rows.map(row => row.id === id ? { ...row, ...updates } : row);
    };

    try {
      setCarouselGroups(prev => 
        prev.map(group => ({
          ...group,
          topicRows: updateRow(group.topicRows, { 
            ...inputs, 
            request: selectedCareerSentence,
            stage: 'topics_loading',
            isLoadingTopics: true 
          })
        }))
      );

      const requestData = {
        careerSentence: selectedCareerSentence,
        subject: inputs.subject,
        concept: inputs.concept,
        topicType: inputs.topicType || '보고서 주제',
      };

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const result = await n8nPollingClient.requestTopics(
        requestData,
        abortControllerRef.current.signal
      );

      if (result.success && result.data) {
        const parsedTopics = result.data.topics || [];
        setCarouselGroups(prev => 
          prev.map(group => ({
            ...group,
            topicRows: updateRow(group.topicRows, { 
              generatedTopics: parsedTopics,
              stage: 'topics_generated',
              isLoadingTopics: false 
            })
          }))
        );
        toast.success("주제가 성공적으로 생성되었습니다!");
      } else {
        throw new Error(result.error || '주제 생성에 실패했습니다');
      }
    } catch (error: any) {
      console.error('주제 생성 실패:', error);
      if (error.name === 'AbortError') {
        console.log('주제 생성이 취소되었습니다');
      } else {
        toast.error(`주제 생성 실패: ${error.message}`);
      }
      setCarouselGroups(prev => 
        prev.map(group => ({
          ...group,
          topicRows: updateRow(group.topicRows, { 
            stage: 'initial',
            isLoadingTopics: false 
          })
        }))
      );
    }
  };

  const handleSelectTopic = async (id: number, topic: string) => {
    const updateRow = (rows: TopicRow[], updates: Partial<TopicRow>) => {
      return rows.map(row => row.id === id ? { ...row, ...updates } : row);
    };

    setCarouselGroups(prev => 
      prev.map(group => ({
        ...group,
        topicRows: updateRow(group.topicRows, { 
          selectedTopic: topic,
          stage: 'research_methods_loading',
          isLoadingMethods: true 
        })
      }))
    );
    toast.success(`"${topic}" 주제를 선택했습니다.`);

    const currentRow = topicRows.find(row => row.id === id);
    if (!currentRow) return;

    const previousRowId = followUpStates[id] 
      ? topicRows[topicRows.findIndex(row => row.id === id) - 1]?.id 
      : null;

    try {
      const requestData = {
        topic,
        subject: currentRow.subject,
        concept: currentRow.concept,
        previousTopicId: previousRowId,
      };

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const result = await n8nPollingClient.requestResearchMethods(
        requestData,
        abortControllerRef.current.signal
      );

      if (result.success && result.data) {
        console.log('🔍 탐구 방법 응답:', result.data);
        const methods = Array.isArray(result.data) 
          ? result.data 
          : result.data.methods || [];
        setCarouselGroups(prev => 
          prev.map(group => ({
            ...group,
            topicRows: updateRow(group.topicRows, { 
              researchMethods: methods,
              stage: 'research_methods_generated',
              isLoadingMethods: false 
            })
          }))
        );
        toast.success("탐구 방법이 성공적으로 생성되었습니다!");
      } else {
        throw new Error(result.error || '탐구 방법 생성에 실패했습니다');
      }
    } catch (error: any) {
      console.error('탐구 방법 생성 실패:', error);
      if (error.name === 'AbortError') {
        console.log('탐구 방법 생성이 취소되었습니다');
      } else {
        toast.error(`탐구 방법 생성 실패: ${error.message}`);
      }
      setCarouselGroups(prev => 
        prev.map(group => ({
          ...group,
          topicRows: updateRow(group.topicRows, { 
            stage: 'topic_selected',
            isLoadingMethods: false 
          })
        }))
      );
    }
  };

  const handleRefreshTopic = (id: number) => {
    handleGenerate(id, topicRows.find(row => row.id === id)!);
    toast.info("주제를 다시 생성합니다...");
  };

  const handleLockTopic = (id: number) => {
    const topic = topicRows.find(row => row.id === id)?.selectedTopic;
    if (topic) {
      setLockedTopics(prev => 
        prev.includes(topic) 
          ? prev.filter(t => t !== topic)
          : [...prev, topic]
      );
      
      const isLocked = lockedTopics.includes(topic);
      setCarouselGroups(prev => 
        prev.map(group => ({
          ...group,
          topicRows: group.topicRows.map(row => 
            row.id === id ? { ...row, isLocked: !isLocked } : row
          )
        }))
      );
      
      toast(isLocked ? "주제 잠금이 해제되었습니다." : "주제가 잠금되었습니다.");
    }
  };

  const handleDeleteTopic = (id: number) => {
    setCarouselGroups(prev => {
      const newGroups = prev.map(group => ({
        ...group,
        topicRows: group.topicRows.filter(row => row.id !== id)
      })).filter(group => group.topicRows.length > 0);

      if (newGroups.length === 0) {
        return [{
          id: Date.now(),
          topicRows: [{
            id: Date.now(),
            stage: 'initial',
            subject: '',
            concept: '',
            request: '',
            generatedTopics: [],
            isLoadingTopics: false,
            selectedTopic: null,
            researchMethods: [],
            isLoadingMethods: false,
            showResearchMethods: false,
            isLocked: false,
            topicType: '보고서 주제',
          }]
        }];
      }

      return newGroups;
    });

    setFollowUpStates(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    toast.info("주제가 삭제되었습니다.");
  };

  const handleRegenerateMethods = (id: number) => {
    const topic = topicRows.find(row => row.id === id)?.selectedTopic;
    if (topic) {
      handleSelectTopic(id, topic);
      toast.info("탐구 방법을 다시 생성합니다...");
    }
  };

  const handleUpdateResearchMethods = (id: number, methods: string[]) => {
    setCarouselGroups(prev => 
      prev.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row => 
          row.id === id ? { ...row, researchMethods: methods } : row
        )
      }))
    );
  };

  const handleTopicTypeChange = (id: number, type: string) => {
    setCarouselGroups(prev => 
      prev.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row => 
          row.id === id ? { ...row, topicType: type } : row
        )
      }))
    );
  };

  const handleShowResearchMethods = (id: number) => {
    setCarouselGroups(prev => 
      prev.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row => 
          row.id === id ? { ...row, showResearchMethods: true } : row
        )
      }))
    );
  };

  const handleAddRow = () => {
    const newCarouselId = Date.now();
    const newRowId = Date.now() + 1;
    
    setCarouselGroups(prev => [...prev, {
      id: newCarouselId,
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
        showResearchMethods: false,
        isLocked: false,
        topicType: '보고서 주제',
      }]
    }]);

    setFollowUpStates(prev => ({
      ...prev,
      [newRowId]: false
    }));
  };

  return {
    topicRows,
    carouselGroups,
    followUpStates,
    selectedCareerSentence,
    setSelectedCareerSentence,
    handleAddRow,
    handleAddFollowUpRow,
    handleGenerate,
    handleSelectTopic,
    handleRefreshTopic,
    handleLockTopic,
    handleDeleteTopic,
    handleRegenerateMethods,
    handleUpdateResearchMethods,
    handleTopicTypeChange,
    handleShowResearchMethods,
    handleGoBackToInput,
    handleFollowUpChange
  };
};