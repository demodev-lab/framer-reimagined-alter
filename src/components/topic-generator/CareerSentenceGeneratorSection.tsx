
import React, { useState } from 'react';
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";

const CareerSentenceGeneratorSection = () => {
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isCareerSentenceLoading, setIsCareerSentenceLoading] = useState(false);

  const handleGenerateCareerSentence = (inputs: { careerField: string; activity: string; realization: string }) => {
    console.log("Generating career sentence with inputs:", inputs);
    setIsCareerSentenceLoading(true);
    setGeneratedCareerSentences([]);
    setTimeout(() => {
      const newSentences = [
        `'${inputs.careerField || '해당 진로'}' 분야에 대한 깊은 관심을 바탕으로, '${inputs.activity || '관련 활동'}'을 통해 '${inputs.realization || '중요한 점'}'라는 귀중한 깨달음을 얻음.`,
        `'${inputs.activity || '관련 활동'}' 경험은 '${inputs.careerField || '해당 진로'}'라는 진로 목표를 더욱 구체화하는 계기가 되었으며, 특히 '${inputs.realization || '중요한 점'}' 점이 인상적임.`,
        `자신의 진로인 '${inputs.careerField || '해당 진로'}'와 관련하여 '${inputs.activity || '관련 활동'}'을 주도적으로 수행하며 '${inputs.realization || '중요한 점'}'라는 점을 배우고 성장하는 모습을 보임.`
      ];
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
                  onSelectTopic={() => {}}
                  isLoading={isCareerSentenceLoading}
                  isSelectable={false}
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
