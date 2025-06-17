import React, { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ResearchTopicsResult from "@/components/ResearchTopicsResult";
import { extractTextFromFile, extractResearchTopics, GradeData } from "@/utils/textExtraction";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
      // 1단계: 텍스트 추출
      setProcessingStep("파일에서 텍스트를 추출하는 중...");
      console.log("1단계: 텍스트 추출 중...");
      const extractedText = await extractTextFromFile(file);
      console.log("텍스트 추출 완료, 길이:", extractedText.length);
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("파일에서 텍스트를 추출할 수 없습니다. 파일이 손상되었거나 텍스트가 포함되지 않았을 수 있습니다.");
      }

      // 2단계: 탐구 주제 분석
      setProcessingStep("텍스트에서 탐구 주제를 분석하는 중...");
      console.log("2단계: 탐구 주제 분석 중...");
      const topics = extractResearchTopics(extractedText, file.name, file.size);
      console.log("탐구 주제 분석 완료:", topics);
      setResearchData(topics);
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
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">학생부 심폐 소생</h1>
          </div>

          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            생활기록부에서 탐구 주제를 추출하고 학년별, 과목별로 정리해드립니다
          </p>
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