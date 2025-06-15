
import React, { useState } from 'react';
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";

const CareerSentenceGeneratorSection = () => {
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isCareerSentenceLoading, setIsCareerSentenceLoading] = useState(false);

  const handleGenerateCareerSentence = (inputs: { careerField: string; activity: string; realization: string; problem: string; file: File | null }) => {
    console.log("Generating career sentence with inputs:", inputs);
    setIsCareerSentenceLoading(true);
    setGeneratedCareerSentences([]);
    setTimeout(() => {
      const job = inputs.careerField || "희망 직업";
      const problem = inputs.problem || "사회/과학적 문제";
      const solution = inputs.realization || "창의적 해결 방안";

      const corePhrase = `'${solution}'을(를) 활용하여 '${problem}'을(를) 해결하는 '${job}'`;
      
      let newSentences: string[];

      if (inputs.file) {
        newSentences = [
          `${corePhrase}가 되고자 함.`,
          `'${inputs.file.name}' 파일의 내용을 바탕으로, ${corePhrase}가 되기 위한 구체적인 계획을 세움.`,
          `'${inputs.file.name}'에서 발견된 '${problem}'을(를) '${solution}'을(를) 통해 해결하는 '${job}'로서의 역할을 탐색함.`
        ];
      } else {
        newSentences = [
          `${corePhrase}가 되고자 함.`,
          `'${job}'로서 '${problem}' 해결에 '${solution}'을(를) 적용하는 방안에 대해 깊이 고민하는 모습을 보임.`,
          `장차 ${corePhrase}가 되어 사회에 기여하고 싶다는 강한 의지를 드러냄.`
        ];
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
