import React, { useState } from 'react';
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";

interface CareerSentenceGeneratorSectionProps {
  onSelectCareerSentence: (sentence: string | null) => void;
}

const CareerSentenceGeneratorSection: React.FC<CareerSentenceGeneratorSectionProps> = ({ onSelectCareerSentence }) => {
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isCareerSentenceLoading, setIsCareerSentenceLoading] = useState(false);

  const handleGenerateCareerSentence = (inputs: { careerField: string; activity: string; file: File | null; aspiration: string; }) => {
    onSelectCareerSentence(null);
    setIsCareerSentenceLoading(true);
    setGeneratedCareerSentences([]);
    setTimeout(() => {
      const job = inputs.careerField.trim() || "희망 직업";
      
      let newSentences: string[];

      switch (inputs.activity) {
        case "이전 활동이 존재합니다.":
          const fileName = inputs.file?.name ? `'${inputs.file.name}' 파일에 기록된 활동` : "이전 활동";
          newSentences = [
            `${fileName} 경험을 통해 발견한 문제점을 해결하여 전문성을 강화하는 ${job}`,
            `${fileName}에서 얻은 역량을 바탕으로 새로운 가치를 창출하는 ${job}`,
            `심화된 전공 지식을 ${fileName}과 연결하여 융합적 역량을 갖춘 ${job}`
          ];
          break;
        case "직업을 가진 후 하고 싶은 것이 있습니다.":
          const aspiration = inputs.aspiration.trim() || "사회에 기여";
          newSentences = [
            `'${aspiration}'을(를) 목표로 삼아 사회 발전에 기여하는 ${job}`,
            `'${aspiration}'을(를) 실현하기 위한 구체적인 기술적, 사회적 해결책을 탐구하는 ${job}`,
            `'${aspiration}'이라는 비전을 통해 인류의 삶에 긍정적인 영향을 미치는 ${job}`
          ];
          break;
        default: // "요청 사항 없음."
          newSentences = [
            `첨단 기술을 활용하여 특정 산업 분야의 문제를 해결하는 ${job}`,
            `창의적인 아이디어를 통해 사람들의 일상에 긍정적인 변화를 가져오는 ${job}`,
            `자신의 전문성을 바탕으로 사회 발전에 기여하는 책임감 있는 ${job}`
          ];
          break;
      }
      
      setGeneratedCareerSentences(newSentences);
      setIsCareerSentenceLoading(false);
    }, 1500);
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
                  placeholder="'문장 생성' 버튼을 누르면 진로 문장 3개가 생성됩니다."
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
