import React, { useState, useRef } from 'react';
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";
import { n8nPollingClient } from "@/utils/n8nPollingClient";

interface CareerSentenceGeneratorSectionProps {
  onSelectCareerSentence: (sentence: string | null) => void;
}

const CareerSentenceGeneratorSection: React.FC<CareerSentenceGeneratorSectionProps> = ({ onSelectCareerSentence }) => {
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isCareerSentenceLoading, setIsCareerSentenceLoading] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGenerateCareerSentence = async (inputs: { careerField: string; activity: string; file: File | null; aspiration: string; }, webhookResponse?: string[]) => {
    onSelectCareerSentence(null);
    setIsCareerSentenceLoading(true);
    setGeneratedCareerSentences([]);
    setCurrentJobId(null);
    
    // 입력 데이터 검증
    console.log('🔍 입력 데이터 검증:', inputs);
    
    if (!inputs.careerField || !inputs.careerField.trim()) {
      console.error('❌ 직업 필드가 비어있습니다.');
      setGeneratedCareerSentences(["직업을 입력해주세요."]);
      setIsCareerSentenceLoading(false);
      return;
    }
    
    if (!inputs.activity || !inputs.activity.trim()) {
      console.error('❌ 요청사항 필드가 비어있습니다.');
      setGeneratedCareerSentences(["요청사항을 선택해주세요."]);
      setIsCareerSentenceLoading(false);
      return;
    }
    
    // 요청사항이 '직업을 가진 후 하고 싶은 것이 있습니다.'인 경우 추가 입력 확인
    if (inputs.activity === '직업을 가진 후 하고 싶은 것이 있습니다.' && (!inputs.aspiration || !inputs.aspiration.trim())) {
      console.error('❌ 추가 입력 필드가 비어있습니다.');
      setGeneratedCareerSentences(["직업을 가진 후 하고 싶은 것을 구체적으로 입력해주세요."]);
      setIsCareerSentenceLoading(false);
      return;
    }
    
    console.log('✅ 입력 데이터 검증 통과');
    
    // 이전 요청이 진행 중이면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();
    
    // Always make API call (no webhook response is passed anymore)
    try {
      const webhookData = {
        careerField: inputs.careerField,
        request: inputs.activity,
        aspiration: inputs.activity === '직업을 가진 후 하고 싶은 것이 있습니다.' ? inputs.aspiration : null
      };
      
      console.log('🚀 진로 문장 생성 요청 시작 (비동기 폴링)...');
      
      // 폴링하는 동안 로딩 메시지 업데이트
      const updateLoadingMessage = () => {
        const messages = [
          "진로 문장을 생성하고 있습니다...",
          "AI가 열심히 작업 중입니다...",
          "조금만 더 기다려주세요...",
          "거의 완성되었습니다..."
        ];
        let messageIndex = 0;
        
        const interval = setInterval(() => {
          if (!isCareerSentenceLoading) {
            clearInterval(interval);
            return;
          }
          messageIndex = (messageIndex + 1) % messages.length;
        }, 3000);
        
        return () => clearInterval(interval);
      };
      
      const cleanup = updateLoadingMessage();
      
      const response = await n8nPollingClient.requestCareerSentence(
        webhookData,
        abortControllerRef.current.signal
      );
      
      cleanup();
      
      if (response.success && response.data) {
        console.log('✅ 진로 문장 생성 완료');
        console.log('🎯 Job ID:', response.jobId);
        console.log('🎯 최종 결과:', response.data);
        
        setCurrentJobId(response.jobId || null);
        setGeneratedCareerSentences([response.data]);
      } else {
        console.error('❌ 진로 문장 생성 실패:', response.error);
        
        // 에러 메시지를 더 사용자 친화적으로 변경
        let errorMessage = response.error || '진로 문장 생성에 실패했습니다.';
        if (response.status === 'timeout') {
          errorMessage = '응답 시간이 초과되었습니다. 다시 시도해주세요.';
        } else if (response.status === 'cancelled') {
          errorMessage = '요청이 취소되었습니다.';
        }
        
        setGeneratedCareerSentences([errorMessage]);
      }
    } catch (error) {
      console.error('💥 예상치 못한 오류:', error);
      
      if (error.name === 'AbortError') {
        console.log('⏹️ 요청이 취소되었습니다.');
        setGeneratedCareerSentences(["요청이 취소되었습니다."]);
      } else {
        setGeneratedCareerSentences([`오류: ${error.message || '알 수 없는 오류가 발생했습니다.'}`]);
      }
    }
    
    setIsCareerSentenceLoading(false);
  };

  // 컴포넌트 언마운트 시 진행 중인 요청 취소
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 최소한의 위/아래 여백, minHeight 조정
  return (
    <section
      id="career-sentence-generator"
      className="flex flex-col items-center scroll-mt-[150px] pt-6 pb-8 md:pt-10 md:pb-12 bg-background"
      style={{ minHeight: "42vh" }}
    >
      <div className="text-center mb-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          진로 문장 생성기
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-base text-muted-foreground">
          진로 문장을 통해 중구난방인 학생부를 막을 수 있습니다.
        </p>
      </div>
      <div className="w-full max-w-4xl px-[182px]">
        <div className="-mx-[182px]">
          <div className="py-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
              <div>
                <CareerSentenceGeneratorCard onGenerate={handleGenerateCareerSentence} />
              </div>
              <div>
                <TopicResultsCard
                  title="생성된 진로 문장"
                  placeholder="'문장 생성' 버튼을 누르면 진로 문장 1개가 생성됩니다."
                  topics={generatedCareerSentences}
                  onSelectTopic={onSelectCareerSentence}
                  isLoading={isCareerSentenceLoading}
                  isSelectable={true}
                  scrollable={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerSentenceGeneratorSection;
