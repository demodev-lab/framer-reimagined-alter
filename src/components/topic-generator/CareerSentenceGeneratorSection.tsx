
import React, { useState } from 'react';
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";

interface CareerSentenceGeneratorSectionProps {
  onSelectCareerSentence: (sentence: string | null) => void;
}

const CareerSentenceGeneratorSection: React.FC<CareerSentenceGeneratorSectionProps> = ({ onSelectCareerSentence }) => {
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isCareerSentenceLoading, setIsCareerSentenceLoading] = useState(false);

  const handleGenerateCareerSentence = (inputs: { careerField: string; activity: string; }) => {
    onSelectCareerSentence(null);
    console.log("Generating career sentence with inputs:", inputs);
    setIsCareerSentenceLoading(true);
    setGeneratedCareerSentences([]);
    setTimeout(() => {
      const job = inputs.careerField.trim() || "희망 직업";
      
      let newSentences: string[];

      switch (inputs.activity) {
        case "이전 활동이 존재합니다.":
          newSentences = [
            `심화된 전공 지식을 활용하여 기존 기술의 한계를 극복하는 ${job}`,
            `구체적인 활동 경험을 바탕으로 실제 현장의 문제를 해결하는 ${job}`,
            `데이터 분석 및 활용 능력을 통해 미래 산업의 새로운 가능성을 탐색하는 ${job}`
          ];
          break;
        case "직업을 가진 후 하고 싶은 것이 있습니다.":
          newSentences = [
            `혁신적인 기술을 통해 인류가 직면한 난제를 해결하는 데 기여하는 ${job}`,
            `지속 가능한 발전을 목표로 사회 및 환경 문제를 해결하는 ${job}`,
            `기술을 통해 사회적 약자를 돕고 더 나은 세상을 만드는 데 기여하는 ${job}`
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

  return (
    <section id="career-sentence-generator" className="flex flex-col items-center scroll-mt-[150px] mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          진로 문장 생성기
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-base text-muted-foreground">
          진로 문장을 통해 중구난방인 학생부를 막을 수 있습니다.
        </p>
      </div>
      <div className="w-full max-w-4xl px-[182px]">
        <div className="-mx-[182px]">
          <div className="py-8">
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
