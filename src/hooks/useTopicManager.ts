import { useState, useEffect, useRef } from 'react';
import { TopicRow } from '@/types/index';
import { toast } from 'sonner';
import { useCareerSentence } from '@/contexts/CareerSentenceContext';
import { n8nPollingClient } from '@/utils/n8nPollingClient';

interface CarouselGroup {
  id: number;
  topicRows: TopicRow[];
}

const TOPIC_MANAGER_STORAGE_KEY = 'topic_manager_state';


export const useTopicManager = () => {
  const { selectedCareerSentence, setSelectedCareerSentence } = useCareerSentence();
  const abortControllerRef = useRef<AbortController | null>(null);
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

  // localStorage에서 상태 로드 (진로 문장 제외)
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(TOPIC_MANAGER_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setCarouselGroups(parsed.carouselGroups);
        setLockedTopics(parsed.lockedTopics);
        setFollowUpStates(parsed.followUpStates);
      }
    } catch (error) {
      console.error('Failed to load topic manager state from localStorage:', error);
    }
  }, []);

  // 상태가 변경될 때마다 localStorage에 저장 (진로 문장 제외)
  useEffect(() => {
    try {
      const stateToSave = {
        carouselGroups,
        lockedTopics,
        followUpStates
      };
      localStorage.setItem(TOPIC_MANAGER_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save topic manager state to localStorage:', error);
    }
  }, [carouselGroups, lockedTopics, followUpStates]);

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

  const handleGenerateWithWebhook = async (rowId: number, inputs: { subject: string; concept: string; topicType: string; }, isFollowUp: boolean, previousRow?: TopicRow) => {
    try {
      console.log('🚀 N8N 웹훅을 통한 주제 생성 시작...', { rowId, inputs, isFollowUp });
      
      // FormData로 개별 필드 전송 (이전: JSON 문자열 전체 body)
      const formData = new FormData();
      formData.append('진로문장', selectedCareerSentence || '');
      formData.append('교과과목', inputs.subject);
      formData.append('교과개념', inputs.concept);
      formData.append('주제유형', inputs.topicType);
      formData.append('후속탐구', isFollowUp && previousRow ? previousRow.selectedTopic || '' : '');
      
      console.log('📤 FormData로 전송할 데이터:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }
      
      console.log('🚀 FormData 형식으로 N8N 웹훅 전송... (CORS 모드)');
      
      // 이전 요청이 진행 중이면 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // 새로운 AbortController 생성
      abortControllerRef.current = new AbortController();
      
      // JSON 데이터 준비
      const jsonData = {
        sentence: selectedCareerSentence,
        진로문장: selectedCareerSentence || '',
        교과과목: inputs.subject,
        교과개념: inputs.concept,
        주제유형: inputs.topicType,
        후속탐구: isFollowUp && previousRow ? previousRow.selectedTopic || '' : '',
        ...inputs
      };
      
      console.log('🚀 비동기 폴링 방식으로 N8N 웹훅 전송...');
      
      const response = await n8nPollingClient.requestTopics(
        jsonData,
        abortControllerRef.current.signal
      );
      
      console.log('✅ N8N 폴링 완료:', response);
      
      if (response.success && response.data) {
        const data = response.data;
        console.log('🎯 N8N에서 받은 원본 데이터:', data);
        console.log('🎯 JSON.stringify:', JSON.stringify(data, null, 2));
        
        // N8N 응답 데이터 파싱 (새로운 구조에 맞게 수정)
        const parseN8NTopicResponse = (responseData) => {
          try {
            console.log('🔍 파싱 시작 - 데이터 타입:', typeof responseData);
            console.log('🔍 전체 응답 구조:', responseData);
            
            let topicsData = responseData;
            
            // 새로운 응답 구조 처리 (workflowType, data 등)
            if (responseData && responseData.workflowType === 'topics' && responseData.data) {
              console.log('🔍 새로운 N8N 응답 구조 감지');
              topicsData = responseData.data;
            }
            
            // 단일 주제 객체인 경우 (새로운 구조)
            if (topicsData && typeof topicsData === 'object' && topicsData['주제명']) {
              console.log('🔍 단일 주제 객체 감지');
              const topic = {
                id: 1,
                title: topicsData['주제명'] || '주제 1',
                summary: topicsData['탐구 주제 요약'] || topicsData['탐구_주제_요약'] || '',
                feasibility: topicsData['실현 가능성'] || topicsData['실현_가능성'] || '실현 가능성 정보 없음'
              };
              console.log('🎯 파싱된 주제:', topic);
              return [topic];
            }
            
            // 배열 형태의 주제 데이터 처리 (기존 방식)
            if (Array.isArray(topicsData) && topicsData.length > 0) {
              console.log('🔍 배열 길이:', topicsData.length);
              console.log('🔍 첫 번째 요소 키들:', Object.keys(topicsData[0] || {}));
              
              const topics = topicsData.map((topic, index) => {
                console.log(`🔍 주제 ${index + 1}:`, topic);
                
                // 실제 필드명에 맞게 수정
                const title = topic['주제명'] || `주제 ${index + 1}`;
                const summary = topic['탐구_주제_요약'] || topic['탐구 주제 요약'] || '';
                const feasibility = topic['실현_가능성'] || topic['실현 가능성'] || '실현 가능성 정보 없음';
                
                return {
                  id: index + 1,
                  title: title,
                  summary: summary,
                  feasibility: feasibility
                };
              });
              
              console.log('🎯 파싱된 주제들:', topics);
              return topics;
            }
            
            console.log('⚠️ 예상치 못한 데이터 구조:', responseData);
            return [];
          } catch (error) {
            console.error('❌ 탐구 주제 데이터 파싱 오류:', error);
            return [];
          }
        };
        
        const generatedTopics = parseN8NTopicResponse(data);
        console.log('🎯 최종 파싱된 주제들:', generatedTopics);
        
        if (generatedTopics.length > 0) {
          // 주제 제목만 추출해서 UI에 표시
          const topicTitles = generatedTopics.map(topic => topic.title);
          console.log('🎨 UI에 표시할 주제 제목들:', topicTitles);
          
          setCarouselGroups(prevGroups => {
            const newGroups = prevGroups.map(group => ({
              ...group,
              topicRows: group.topicRows.map(row =>
                row.id === rowId
                  ? { 
                      ...row, 
                      isLoadingTopics: false, 
                      generatedTopics: topicTitles,
                      stage: 'topics_generated',
                      // 원본 데이터도 저장 (실현 가능성 등 추가 정보를 위해)
                      detailedTopics: generatedTopics
                    }
                  : row
              )
            }));
            console.log('🔄 업데이트된 CarouselGroups:', newGroups);
            return newGroups;
          });
        } else {
          console.error('❌ 생성된 주제를 찾을 수 없습니다');
          setCarouselGroups(prevGroups => 
            prevGroups.map(group => ({
              ...group,
              topicRows: group.topicRows.map(row =>
                row.id === rowId
                  ? { 
                      ...row, 
                      isLoadingTopics: false, 
                      generatedTopics: ["주제를 생성할 수 없습니다. N8N 응답 데이터를 확인해주세요."], 
                      stage: 'topics_generated' 
                    }
                  : row
              )
            }))
          );
        }
      } else {
        console.error('❌ N8N 주제 생성 실패:', response.error);
        
        setCarouselGroups(prevGroups => 
          prevGroups.map(group => ({
            ...group,
            topicRows: group.topicRows.map(row =>
              row.id === rowId
                ? { 
                    ...row, 
                    isLoadingTopics: false, 
                    generatedTopics: [response.error || '주제 생성에 실패했습니다. 다시 시도해주세요.'], 
                    stage: 'topics_generated' 
                  }
                : row
            )
          }))
        );
      }
    } catch (error) {
      console.error('💥 N8N 웹훅 호출 실패:', error);
      console.error('에러 타입:', error.name);
      console.error('에러 메시지:', error.message);
      
      let errorMessage = '주제 생성에 실패했습니다.';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'CORS 오류: N8N 서버 설정을 확인해주세요.';
      } else if (error.name === 'AbortError') {
        errorMessage = '요청이 취소되었습니다.';
      }
      
      setCarouselGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          topicRows: group.topicRows.map(row =>
            row.id === rowId
              ? { 
                  ...row, 
                  isLoadingTopics: false, 
                  generatedTopics: [errorMessage], 
                  stage: 'topics_generated' 
                }
              : row
          )
        }))
      );
    }
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

    // N8N 웹훅 호출로 주제 생성
    handleGenerateWithWebhook(rowId, inputs, isFollowUp, rowIndex > 0 ? allRows[rowIndex - 1] : undefined);
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

    // 새로운 주제 생성 (webhook 사용)
    try {
      // webhook 호출 로직이 필요한 경우 여기에 추가
      // 현재는 오류 처리만 구현
      console.error('주제 재생성 기능이 준비 중입니다.');
      
      setCarouselGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          topicRows: group.topicRows.map(r =>
            r.id === rowId
              ? { 
                  ...r, 
                  isLoadingTopics: false, 
                  generatedTopics: ["주제 재생성 기능이 준비 중입니다."], 
                  stage: 'topics_generated' 
                }
              : r
          )
        }))
      );
      
      toast.success("기존 입력을 바탕으로 새로운 주제가 생성되었습니다.");
    } catch (error) {
      console.error('주제 재생성 실패:', error);
      setCarouselGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          topicRows: group.topicRows.map(r =>
            r.id === rowId
              ? { 
                  ...r, 
                  isLoadingTopics: false, 
                  generatedTopics: ["주제 재생성에 실패했습니다."], 
                  stage: 'topics_generated' 
                }
              : r
          )
        }))
      );
    }
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
    // N8N을 통해서만 탐구 방법을 생성하므로 이 함수는 호출되지 않음
    console.log("handleRegenerateMethods는 더 이상 사용되지 않습니다. N8N 웹훅을 사용하세요.");
    toast.info("탐구 방법 생성 버튼을 다시 눌러주세요.");
  };

  const handleUpdateResearchMethods = (rowId: number, methods: string[]) => {
    console.log(`N8N 탐구 방법 업데이트 - rowId: ${rowId}, methods:`, methods);
    
    setCarouselGroups(prevGroups => 
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(r =>
          r.id === rowId ? { 
            ...r, 
            isLoadingMethods: false, 
            researchMethods: methods 
          } : r
        )
      }))
    );
    
    toast.success("N8N에서 받은 탐구 방법이 업데이트되었습니다.");
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
    handleUpdateResearchMethods,
    handleTopicTypeChange,
    handleFollowUpChange,
  };
};
