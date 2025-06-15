
import React, { useState } from 'react';
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";

const CareerSentenceGeneratorSection = () => {
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isCareerSentenceLoading, setIsCareerSentenceLoading] = useState(false);

  const handleGenerateCareerSentence = (inputs: { careerField: string; activity: string; realization: string; file: File | null }) => {
    console.log("Generating career sentence with inputs:", inputs);
    setIsCareerSentenceLoading(true);
    setGeneratedCareerSentences([]);
    setTimeout(() => {
      let newSentences: string[];
      if (inputs.file) {
        // Mock analysis of the file and generate sentences based on the new format
        const problem = "학생부 기록 분석을 통해 발견된 학업 성취도 불균형 문제";
        const solution = inputs.realization || `데이터 기반 맞춤형 학습 전략 수립`;
        const job = inputs.careerField || "교육 컨설턴트";
        
        newSentences = [
          `'${solution}'을(를) 활용하여 '${problem}'을(를) 해결하는 '${job}'가 되고자 함.`,
          `'${inputs.file.name}' 파일 분석 결과, '${solution}'을(를) 활용하여 '${problem}'을(를) 해결하는 '${job}'로서의 성장 가능성을 확인함.`,
          `'${job}'가 되어, '${inputs.file.name}'에서 나타난 '${problem}'와 같은 교육적 난제를 '${solution}'으로 해결하고 싶다는 포부를 밝힘.`
        ];
      } else {
        newSentences = [
          `'${inputs.careerField || '해당 진로'}' 분야에 대한 깊은 관심을 바탕으로, '${inputs.activity || '관련 활동'}'을 통해 '${inputs.realization || '중요한 점'}'라는 귀중한 깨달음을 얻음.`,
          `'${inputs.activity || '관련 활동'}' 경험은 '${inputs.careerField || '해당 진로'}'라는 진로 목표를 더욱 구체화하는 계기가 되었으며, 특히 '${inputs.realization || '중요한 점'}' 점이 인상적임.`,
          `자신의 진로인 '${inputs.careerField || '해당 진로'}'와 관련하여 '${inputs.activity || '관련 활동'}'을 주도적으로 수행하며 '${inputs.realization || '중요한 점'}'라는 점을 배우고 성장하는 모습을 보임.`
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
