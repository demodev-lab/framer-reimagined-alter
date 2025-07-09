
import React, { useState } from 'react';
import { TopicRow } from '@/types';
import { DetailedProjectInfo } from '@/types/projectTypes';
import CareerSentenceSection from './CareerSentenceSection';
import CareerSentenceDialog from './CareerSentenceDialog';
import ProjectTopicCarousel from './ProjectTopicCarousel';

interface CarouselGroup {
  id: number;
  topicRows: TopicRow[];
}

interface ProjectTopicGeneratorSectionProps {
  topicRows: TopicRow[];
  carouselGroups: CarouselGroup[];
  followUpStates: Record<number, boolean>;
  handleAddRow: () => void;
  handleAddFollowUpRow: (groupId: number) => void;
  handleGenerate: (id: number, inputs: {
    subject: string;
    concept: string;
    topicType: string;
  }) => void;
  handleSelectTopic: (id: number, topic: string) => void;
  handleRefreshTopic: (id: number) => void;
  handleLockTopic: (id: number) => void;
  handleDeleteTopic: (id: number) => void;
  handleRegenerateMethods: (id: number) => void;
  handleTopicTypeChange: (id: number, type: string) => void;
  handleFollowUpChange: (id: number, checked: boolean) => void;
  handleRegenerateAllTopics: () => void;
  handleUpdateTopicsFromWebhook: (detailedProjects: DetailedProjectInfo[]) => void;
  selectedCareerSentence?: string | null;
  setSelectedCareerSentence: (sentence: string) => void;
}

const ProjectTopicGeneratorSection: React.FC<ProjectTopicGeneratorSectionProps> = ({
  carouselGroups,
  handleAddRow,
  handleAddFollowUpRow,
  handleGenerate,
  handleSelectTopic,
  handleRefreshTopic,
  handleLockTopic,
  handleDeleteTopic,
  handleRegenerateMethods,
  handleTopicTypeChange,
  followUpStates,
  handleFollowUpChange,
  handleRegenerateAllTopics,
  handleUpdateTopicsFromWebhook,
  selectedCareerSentence,
  setSelectedCareerSentence
}) => {
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isGeneratingCareerSentence, setIsGeneratingCareerSentence] = useState(false);

  const handleRegenerateCareerSentence = () => {
    console.log("Career sentence regeneration requested");
    setShowRegenerateDialog(true);
  };

  const handleCareerSentenceGenerate = async (data: {
    careerField: string;
    activity: string;
    file: File | null;
    aspiration: string;
  }) => {
    console.log("Career sentence generated:", data);
    setIsGeneratingCareerSentence(true);
    setGeneratedCareerSentences([]);
    
    // 입력 데이터 검증 (프로젝트)
    console.log('🔍 입력 데이터 검증 (프로젝트):', data);
    
    if (!data.careerField || !data.careerField.trim()) {
      console.error('❌ 직업 필드가 비어있습니다 (프로젝트).');
      setGeneratedCareerSentences(["직업을 입력해주세요."]);
      setIsGeneratingCareerSentence(false);
      return;
    }
    
    if (!data.activity || !data.activity.trim()) {
      console.error('❌ 요청사항 필드가 비어있습니다 (프로젝트).');
      setGeneratedCareerSentences(["요청사항을 선택해주세요."]);
      setIsGeneratingCareerSentence(false);
      return;
    }
    
    // 요청사항이 '직업을 가진 후 하고 싶은 것이 있습니다.'인 경우 추가 입력 확인
    if (data.activity === '직업을 가진 후 하고 싶은 것이 있습니다.' && (!data.aspiration || !data.aspiration.trim())) {
      console.error('❌ 추가 입력 필드가 비어있습니다 (프로젝트).');
      setGeneratedCareerSentences(["직업을 가진 후 하고 싶은 것을 구체적으로 입력해주세요."]);
      setIsGeneratingCareerSentence(false);
      return;
    }
    
    console.log('✅ 입력 데이터 검증 통과 (프로젝트)');
    
    try {
      const webhookData = {
        careerField: data.careerField,
        request: data.activity,
        aspiration: data.activity === '직업을 가진 후 하고 싶은 것이 있습니다.' ? data.aspiration : null
      };
      
      console.log('🚀 진로 문장 생성 요청 시작 (프로젝트)...');
      
      const response = await fetch('https://songssam.demodev.io/webhook/dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Connection': 'keep-alive'
        },
        body: JSON.stringify(webhookData),
        keepalive: true,
        mode: 'cors',
        redirect: 'follow'
        // signal 제거 - 브라우저 자체 타임아웃도 방지
      });
      
      console.log('✅ 웹훅 응답 수신 (프로젝트):', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎯 N8N이 전달한 원본 데이터 (프로젝트):', data);
        console.log('🎯 JSON.stringify (프로젝트):', JSON.stringify(data, null, 2));
        
        // N8N이 전달한 데이터를 그대로 문자열로 변환해서 표시
        let resultText = '';
        
        if (typeof data === 'string') {
          resultText = data;
        } else if (data && typeof data === 'object') {
          const allValues = [];
          const extractValues = (obj) => {
            if (typeof obj === 'string' && obj.trim()) {
              allValues.push(obj.trim());
            } else if (obj && typeof obj === 'object') {
              Object.values(obj).forEach(extractValues);
            }
          };
          extractValues(data);
          
          console.log('🎯 추출된 모든 문자열 값들 (프로젝트):', allValues);
          
          if (allValues.length > 0) {
            resultText = allValues.reduce((longest, current) => 
              current.length > longest.length ? current : longest
            );
          }
        }
        
        console.log('🎯 최종 선택된 텍스트 (프로젝트):', resultText);
        
        if (resultText) {
          setGeneratedCareerSentences([resultText]);
        } else {
          console.error('❌ 사용 가능한 텍스트를 찾을 수 없습니다 (프로젝트)');
          setGeneratedCareerSentences(["텍스트를 추출할 수 없습니다. N8N 응답을 확인해주세요."]);
        }
      } else {
        console.error('❌ HTTP 응답 오류 (프로젝트):', response.status, response.statusText);
        const errorText = await response.text().catch(() => '응답 내용 없음');
        console.error('응답 내용 (프로젝트):', errorText);
        setGeneratedCareerSentences([`서버 오류 (${response.status}): 잠시 후 다시 시도해주세요.`]);
      }
    } catch (error) {
      console.error('💥 Webhook 호출 실패 (프로젝트):', error);
      console.error('에러 타입 (프로젝트):', error.name);
      console.error('에러 메시지 (프로젝트):', error.message);
      
      if (error.name === 'AbortError') {
        console.log('⏹️ 요청이 사용자에 의해 취소되었습니다 (프로젝트).');
        setGeneratedCareerSentences(["요청이 취소되었습니다."]);
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🌐 네트워크 연결 오류 감지 (프로젝트)');
        setGeneratedCareerSentences(["네트워크 연결을 확인해주세요."]);
      } else {
        console.error('🔥 예상치 못한 에러 (프로젝트):', error);
        setGeneratedCareerSentences([`오류: ${error.message || '알 수 없는 오류가 발생했습니다.'}`]);
      }
    }
    
    setIsGeneratingCareerSentence(false);
  };

  const handleSelectCareerSentence = (sentence: string) => {
    setShowRegenerateDialog(false);
    setSelectedCareerSentence(sentence);
    
    // 진로 문장이 선택되면 자동으로 모든 프로젝트 주제 생성
    setTimeout(() => {
      handleRegenerateAllTopics();
    }, 500);
  };

  return (
    <>
      <section className="flex flex-col items-center pb-8">
        <div className="w-full max-w-7xl mx-auto px-4">
          {/* 진로 문장 생성 다이얼로그를 먼저 표시 */}
          {!selectedCareerSentence && (
            <div className="text-center mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">진로 문장을 먼저 생성해주세요</h3>
              <button
                onClick={handleRegenerateCareerSentence}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                진로 문장 생성하기
              </button>
            </div>
          )}

          {/* 선택된 진로 문장 표시 */}
          <CareerSentenceSection 
            selectedCareerSentence={selectedCareerSentence} 
            onRegenerateCareerSentence={handleRegenerateCareerSentence} 
          />

          {/* 캐러셀 표시 */}
          <div className="space-y-8">
            {carouselGroups.map(group => (
              <ProjectTopicCarousel 
                key={group.id} 
                group={group} 
                followUpStates={followUpStates} 
                selectedCareerSentence={selectedCareerSentence} 
                onGenerate={handleGenerate} 
                onSelectTopic={handleSelectTopic} 
                onRefreshTopic={handleRefreshTopic} 
                onLockTopic={handleLockTopic} 
                onDeleteTopic={handleDeleteTopic} 
                onRegenerateMethods={handleRegenerateMethods} 
                onTopicTypeChange={handleTopicTypeChange} 
                onFollowUpChange={handleFollowUpChange} 
                onCareerSentenceSelect={setSelectedCareerSentence} 
                onAddFollowUpRow={handleAddFollowUpRow}
                onRegenerateAllTopics={handleRegenerateAllTopics}
                onUpdateTopicsFromWebhook={handleUpdateTopicsFromWebhook}
              />
            ))}
          </div>
        </div>
      </section>

      <CareerSentenceDialog 
        open={showRegenerateDialog} 
        onOpenChange={setShowRegenerateDialog} 
        generatedCareerSentences={generatedCareerSentences} 
        isGeneratingCareerSentence={isGeneratingCareerSentence} 
        onGenerate={handleCareerSentenceGenerate} 
        onSelectCareerSentence={handleSelectCareerSentence} 
      />
    </>
  );
};

export default ProjectTopicGeneratorSection;
