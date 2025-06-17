
import React, { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TopicData {
  grade: string;
  subject: string;
  topics: string[];
}

const RecordAnalysis = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [extractedTopics, setExtractedTopics] = useState<TopicData[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      toast({
        title: "지원하지 않는 파일 형식",
        description: "PDF 또는 이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // 실제 구현에서는 OCR/PDF 텍스트 추출 API를 사용해야 합니다
      // 여기서는 샘플 데이터로 시뮬레이션합니다
      await new Promise(resolve => setTimeout(resolve, 3000));

      const sampleData: TopicData[] = [
        {
          grade: "1학년",
          subject: "수학",
          topics: [
            "피보나치 수열과 황금비의 관계 탐구",
            "삼각함수를 이용한 건축물 설계 분석",
            "확률과 통계를 활용한 마케팅 전략 연구"
          ]
        },
        {
          grade: "1학년",
          subject: "물리",
          topics: [
            "태양광 패널의 효율성 최적화 연구",
            "진동과 파동을 이용한 지진 예측 시스템",
            "전자기 유도를 활용한 무선 충전 기술"
          ]
        },
        {
          grade: "2학년",
          subject: "화학",
          topics: [
            "친환경 세제의 화학적 성분 분석",
            "산화-환원 반응을 이용한 배터리 성능 개선",
            "분자 구조와 의약품 효능의 상관관계"
          ]
        },
        {
          grade: "2학년",
          subject: "생물",
          topics: [
            "미생물을 이용한 바이오 연료 생산 연구",
            "유전자 발현과 환경 요인의 관계",
            "식물의 광합성 효율과 LED 조명의 영향"
          ]
        },
        {
          grade: "3학년",
          subject: "사회",
          topics: [
            "디지털 격차와 사회 불평등 해결 방안",
            "도시화가 환경에 미치는 영향 분석",
            "글로벌 경제와 지역 경제의 상호작용"
          ]
        }
      ];

      setExtractedTopics(sampleData);
      toast({
        title: "파일 분석 완료",
        description: "학생부에서 탐구 주제를 성공적으로 추출했습니다.",
      });
    } catch (error) {
      toast({
        title: "파일 처리 오류",
        description: "파일을 처리하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const groupedByGrade = extractedTopics.reduce((acc, item) => {
    if (!acc[item.grade]) {
      acc[item.grade] = [];
    }
    acc[item.grade].push(item);
    return acc;
  }, {} as Record<string, TopicData[]>);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            학생부 탐구 주제 분석
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            생활기록부 파일을 업로드하면 각 과목별 탐구 주제를 자동으로 추출하여 정리해드립니다.
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              파일 업로드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                생활기록부 PDF 파일 또는 이미지를 업로드해주세요
              </p>
              <Input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="max-w-sm mx-auto"
              />
              {isUploading && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">파일을 분석하고 있습니다...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {extractedTopics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>추출된 탐구 주제</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={Object.keys(groupedByGrade)[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  {Object.keys(groupedByGrade).map((grade) => (
                    <TabsTrigger key={grade} value={grade}>
                      {grade}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(groupedByGrade).map(([grade, subjects]) => (
                  <TabsContent key={grade} value={grade} className="mt-6">
                    <div className="space-y-6">
                      {subjects.map((subjectData, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-xl">{subjectData.subject}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-20">순번</TableHead>
                                  <TableHead>탐구 주제</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subjectData.topics.map((topic, topicIndex) => (
                                  <TableRow key={topicIndex}>
                                    <TableCell className="font-medium">
                                      {topicIndex + 1}
                                    </TableCell>
                                    <TableCell>{topic}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default RecordAnalysis;
