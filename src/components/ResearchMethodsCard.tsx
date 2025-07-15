
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, Target, Lightbulb, Settings, AlertTriangle, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import React, { useState } from "react";
import { parseN8NResearchMethods, formatResearchMethodForDisplay, type ParsedResearchMethod } from "@/utils/n8nDataParser";

interface ResearchMethodsCardProps {
  researchMethods: string[] | any[];
  isLoading: boolean;
  onGenerateDetailedMethods?: (currentTopic: string) => void;
  currentTopic?: string;
}

const ResearchMethodsCard: React.FC<ResearchMethodsCardProps> = ({
  researchMethods,
  isLoading,
  onGenerateDetailedMethods,
  currentTopic = '',
}) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  

  const handleMoreDetails = async () => {
    if (!onGenerateDetailedMethods || !currentTopic) {
      console.log("더 자세한 탐구 방법 생성 함수 또는 현재 주제가 없습니다.");
      return;
    }
    
    console.log("더 자세한 탐구 방법 생성 시작:", currentTopic);
    onGenerateDetailedMethods(currentTopic);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // N8N 데이터인지 일반 문자열 배열인지 확인
  const isN8NData = researchMethods.length > 0 && 
    typeof researchMethods[0] === 'object' && 
    researchMethods[0] !== null &&
    '탐구 주제' in researchMethods[0];

  let parsedMethods: ParsedResearchMethod[] = [];
  if (isN8NData) {
    parsedMethods = parseN8NResearchMethods(researchMethods);
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>탐구 방법</CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={handleMoreDetails}
            size="sm"
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
            title="초등학생도 할 수 있는 상세한 단계별 설명"
          >
            더 자세히
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pr-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : isN8NData && parsedMethods.length > 0 ? (
            // N8N 구조화된 데이터 렌더링
            <div className="space-y-6">
              {parsedMethods.map((method, methodIndex) => (
                <div key={methodIndex} className="space-y-4">
                  {parsedMethods.length > 1 && (
                    <div className="text-lg font-bold text-center border-b pb-2">
                      탐구 방법 {methodIndex + 1}
                    </div>
                  )}

                  {/* 탐구 주제 */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <h3 className="font-bold text-blue-800">탐구 주제</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">{method.탐구주제}</p>
                  </div>

                  {/* 탐구 목표 */}
                  <Collapsible>
                    <CollapsibleTrigger 
                      onClick={() => toggleSection(`goal-${methodIndex}`)}
                      className="flex items-center gap-2 w-full p-3 bg-green-50 rounded-lg border hover:bg-green-100 transition-colors"
                    >
                      <Target className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-green-800">탐구 목표</span>
                      <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${expandedSections[`goal-${methodIndex}`] ? 'rotate-90' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 p-4 bg-white rounded-lg border">
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-800">주요 목표:</span>
                          <p className="text-sm mt-1 text-gray-700">{method.탐구목표.주요목표}</p>
                        </div>
                        {method.탐구목표.세부목표.length > 0 && (
                          <div>
                            <span className="font-semibold text-gray-800">세부 목표:</span>
                            <ol className="list-decimal list-inside space-y-1 mt-1">
                              {method.탐구목표.세부목표.map((goal, i) => (
                                <li key={i} className="text-sm text-gray-700">{goal}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 탐구 가설 */}
                  <Collapsible>
                    <CollapsibleTrigger 
                      onClick={() => toggleSection(`hypothesis-${methodIndex}`)}
                      className="flex items-center gap-2 w-full p-3 bg-yellow-50 rounded-lg border hover:bg-yellow-100 transition-colors"
                    >
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      <span className="font-bold text-yellow-800">탐구 가설</span>
                      <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${expandedSections[`hypothesis-${methodIndex}`] ? 'rotate-90' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 p-4 bg-white rounded-lg border">
                      <p className="text-sm leading-relaxed text-gray-700">{method.탐구가설}</p>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 필요한 준비물 */}
                  {method.필요한준비물.length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger 
                        onClick={() => toggleSection(`materials-${methodIndex}`)}
                        className="flex items-center gap-2 w-full p-3 bg-orange-50 rounded-lg border hover:bg-orange-100 transition-colors"
                      >
                        <Settings className="h-5 w-5 text-orange-600" />
                        <span className="font-bold text-orange-800">필요한 준비물</span>
                        <span className="text-sm text-gray-600">({method.필요한준비물.length}개)</span>
                        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${expandedSections[`materials-${methodIndex}`] ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 p-4 bg-white rounded-lg border">
                        <div className="space-y-4">
                          {method.필요한준비물.map((item, i) => (
                            <div key={i} className="border-l-4 border-orange-300 pl-4">
                              <h4 className="font-semibold text-gray-800">{i + 1}. {item.항목}</h4>
                              <p className="text-sm text-gray-600 mt-1"><strong>목적:</strong> {item.사용목적}</p>
                              <p className="text-sm text-gray-600 mt-1"><strong>설명:</strong> {item.설명}</p>
                              {item.대체준비물 && (
                                <p className="text-sm text-gray-600 mt-1"><strong>대체 준비물:</strong> {item.대체준비물}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* 단계별 프로토콜 */}
                  {Object.keys(method.단계별프로토콜).length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger 
                        onClick={() => toggleSection(`protocol-${methodIndex}`)}
                        className="flex items-center gap-2 w-full p-3 bg-purple-50 rounded-lg border hover:bg-purple-100 transition-colors"
                      >
                        <FileText className="h-5 w-5 text-purple-600" />
                        <span className="font-bold text-purple-800">단계별 프로토콜</span>
                        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${expandedSections[`protocol-${methodIndex}`] ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 p-4 bg-white rounded-lg border">
                        <div className="space-y-6">
                          {Object.entries(method.단계별프로토콜).map(([category, steps], catIndex) => (
                            <div key={catIndex} className="space-y-3">
                              <h4 className="font-semibold text-purple-800 border-b border-purple-200 pb-2">{category}</h4>
                              <div className="space-y-3">
                                {steps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="bg-gray-50 p-3 rounded-lg">
                                    <h5 className="font-medium text-gray-800">
                                      {step.단계 || step.항목 || `단계 ${stepIndex + 1}`}
                                    </h5>
                                    <p className="text-sm text-gray-700 mt-1">{step.상세설명}</p>
                                    {step.입력내용 && (
                                      <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-300">
                                        <p className="text-sm text-blue-800">{step.입력내용}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* 주의사항 */}
                  {method.주의사항 && (
                    <Collapsible>
                      <CollapsibleTrigger 
                        onClick={() => toggleSection(`cautions-${methodIndex}`)}
                        className="flex items-center gap-2 w-full p-3 bg-red-50 rounded-lg border hover:bg-red-100 transition-colors"
                      >
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="font-bold text-red-800">주의사항</span>
                        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${expandedSections[`cautions-${methodIndex}`] ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 p-4 bg-white rounded-lg border">
                        <div className="space-y-4">
                          {method.주의사항.실험과정에서의주의사항 && (
                            <div>
                              <h4 className="font-semibold text-red-800">실험 과정에서의 주의사항:</h4>
                              <ul className="list-disc list-inside space-y-1 mt-2">
                                {method.주의사항.실험과정에서의주의사항.map((caution, i) => (
                                  <li key={i} className="text-sm text-gray-700">{caution}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {method.주의사항.예상문제와해결책 && (
                            <div>
                              <h4 className="font-semibold text-red-800">예상 문제와 해결책:</h4>
                              <div className="space-y-2 mt-2">
                                {method.주의사항.예상문제와해결책.map((item, i) => (
                                  <div key={i} className="bg-gray-50 p-3 rounded">
                                    <p className="text-sm font-medium text-gray-800">문제: {item.문제}</p>
                                    <p className="text-sm text-gray-700 mt-1">해결책: {item.해결책}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* 참고 자료 */}
                  {method.참고자료.length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger 
                        onClick={() => toggleSection(`references-${methodIndex}`)}
                        className="flex items-center gap-2 w-full p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <BookOpen className="h-5 w-5 text-gray-600" />
                        <span className="font-bold text-gray-800">참고 자료</span>
                        <span className="text-sm text-gray-600">({method.참고자료.length}개)</span>
                        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${expandedSections[`references-${methodIndex}`] ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 p-4 bg-white rounded-lg border">
                        <div className="space-y-3">
                          {method.참고자료.map((ref, i) => (
                            <div key={i} className="border-l-4 border-gray-300 pl-4">
                              <h4 className="font-semibold text-gray-800">{i + 1}. {ref.제목}</h4>
                              <p className="text-sm text-gray-600 mt-1">{ref.설명}</p>
                              <a href={ref.링크} target="_blank" rel="noopener noreferrer" 
                                 className="text-sm text-blue-600 hover:text-blue-800 underline mt-1 inline-block">
                                {ref.링크}
                              </a>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 기존 문자열 배열 렌더링
            <div className="space-y-4">
              {researchMethods.map((method, index) => (
                <div key={index} className="text-sm leading-relaxed">
                  <span className="font-medium text-primary">{index + 1}. </span>
                  {typeof method === 'string' ? method : JSON.stringify(method)}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchMethodsCard;
