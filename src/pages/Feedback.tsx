import React, { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ResearchTopicsResult from "@/components/ResearchTopicsResult";
import { extractTextFromFile, extractResearchTopics, GradeData } from "@/utils/textExtraction";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 고정된 샘플 데이터
const SAMPLE_DATA: GradeData[] = [{
  grade: 1,
  subjects: [{
    subject: "수학",
    topics: ["이차함수의 최댓값과 최솟값을 이용한 실생활 문제 해결 탐구", "확률과 통계를 활용한 스포츠 경기 결과 예측 모델 연구", "삼각함수를 이용한 건축물의 높이 측정 방법 탐구"]
  }, {
    subject: "과학",
    topics: ["식물의 광합성 효율을 높이는 LED 조명 조건 실험", "산성비가 식물 성장에 미치는 영향 관찰 실험", "재생 가능 에너지를 활용한 소형 발전기 제작"]
  }, {
    subject: "국어",
    topics: ["고전 문학 작품 속 화자의 정서 변화 양상 분석", "현대 시에 나타난 공간 의식과 화자의 정체성 탐구", "문학 작품을 통한 시대적 배경과 사회 의식 연구"]
  }]
}, {
  grade: 2,
  subjects: [{
    subject: "수학",
    topics: ["미분을 이용한 최적화 문제 해결과 실생활 적용 사례 연구", "지수함수와 로그함수를 활용한 인구 증가 모델 분석", "행렬을 이용한 암호화 시스템의 원리와 응용 탐구"]
  }, {
    subject: "물리",
    topics: ["단진동을 이용한 지진 감지 시스템의 원리 탐구", "전자기 유도 현상을 활용한 무선 충전 기술 연구", "파동의 간섭을 이용한 소음 제거 장치 설계"]
  }, {
    subject: "화학",
    topics: ["친환경 세제 제작을 위한 계면활성제 성질 연구", "화학 반응 속도에 영향을 미치는 촉매의 역할 실험", "산화-환원 반응을 이용한 배터리 성능 개선 연구"]
  }, {
    subject: "영어",
    topics: ["영어 문학 작품 속 문화적 배경과 언어적 특징 분석", "글로벌 커뮤니케이션에서 영어의 역할과 변화 양상 연구", "영어 학습에서 멀티미디어 활용의 효과성 탐구"]
  }]
}, {
  grade: 3,
  subjects: [{
    subject: "수학",
    topics: ["적분을 활용한 물체의 부피와 넓이 계산 방법 연구", "확률분포를 이용한 품질관리 시스템 설계", "복소수를 활용한 교류 회로 분석과 응용"]
  }, {
    subject: "생명과학",
    topics: ["유전자 발현 조절 메커니즘과 질병과의 상관관계 연구", "생태계 먹이사슬에서 생물다양성 보전 방안 탐구", "세포 분열 과정에서 발생하는 돌연변이 원인 분석"]
  }, {
    subject: "지구과학",
    topics: ["기후 변화가 해수면 상승에 미치는 영향 분석", "화산 활동과 지진 발생의 상관관계 연구", "태양계 행성의 궤도 운동과 케플러 법칙 검증"]
  }, {
    subject: "사회",
    topics: ["도시화 과정에서 나타나는 사회 문제와 해결 방안 연구", "경제 성장과 환경 보호의 균형점 찾기 프로젝트", "민주주의 발전 과정에서 시민 참여의 중요성 탐구"]
  }]
}];
const Feedback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [researchData, setResearchData] = useState<GradeData[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [processingStep, setProcessingStep] = useState<string>("");
  const [error, setError] = useState<string>("");
  const {
    toast
  } = useToast();
  const handleFileUpload = async (file: File) => {
    console.log("파일 업로드 시작:", file.name, file.type, file.size);
    setIsProcessing(true);
    setAnalysisComplete(false);
    setError("");
    setFileName(file.name);
    try {
      // 1단계: 텍스트 추출 시뮬레이션
      setProcessingStep("파일에서 텍스트를 추출하는 중...");
      console.log("1단계: 텍스트 추출 중...");

      // 실제 텍스트 추출 대신 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2단계: 탐구 주제 분석 시뮬레이션
      setProcessingStep("텍스트에서 탐구 주제를 분석하는 중...");
      console.log("2단계: 탐구 주제 분석 중...");

      // 분석 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 고정된 샘플 데이터 설정
      setResearchData(SAMPLE_DATA);
      setAnalysisComplete(true);
      setProcessingStep("");
      toast({
        title: "분석 완료",
        description: `${file.name}에서 탐구 주제를 성공적으로 추출했습니다.`
      });
      console.log("전체 처리 완료");
    } catch (error: any) {
      console.error('파일 처리 중 오류 발생:', error);
      const errorMessage = error.message || '파일 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast({
        title: "오류 발생",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };
  return <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-16 md:py-[53px]">
          <div className="flex flex-col items-center justify-center gap-6 mb-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-4xl">학생부 분석</h1>
          </div>

          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-base">생활기록부에서 탐구 주제를 추출하고 학년별, 과목별로 정리해드립니다.
정리된 내용을 바탕으로 '진로 문장'까지 한번에 확보 가능합니다.</p>
        </section>

        <div className="flex flex-col items-center gap-8 pb-20">
          {!analysisComplete && !error && <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />}

          {isProcessing && <Card className="w-full max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      파일 분석 중...
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {fileName}
                    </p>
                    {processingStep && <p className="text-sm text-blue-600">
                        {processingStep}
                      </p>}
                  </div>
                </div>
              </CardContent>
            </Card>}

          {error && <Card className="w-full max-w-2xl mx-auto bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-semibold">오류 발생</span>
                </div>
                <p className="text-gray-700 mb-4">
                  {error}
                </p>
                <button onClick={() => {
              setError("");
              setAnalysisComplete(false);
            }} className="text-blue-600 hover:text-blue-800 underline">
                  다시 시도하기
                </button>
              </CardContent>
            </Card>}

          {analysisComplete && !error && <>
              <Card className="w-full max-w-2xl mx-auto bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">분석 완료</span>
                  </div>
                  <p className="text-gray-700">
                    {fileName}에서 탐구 주제를 성공적으로 추출했습니다
                  </p>
                </CardContent>
              </Card>
              
              <ResearchTopicsResult data={researchData} />
            </>}
        </div>
      </main>
    </div>;
};
export default Feedback;