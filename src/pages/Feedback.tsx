
import React, { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ResearchTopicsResult from "@/components/ResearchTopicsResult";
import { extractTextFromFile, extractResearchTopics, GradeData } from "@/utils/textExtraction";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";

const Feedback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [researchData, setResearchData] = useState<GradeData[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (file: File) => {
    console.log("파일 업로드 시작:", file.name, file.type, file.size);
    
    setIsProcessing(true);
    setAnalysisComplete(false);
    setFileName(file.name);

    try {
      // 텍스트 추출
      console.log("1단계: 텍스트 추출 중...");
      const extractedText = await extractTextFromFile(file);
      console.log("텍스트 추출 완료:", extractedText);
      
      // 탐구 주제 분석 - 파일 정보도 함께 전달
      console.log("2단계: 탐구 주제 분석 중...");
      const topics = extractResearchTopics(extractedText, file.name, file.size);
      console.log("탐구 주제 분석 완료:", topics);
      
      setResearchData(topics);
      setAnalysisComplete(true);
      console.log("전체 처리 완료");
    } catch (error) {
      console.error('파일 처리 중 오류 발생:', error);
      alert('파일 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-16 md:py-[53px]">
          <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium mb-4">
            <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="m12 21.333-9.53125-5.5-1.21875-.75v-1.166l1.21875-.75 9.53125-5.5 9.5313 5.5 1.2187 0.75v1.1666l-1.2187.75z" fill="currentColor" />
              <path d="m1.25 7.5 10.75 6.25 10.75-6.25" stroke="var(--background)" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="m12 26.25v-12.5" stroke="var(--background)" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <span className="font-medium">탐구 연구소</span>
          </div>

          {/* Logo and Title Section */}
          <div className="flex flex-col items-center justify-center gap-6 mb-6">
            <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center shadow-lg">
              <svg fill="white" height="22" viewBox="0 0 24 24" width="22" xmlns="http://www.w3.org/2000/svg">
                <path d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z" fill="white" stroke="white" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">학생부 심폐 소생</h1>
          </div>

          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            생활기록부에서 탐구 주제를 추출하고 학년별, 과목별로 정리해드립니다
          </p>
        </section>

        <div className="flex flex-col items-center gap-8 pb-20">
          {!analysisComplete && (
            <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
          )}

          {isProcessing && (
            <Card className="w-full max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      파일 분석 중...
                    </h3>
                    <p className="text-gray-600">
                      {fileName}에서 탐구 주제를 추출하고 있습니다
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisComplete && (
            <>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Feedback;
