import React, { useState } from 'react';
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";

const CareerSentenceGeneratorSection = () => {
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isCareerSentenceLoading, setIsCareerSentenceLoading] = useState(false);

  const handleGenerateCareerSentence = (inputs: { careerField: string; activity: string; file: File | null }) => {
    console.log("Generating career sentence with inputs:", inputs);
    setIsCareerSentenceLoading(true);
    setGeneratedCareerSentences([]);
    setTimeout(() => {
      const job = inputs.careerField || "희망 직업";
      
      let newSentences: string[];

      if (inputs.file) {
        newSentences = [
          `'${job}'가(이) 되고자 하는 목표를 구체화하기 위해 '${inputs.file.name}' 활동을 진행함.`,
          `이전 활동('${inputs.file.name}')을 통해 '${job}'에 대한 이해를 심화시키고, 필요한 역량을 탐색함.`,
          `'${inputs.file.name}'의 경험을 바탕으로 '${job}'가 되기 위한 자신만의 로드맵을 그림.`
        ];
      } else {
        newSentences = [
          `'${job}'가(이) 되어 사회에 기여하고 싶다는 포부를 밝힘.`,
          `'${job}'라는 장래희망을 이루기 위해 꾸준히 노력하는 모습을 보임.`,
          `자신의 강점과 '${job}'을(를) 연결하여 진로에 대한 깊이 있는 탐색을 수행함.`
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
