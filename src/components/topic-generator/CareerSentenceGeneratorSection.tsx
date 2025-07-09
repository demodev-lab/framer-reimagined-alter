import React, { useState } from 'react';
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";

interface CareerSentenceGeneratorSectionProps {
  onSelectCareerSentence: (sentence: string | null) => void;
}

const CareerSentenceGeneratorSection: React.FC<CareerSentenceGeneratorSectionProps> = ({ onSelectCareerSentence }) => {
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isCareerSentenceLoading, setIsCareerSentenceLoading] = useState(false);

  const handleGenerateCareerSentence = async (inputs: { careerField: string; activity: string; file: File | null; aspiration: string; }, webhookResponse?: string[]) => {
    onSelectCareerSentence(null);
    setIsCareerSentenceLoading(true);
    setGeneratedCareerSentences([]);
    
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
    
    // Always make API call (no webhook response is passed anymore)
    try {
      const webhookData = {
        careerField: inputs.careerField,
        request: inputs.activity,
        aspiration: inputs.activity === '직업을 가진 후 하고 싶은 것이 있습니다.' ? inputs.aspiration : null
      };
      
      console.log('🚀 진로 문장 생성 요청 시작...');
      
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
      
      console.log('✅ 웹훅 응답 수신:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎯 N8N이 전달한 원본 데이터:', data);
        console.log('🎯 데이터 타입:', typeof data);
        console.log('🎯 JSON.stringify:', JSON.stringify(data, null, 2));
        
        // N8N이 전달한 데이터를 그대로 문자열로 변환해서 표시
        let resultText = '';
        
        if (typeof data === 'string') {
          resultText = data;
        } else if (data && typeof data === 'object') {
          // 객체의 모든 값을 확인해서 문자열인 것 중 가장 긴 것을 선택
          const allValues = [];
          const extractValues = (obj) => {
            if (typeof obj === 'string' && obj.trim()) {
              allValues.push(obj.trim());
            } else if (obj && typeof obj === 'object') {
              Object.values(obj).forEach(extractValues);
            }
          };
          extractValues(data);
          
          console.log('🎯 추출된 모든 문자열 값들:', allValues);
          
          // 가장 긴 문자열을 진로 문장으로 선택
          if (allValues.length > 0) {
            resultText = allValues.reduce((longest, current) => 
              current.length > longest.length ? current : longest
            );
          }
        }
        
        console.log('🎯 최종 선택된 텍스트:', resultText);
        
        if (resultText) {
          setGeneratedCareerSentences([resultText]);
        } else {
          console.error('❌ 사용 가능한 텍스트를 찾을 수 없습니다');
          setGeneratedCareerSentences(["텍스트를 추출할 수 없습니다. N8N 응답을 확인해주세요."]);
        }
      } else {
        console.error('❌ HTTP 응답 오류:', response.status, response.statusText);
        const errorText = await response.text().catch(() => '응답 내용 없음');
        console.error('응답 내용:', errorText);
        setGeneratedCareerSentences([`서버 오류 (${response.status}): 잠시 후 다시 시도해주세요.`]);
      }
    } catch (error) {
      console.error('💥 Webhook 호출 실패:', error);
      console.error('에러 타입:', error.name);
      console.error('에러 메시지:', error.message);
      
      if (error.name === 'AbortError') {
        console.log('⏹️ 요청이 사용자에 의해 취소되었습니다.');
        setGeneratedCareerSentences(["요청이 취소되었습니다."]);
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🌐 네트워크 연결 오류 감지');
        setGeneratedCareerSentences(["네트워크 연결을 확인해주세요."]);
      } else {
        console.error('🔥 예상치 못한 에러:', error);
        setGeneratedCareerSentences([`오류: ${error.message || '알 수 없는 오류가 발생했습니다.'}`]);
      }
    }
    
    setIsCareerSentenceLoading(false);
  };

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
