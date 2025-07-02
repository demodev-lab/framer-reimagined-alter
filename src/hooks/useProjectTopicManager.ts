
import { useState, useEffect } from 'react';
import { TopicRow } from '@/types/index';
import { toast } from 'sonner';
import { DetailedProjectInfo } from '@/types/projectTypes';

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
  "1학년 1학기 프로젝트",
  "1학년 2학기 프로젝트", 
  "2학년 1학기 프로젝트",
  "2학년 2학기 프로젝트",
  "3학년 1학기 프로젝트"
];

// 진로 문장을 바탕으로 학기별 프로젝트 주제를 생성하는 함수
const generateProjectTopicsFromCareer = (careerSentence: string) => {
  return [
    `'${careerSentence}' 달성을 위한 1학년 기초 소양 프로젝트: 진로 탐색과 기본 역량 개발`,
    `'${careerSentence}' 실현을 위한 1학년 심화 프로젝트: 관련 분야 기초 이론 연구와 실습`,
    `'${careerSentence}' 목표 달성을 위한 2학년 전문성 개발 프로젝트: 핵심 역량 강화와 실무 경험`,
    `'${careerSentence}' 구현을 위한 2학년 융합 프로젝트: 다학제적 접근과 창의적 문제 해결`,
    `'${careerSentence}' 완성을 위한 3학년 종합 프로젝트: 전문성 통합과 실제 적용`
  ];
};

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

  // n8n 웹훅 응답으로 상세 프로젝트 정보 업데이트
  const handleUpdateTopicsFromWebhook = (detailedProjects: DetailedProjectInfo[]) => {
    console.log("=== handleUpdateTopicsFromWebhook 호출됨 ===");
    console.log("받은 detailedProjects:", detailedProjects);
    console.log("detailedProjects 길이:", detailedProjects.length);
    console.log("현재 carouselGroups 상태:", carouselGroups);
    
    if (!detailedProjects || detailedProjects.length === 0) {
      console.error("❌ 빈 프로젝트 데이터:", detailedProjects);
      toast.error("웹훅에서 받은 프로젝트 데이터가 비어있습니다.");
      return;
    }

    setCarouselGroups(prevGroups => {
      console.log("=== 상태 업데이트 시작 ===");
      console.log("이전 groups:", prevGroups);
      
      const updatedGroups = prevGroups.map(group => {
        console.log(`Group ${group.id} 처리 중, topicRows 길이:`, group.topicRows.length);
        
        return {
          ...group,
          topicRows: group.topicRows.map((row, index) => {
            const projectInfo = detailedProjects[index];
            console.log(`Row ${index} (ID: ${row.id}) 업데이트:`, {
              기존: row.selectedTopic,
              새로운데이터: projectInfo,
              새주제명: projectInfo?.주제명
            });
            
            const updatedRow = {
              ...row,
              isLoadingTopics: false,
              selectedTopic: projectInfo?.주제명 || `주제 ${index + 1} (데이터 부족)`,
              stage: 'topic_selected' as const,
              // 상세 정보 추가
              detailedProjectInfo: projectInfo ? {
                사전_조사: projectInfo.사전_조사,
                핵심_활동: projectInfo.핵심_활동,
                연관_교과목: projectInfo.연관_교과목,
                사용_도구: projectInfo.사용_도구
              } : undefined
            };
            
            console.log(`Row ${index} 업데이트 완료:`, updatedRow);
            return updatedRow;
          })
        };
      });
      
      console.log("=== 상태 업데이트 완료 ===");
      console.log("업데이트된 groups:", updatedGroups);
      return updatedGroups;
    });
    
    toast.success("AI가 생성한 상세 프로젝트 가이드라인이 업데이트되었습니다.");
  };

  // 전체 프로젝트 주제 재생성 (목업 데이터 사용)
  const handleRegenerateAllTopics = () => {
    if (!selectedCareerSentence) {
      toast.warning("진로 문장을 먼저 생성하거나 선택해주세요.");
      return;
    }

    console.log("Regenerating all project topics with career sentence:", selectedCareerSentence);
    
    // 모든 토픽 로딩 상태로 설정
    setCarouselGroups(prevGroups => 
      prevGroups.map(group => ({
        ...group,
        topicRows: group.topicRows.map(row => ({
          ...row,
          isLoadingTopics: true,
          selectedTopic: null,
          researchMethods: [],
          isLoadingMethods: false,
          stage: 'initial'
        }))
      }))
    );

    setTimeout(() => {
      const generatedTopics = generateProjectTopicsFromCareer(selectedCareerSentence);
      
      setCarouselGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          topicRows: group.topicRows.map((row, index) => ({
            ...row,
            isLoadingTopics: false,
            selectedTopic: generatedTopics[index],
            stage: 'topic_selected'
          }))
        }))
      );
      
      toast.success("전체 프로젝트 주제가 새롭게 생성되었습니다.");
    }, 2000);
  };

  const handleGenerate = (rowId: number, inputs: { subject: string; concept: string; topicType: string; }) => {
    // 개별 생성이 아닌 전체 생성으로 변경됨 - handleRegenerateAllTopics 사용
    handleRegenerateAllTopics();
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
    // 개별 주제 재생성 대신 전체 재생성 사용
    handleRegenerateAllTopics();
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
    handleRegenerateAllTopics,
    handleUpdateTopicsFromWebhook,
  };
};
