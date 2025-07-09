
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive } from 'lucide-react';
import { TopicRow } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import CareerSentenceSection from './CareerSentenceSection';
import CareerSentenceDialog from './CareerSentenceDialog';
import TopicCarousel from './TopicCarousel';

interface CarouselGroup {
  id: number;
  topicRows: TopicRow[];
}

interface TopicGeneratorSectionProps {
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
  selectedCareerSentence?: string | null;
  setSelectedCareerSentence: (sentence: string) => void;
}

const TopicGeneratorSection: React.FC<TopicGeneratorSectionProps> = ({
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
  selectedCareerSentence,
  setSelectedCareerSentence
}) => {
  const navigate = useNavigate();
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
    
    try {
      const webhookData = {
        careerField: data.careerField,
        request: data.activity,
        aspiration: data.activity === '직업을 가진 후 하고 싶은 것이 있습니다.' ? data.aspiration : null
      };
      
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
        keepalive: true,  // 무제한 대기 설정
        mode: 'cors',
        redirect: 'follow'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎯 N8N이 전달한 원본 데이터 (TopicGeneratorSection):', data);
        console.log('🎯 JSON.stringify (TopicGeneratorSection):', JSON.stringify(data, null, 2));
        
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
          
          console.log('🎯 추출된 모든 문자열 값들 (TopicGeneratorSection):', allValues);
          
          if (allValues.length > 0) {
            resultText = allValues.reduce((longest, current) => 
              current.length > longest.length ? current : longest
            );
          }
        }
        
        console.log('🎯 최종 선택된 텍스트 (TopicGeneratorSection):', resultText);
        
        if (resultText) {
          setGeneratedCareerSentences([resultText]);
        } else {
          console.error('❌ 사용 가능한 텍스트를 찾을 수 없습니다 (TopicGeneratorSection)');
          setGeneratedCareerSentences(["텍스트를 추출할 수 없습니다. N8N 응답을 확인해주세요."]);
        }
      } else {
        setGeneratedCareerSentences(["오류가 발생했습니다. 다시 시도해주세요."]);
      }
    } catch (error) {
      console.error('Webhook 호출 실패:', error);
      setGeneratedCareerSentences(["오류가 발생했습니다. 다시 시도해주세요."]);
    }
    
    setIsGeneratingCareerSentence(false);
  };

  const handleSelectCareerSentence = (sentence: string) => {
    setShowRegenerateDialog(false);
    setSelectedCareerSentence(sentence);
  };

  const handleGoToArchive = () => {
    navigate('/archive');
  };

  return (
    <>
      <section className="flex flex-col items-center pb-8">
        <div className="w-full max-w-7xl mx-auto px-4">
          <CareerSentenceSection 
            selectedCareerSentence={selectedCareerSentence} 
            onRegenerateCareerSentence={handleRegenerateCareerSentence} 
          />

          <div className="space-y-8">
            {carouselGroups.map(group => (
              <TopicCarousel 
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
                onOpenCareerSentenceDialog={handleRegenerateCareerSentence}
              />
            ))}
          </div>

          {/* 보관함 이동 버튼 */}
          <div className="flex justify-center mt-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleGoToArchive}
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                >
                  <Archive className="h-4 w-4" />
                  보관함으로 이동
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>저장된 주제들을 관리하세요</p>
              </TooltipContent>
            </Tooltip>
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

export default TopicGeneratorSection;
