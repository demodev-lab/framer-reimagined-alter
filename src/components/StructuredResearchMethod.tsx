import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Beaker, Target, Lightbulb, Package, Settings, BarChart, AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface StructuredResearchMethodProps {
  method: string;
  index: number;
}

interface ParsedMethod {
  탐구주제?: string;
  탐구목표?: any;
  탐구가설?: string;
  필요한준비물?: any[];
  단계별프로토콜?: any;
  데이터분석및결과도출?: any;
  주의사항?: any;
  참고자료?: any[];
}

const StructuredResearchMethod: React.FC<StructuredResearchMethodProps> = ({ method, index }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    goals: false,
    hypothesis: false,
    materials: false,
    protocol: false,
    analysis: false,
    precautions: false,
    references: false
  });


  const parseResearchMethod = (methodString: string): ParsedMethod | null => {
    try {
      console.log('🔍 원본 데이터:', methodString);
      
      // JSON 형태인지 확인
      if (methodString.trim().startsWith('{')) {
        const parsed = JSON.parse(methodString);
        console.log('🔍 파싱된 JSON:', parsed);
        
        // 여러 가능한 데이터 구조 체크
        let data = parsed.data || parsed;
        console.log('🔍 실제 데이터:', data);
        
        const result = {
          탐구주제: data['탐구 주제'] || data['탐구주제'],
          탐구목표: data['탐구 목표'] || data['탐구목표'] || null,
          탐구가설: data['탐구 가설'] || data['탐구가설'],
          필요한준비물: data['필요한 준비물'] || data['필요한준비물'],
          단계별프로토콜: data['단계별 프로토콜'] || data['단계별프로토콜'] || null,
          데이터분석및결과도출: data['데이터 분석 및 결과 도출'] || data['데이터분석및결과도출'] || null,
          주의사항: data['주의사항'] || null,
          참고자료: data['참고 자료'] || data['참고자료']
        };
        
        console.log('🎯 파싱 결과:', result);
        return result;
      }
      return null;
    } catch (error) {
      console.error('❌ JSON 파싱 실패:', error);
      console.error('❌ 원본 데이터:', methodString);
      return null;
    }
  };

  const parsedMethod = parseResearchMethod(method);

  if (!parsedMethod) {
    // 일반 텍스트인 경우 기존 방식 사용
    return (
      <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap leading-relaxed">
        <span className="font-medium text-primary">{index + 1}. </span>
        {method}
      </div>
    );
  }

  const SectionHeader = ({ icon: Icon, title, sectionKey }: { icon: any, title: string, sectionKey: string }) => (
    <CollapsibleTrigger asChild>
      <Button
        variant="ghost"
        className="w-full justify-start p-3 h-auto font-medium text-gray-800 hover:bg-gray-50"
      >
        <Icon className="w-4 h-4 mr-2 text-blue-600" />
        {title}
        {openSections[sectionKey] ? 
          <ChevronDown className="w-4 h-4 ml-auto" /> : 
          <ChevronRight className="w-4 h-4 ml-auto" />
        }
      </Button>
    </CollapsibleTrigger>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-blue-50 px-4 py-3 border-b">
        <h3 className="font-semibold text-lg text-gray-900">탐구 방법 {index + 1}</h3>
        {parsedMethod.탐구주제 && (
          <p className="text-sm text-gray-700 mt-1">{parsedMethod.탐구주제}</p>
        )}
      </div>

      <div className="space-y-1">
        {/* 탐구 목표 */}
        {parsedMethod.탐구목표 && (
          <Collapsible open={openSections['goals']} onOpenChange={(isOpen) => setOpenSections(prev => ({ ...prev, goals: isOpen }))}>
            <SectionHeader icon={Target} title="탐구 목표" sectionKey="goals" />
            <CollapsibleContent className="px-4 pb-3">
              {parsedMethod.탐구목표?.['주요 목표'] && (
                <div className="mb-3">
                  <h4 className="font-medium text-gray-800 mb-2">주요 목표</h4>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">{parsedMethod.탐구목표['주요 목표']}</p>
                </div>
              )}
              {parsedMethod.탐구목표?.['세부 목표'] && Array.isArray(parsedMethod.탐구목표['세부 목표']) && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">세부 목표</h4>
                  <ul className="space-y-2">
                    {parsedMethod.탐구목표['세부 목표'].map((goal, idx) => (
                      <li key={idx} className="text-sm text-gray-700 bg-gray-50 p-2 rounded flex">
                        <span className="text-blue-600 font-medium mr-2">{idx + 1}.</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 탐구 가설 */}
        {parsedMethod.탐구가설 && (
          <Collapsible open={openSections['hypothesis']} onOpenChange={(isOpen) => setOpenSections(prev => ({ ...prev, hypothesis: isOpen }))}>
            <SectionHeader icon={Lightbulb} title="탐구 가설" sectionKey="hypothesis" />
            <CollapsibleContent className="px-4 pb-3">
              <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded leading-relaxed">{parsedMethod.탐구가설}</p>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 필요한 준비물 */}
        {parsedMethod.필요한준비물 && parsedMethod.필요한준비물.length > 0 && (
          <Collapsible open={openSections['materials']} onOpenChange={(isOpen) => setOpenSections(prev => ({ ...prev, materials: isOpen }))}>
            <SectionHeader icon={Package} title="필요한 준비물" sectionKey="materials" />
            <CollapsibleContent className="px-4 pb-3">
              <div className="space-y-3">
                {parsedMethod.필요한준비물.map((item, idx) => (
                  <div key={idx} className="bg-green-50 p-3 rounded border border-green-100">
                    <h4 className="font-medium text-gray-800 mb-1">{item['항목'] || item.항목 || `준비물 ${idx + 1}`}</h4>
                    {(item['사용 목적'] || item.사용목적) && (
                      <p className="text-sm text-green-700 mb-1"><strong>사용 목적:</strong> {item['사용 목적'] || item.사용목적}</p>
                    )}
                    {item.설명 && (
                      <p className="text-sm text-gray-600">{item.설명}</p>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 단계별 프로토콜 */}
        {parsedMethod.단계별프로토콜 && (
          <Collapsible open={openSections['protocol']} onOpenChange={(isOpen) => setOpenSections(prev => ({ ...prev, protocol: isOpen }))}>
            <SectionHeader icon={Settings} title="단계별 프로토콜" sectionKey="protocol" />
            <CollapsibleContent className="px-4 pb-3">
              <div className="space-y-4">
                {Object.entries(parsedMethod.단계별프로토콜).map(([sectionKey, sectionData], sectionIdx) => {
                  if (!sectionData || !Array.isArray(sectionData)) return null;
                  
                  const sectionColors = [
                    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', accent: 'text-blue-600', badgeBg: 'bg-blue-100' },
                    { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', accent: 'text-green-600', badgeBg: 'bg-green-100' },
                    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', accent: 'text-purple-600', badgeBg: 'bg-purple-100' }
                  ];
                  const colors = sectionColors[sectionIdx % sectionColors.length];
                  
                  return (
                    <div key={sectionKey}>
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <div className={`w-6 h-6 ${colors.badgeBg} rounded-full flex items-center justify-center mr-2`}>
                          <span className={`text-xs font-bold ${colors.accent}`}>{sectionIdx + 1}</span>
                        </div>
                        {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <div className="space-y-3 ml-8">
                        {sectionData.map((step, idx) => (
                          <div key={idx} className={`${colors.bg} p-3 rounded`}>
                            <h5 className={`font-medium ${colors.text} mb-2`}>
                              {step['단계'] || step['항목'] || step.title || `단계 ${idx + 1}`}
                            </h5>
                            {(step['상세 설명'] || step['상세설명'] || step.description) && (
                              <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                                {step['상세 설명'] || step['상세설명'] || step.description}
                              </p>
                            )}
                            {(step['입력 내용'] || step['입력내용'] || step.input) && (
                              <div className={`bg-white p-2 rounded border ${colors.border}`}>
                                <span className={`text-xs font-medium ${colors.accent}`}>입력 내용:</span>
                                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                                  {step['입력 내용'] || step['입력내용'] || step.input}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 데이터 분석 및 결과 도출 */}
        {parsedMethod.데이터분석및결과도출 && (
          <Collapsible open={openSections['analysis']} onOpenChange={(isOpen) => setOpenSections(prev => ({ ...prev, analysis: isOpen }))}>
            <SectionHeader icon={BarChart} title="데이터 분석 및 결과 도출" sectionKey="analysis" />
            <CollapsibleContent className="px-4 pb-3">
              <div className="space-y-4">
                {(parsedMethod.데이터분석및결과도출?.['분석 방법'] || parsedMethod.데이터분석및결과도출?.[분석방법]) && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">분석 방법</h4>
                    <ul className="space-y-2">
                      {(parsedMethod.데이터분석및결과도출['분석 방법'] || parsedMethod.데이터분석및결과도출.분석방법).map((method, idx) => (
                        <li key={idx} className="text-sm text-gray-700 bg-orange-50 p-2 rounded flex">
                          <span className="text-orange-600 font-medium mr-2">{idx + 1}.</span>
                          <span className="whitespace-pre-wrap">{method}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(parsedMethod.데이터분석및결과도출?.['결과 도출'] || parsedMethod.데이터분석및결과도출?.결과도출) && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">결과 도출</h4>
                    <ul className="space-y-2">
                      {(parsedMethod.데이터분석및결과도출['결과 도출'] || parsedMethod.데이터분석및결과도출.결과도출).map((result, idx) => (
                        <li key={idx} className="text-sm text-gray-700 bg-red-50 p-2 rounded flex">
                          <span className="text-red-600 font-medium mr-2">{idx + 1}.</span>
                          <span className="whitespace-pre-wrap">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 주의사항 */}
        {parsedMethod.주의사항 && (
          <Collapsible open={openSections['precautions']} onOpenChange={(isOpen) => setOpenSections(prev => ({ ...prev, precautions: isOpen }))}>
            <SectionHeader icon={AlertTriangle} title="주의사항" sectionKey="precautions" />
            <CollapsibleContent className="px-4 pb-3">
              <div className="space-y-4">
                {(parsedMethod.주의사항?.['실험 과정에서의 주의사항'] || parsedMethod.주의사항?.실험과정에서의주의사항) && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">실험 과정에서의 주의사항</h4>
                    <ul className="space-y-2">
                      {(parsedMethod.주의사항['실험 과정에서의 주의사항'] || parsedMethod.주의사항.실험과정에서의주의사항).map((precaution, idx) => (
                        <li key={idx} className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400 whitespace-pre-wrap">
                          {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(parsedMethod.주의사항?.['예상 문제와 해결책'] || parsedMethod.주의사항?.예상문제와해결책) && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">예상 문제와 해결책</h4>
                    <div className="space-y-3">
                      {(parsedMethod.주의사항['예상 문제와 해결책'] || parsedMethod.주의사항.예상문제와해결책).map((item, idx) => (
                        <div key={idx} className="bg-red-50 p-3 rounded border border-red-100">
                          <h5 className="font-medium text-red-800 mb-1">문제: {item['문제'] || item.문제}</h5>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap"><strong>해결책:</strong> {item['해결책'] || item.해결책}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 참고자료 */}
        {parsedMethod.참고자료 && parsedMethod.참고자료.length > 0 && (
          <Collapsible open={openSections['references']} onOpenChange={(isOpen) => setOpenSections(prev => ({ ...prev, references: isOpen }))}>
            <SectionHeader icon={BookOpen} title="참고자료" sectionKey="references" />
            <CollapsibleContent className="px-4 pb-3">
              <div className="space-y-3">
                {parsedMethod.참고자료.map((ref, idx) => (
                  <div key={idx} className="bg-indigo-50 p-3 rounded border border-indigo-100">
                    <h4 className="font-medium text-indigo-800 mb-1">{ref['제목'] || ref.제목 || `참고자료 ${idx + 1}`}</h4>
                    {(ref['설명'] || ref.설명) && <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">{ref['설명'] || ref.설명}</p>}
                    {(ref['링크'] || ref.링크) && (
                      <a 
                        href={ref['링크'] || ref.링크} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                      >
                        링크 바로가기 →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default StructuredResearchMethod;