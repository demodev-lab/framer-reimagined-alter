// N8N 웹훅으로부터 받은 탐구 방법 데이터를 파싱하는 유틸리티

export interface ParsedResearchMethod {
  탐구주제: string;
  탐구목표: {
    주요목표: string;
    세부목표: string[];
  };
  탐구가설: string;
  필요한준비물: Array<{
    항목: string;
    사용목적: string;
    설명: string;
    대체준비물?: string;
  }>;
  단계별프로토콜: {
    [category: string]: Array<{
      단계?: string;
      항목?: string;
      상세설명: string;
      입력내용?: string;
    }>;
  };
  데이터분석및결과도출?: {
    분석방법?: string[];
    결과도출?: string[];
  };
  주의사항?: {
    실험과정에서의주의사항?: string[];
    예상문제와해결책?: Array<{
      문제: string;
      해결책: string;
    }>;
  };
  참고자료?: Array<{
    제목: string;
    설명: string;
    링크: string;
  }>;
}

export function parseN8NResearchMethods(data: any): ParsedResearchMethod[] {
  try {
    console.log('🔍 N8N 데이터 파싱 시작:', data);
    
    // 새로운 응답 구조 처리 (workflowType: protocol)
    if (data && data.workflowType === 'protocol') {
      console.log('🔍 Protocol 워크플로우 응답 감지');
      
      // 에러가 있는 경우 처리
      if (data.data && data.data.error === 'FINAL_JSON_PARSE_FAILED') {
        console.log('⚠️ JSON 파싱 에러 감지, original_output 파싱 시도');
        
        // original_output에서 JSON 추출 시도
        const originalOutput = data.data.original_output;
        if (originalOutput) {
          try {
            // ```json ... ``` 패턴에서 JSON 추출
            const jsonMatch = originalOutput.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
              const parsedJson = JSON.parse(jsonMatch[1]);
              console.log('✅ original_output에서 JSON 추출 성공');
              
              // 단일 객체를 배열로 변환
              return [parsedJson];
            }
          } catch (parseError) {
            console.error('original_output 파싱 실패:', parseError);
            
            // 파싱 실패 시 원본 텍스트를 간단한 형태로 변환
            return [{
              탐구주제: '탐구 방법 생성 중 오류 발생',
              탐구목표: {
                주요목표: 'JSON 파싱 오류로 인해 탐구 방법을 표시할 수 없습니다.',
                세부목표: ['원본 데이터는 생성되었으나 형식 변환 중 오류가 발생했습니다.']
              },
              탐구가설: '다시 시도하거나 관리자에게 문의해주세요.',
              필요한준비물: [],
              단계별프로토콜: {},
              참고자료: []
            }];
          }
        }
      }
      
      // 정상적인 data가 있는 경우
      if (data.data && !data.data.error) {
        data = data.data;
      }
    }
    
    // 데이터가 배열인지 확인
    let researchData = Array.isArray(data) ? data : [data];
    
    return researchData.map((item: any) => {
      // 각 필드를 안전하게 파싱
      return {
        탐구주제: item['탐구 주제'] || item.탐구주제 || '탐구 주제 정보 없음',
        탐구목표: {
          주요목표: item['탐구 목표']?.['주요 목표'] || item.탐구목표?.주요목표 || '목표 정보 없음',
          세부목표: item['탐구 목표']?.['세부 목표'] || item.탐구목표?.세부목표 || []
        },
        탐구가설: item['탐구 가설'] || item.탐구가설 || '가설 정보 없음',
        필요한준비물: item['필요한 준비물'] || item.필요한준비물 || [],
        단계별프로토콜: item['단계별 프로토콜'] || item.단계별프로토콜 || {},
        데이터분석및결과도출: item['데이터 분석 및 결과 도출'] || item.데이터분석및결과도출,
        주의사항: item['주의사항'] || item.주의사항,
        참고자료: item['참고 자료'] || item.참고자료 || []
      };
    });
  } catch (error) {
    console.error('N8N 데이터 파싱 오류:', error);
    return [];
  }
}

export function formatResearchMethodForDisplay(methods: ParsedResearchMethod[]): string[] {
  if (!methods || methods.length === 0) {
    return ['탐구 방법 데이터를 불러올 수 없습니다.'];
  }

  const formatted: string[] = [];

  methods.forEach((method, index) => {
    if (methods.length > 1) {
      formatted.push(`=== 탐구 방법 ${index + 1} ===`);
    }

    // 탐구 주제
    formatted.push(`📋 **탐구 주제**`);
    formatted.push(method.탐구주제);
    formatted.push('');

    // 탐구 목표
    formatted.push(`🎯 **탐구 목표**`);
    formatted.push(`**주요 목표:** ${method.탐구목표.주요목표}`);
    if (method.탐구목표.세부목표.length > 0) {
      formatted.push(`**세부 목표:**`);
      method.탐구목표.세부목표.forEach((goal, i) => {
        formatted.push(`${i + 1}. ${goal}`);
      });
    }
    formatted.push('');

    // 탐구 가설
    formatted.push(`💡 **탐구 가설**`);
    formatted.push(method.탐구가설);
    formatted.push('');

    // 필요한 준비물
    if (method.필요한준비물.length > 0) {
      formatted.push(`🛠️ **필요한 준비물**`);
      method.필요한준비물.forEach((item, i) => {
        formatted.push(`**${i + 1}. ${item.항목}**`);
        formatted.push(`- 목적: ${item.사용목적}`);
        formatted.push(`- 설명: ${item.설명}`);
        if (item.대체준비물) {
          formatted.push(`- 대체 준비물: ${item.대체준비물}`);
        }
        formatted.push('');
      });
    }

    // 단계별 프로토콜
    if (Object.keys(method.단계별프로토콜).length > 0) {
      formatted.push(`📝 **단계별 프로토콜**`);
      Object.entries(method.단계별프로토콜).forEach(([category, steps]) => {
        formatted.push(`**${category}**`);
        steps.forEach((step, i) => {
          const title = step.단계 || step.항목 || `단계 ${i + 1}`;
          formatted.push(`**${title}**`);
          formatted.push(step.상세설명);
          if (step.입력내용) {
            formatted.push(`세부 내용: ${step.입력내용}`);
          }
          formatted.push('');
        });
      });
    }

    // 데이터 분석 및 결과 도출
    if (method.데이터분석및결과도출) {
      formatted.push(`📊 **데이터 분석 및 결과 도출**`);
      
      if (method.데이터분석및결과도출.분석방법) {
        formatted.push(`**분석 방법:**`);
        method.데이터분석및결과도출.분석방법.forEach((method, i) => {
          formatted.push(`${i + 1}. ${method}`);
        });
        formatted.push('');
      }

      if (method.데이터분석및결과도출.결과도출) {
        formatted.push(`**결과 도출:**`);
        method.데이터분석및결과도출.결과도출.forEach((result, i) => {
          formatted.push(`${i + 1}. ${result}`);
        });
        formatted.push('');
      }
    }

    // 주의사항
    if (method.주의사항) {
      formatted.push(`⚠️ **주의사항**`);
      
      if (method.주의사항.실험과정에서의주의사항) {
        formatted.push(`**실험 과정에서의 주의사항:**`);
        method.주의사항.실험과정에서의주의사항.forEach((caution, i) => {
          formatted.push(`${i + 1}. ${caution}`);
        });
        formatted.push('');
      }

      if (method.주의사항.예상문제와해결책) {
        formatted.push(`**예상 문제와 해결책:**`);
        method.주의사항.예상문제와해결책.forEach((item, i) => {
          formatted.push(`**문제 ${i + 1}:** ${item.문제}`);
          formatted.push(`**해결책:** ${item.해결책}`);
          formatted.push('');
        });
      }
    }

    // 참고 자료
    if (method.참고자료.length > 0) {
      formatted.push(`📚 **참고 자료**`);
      method.참고자료.forEach((ref, i) => {
        formatted.push(`**${i + 1}. ${ref.제목}**`);
        formatted.push(`${ref.설명}`);
        formatted.push(`링크: ${ref.링크}`);
        formatted.push('');
      });
    }

    if (methods.length > 1 && index < methods.length - 1) {
      formatted.push('---');
      formatted.push('');
    }
  });

  return formatted;
}